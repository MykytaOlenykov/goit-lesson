const express = require("express");
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("colors");
const { engine } = require("express-handlebars");

const path = require("path");

const connectDB = require("../config/connectDB");
const sendEmail = require("./services/sendEmail");
const errorHandler = require("./midllewares/errorHandler");
const UserModel = require("./model/userModel");
const RoleModel = require("./model/roleModel");
const validateBody = require("./midllewares/validateBody");
const bodySchema = require("./schemas/bodySchema");
const authMidlleware = require("./midllewares/authMidlleware");

const configPath = path.join(__dirname, "..", "config", ".env");

require("dotenv").config({ path: configPath });

const app = express();

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { PORT, DB_HOST } = process.env;

// const PORT = 62000
// registry - збееження нового користувача в бд
// autenticate - перевірка і порівняння з данними в бд
// авторизация - перевірка прав доступа
// логаут - выход из системы

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/sended",
  asyncHandler(async (req, res) => {
    const template = `
    <h3>You got new email</h3>

      <h4>Contact send by: ${req.body.userName}</h4>
      <h4>Contact email is: ${req.body.userEmail}</h4>
      <h4>Text message: ${req.body.userMessage}</h4>`;

    const isSended = await sendEmail(template, req.body);

    if (!isSended) {
      res.status(400);
      throw new Error("Email did not send");
    }

    res.render("sended", {
      message: "Contact send success",
      user: req.body.userName,
      email: req.body.userEmail,
      text: req.body.userMessage,
    });
  })
);

app.post(
  "/register",
  validateBody(bodySchema),
  asyncHandler(async (req, res) => {
    /*
    1.получаем и валидурем данные с боди
    2.ищем пользователя в бд
    3.если нашли еррор 409
    4.все норм хеш пароля
    5.сохраняем юзера вместе с хеш паролем
    */
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all required fields");
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(409);
      throw new Error("User already exists");
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    const roles = await RoleModel.findOne({ value: "USER" });

    if (!roles) {
      res.status(400);
      throw new Error("Unable to set role");
    }

    const newUser = await UserModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });

    const template = `
    <h3>You got new email</h3>

    <a href="http://localhost:5000/verifyEmail/${newUser._id}" target="_blank">Verify my email</a>`;

    const isSended = await sendEmail(template, {
      userEmail: req.body.email,
      userMessage: "Email sended",
    });

    if (!isSended) {
      res.status(400);
      throw new Error("Email did not send");
    }

    // res.status(201).json({
    //   code: 201,
    //   data: {
    //     email: newUser.email,
    //     name: newUser.name,
    //   },
    // });

    res.status(201).render("registerSuccess", {
      email: newUser.email,
      name: newUser.name,
    });
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    /*
    1.получаем и валидурем данные с боди
    2.ищем пользователя в бд и расшифровуем пароль
    3.если не нашли или не расшифровали еррор "Invalid login or password"
    4.все норм выдаем токен
    5.сохраняем токен в бд
    */
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all required fields");
    }

    // const user = await UserModel.findOne({ email });
    // if (!user) {
    //   res.status(400);
    //   throw new Error("Invalid login or password");
    // }
    // const isValidPassword = bcryptjs.compareSync(password, user.password);
    // if (!isValidPassword) {
    //   res.status(400);
    //   throw new Error("Invalid login or password");
    // }

    const user = await UserModel.findOne({ email });

    const validUser = user
      ? bcryptjs.compareSync(password, user.password)
      : null;

    if (!validUser) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    const token = generateToken({
      friends: ["Tetiana", "Alona", "Nikita"],
      id: user._id,
      roles: user.roles,
    });

    user.token = token;
    await user.save();

    // res.status(200).json({
    //   code: 200,
    //   data: {
    //     email: user.email,
    //     name: user.name,
    //     token,
    //   },
    // });
    res.status(200).render("loginSuccess", {
      email: user.email,
      token,
    });
  })
);

app.post(
  "/logout",
  authMidlleware,
  asyncHandler(async (req, res) => {
    /*
      получаем юзера
      скидываем токен
      сейв в бд
     */

    const user = await UserModel.findById(req.user.id);

    if (!user.token) {
      res.status(400);
      throw new Error("User already logouted");
    }

    user.token = null;
    await user.save();

    res.status(200).json({
      code: 200,
      message: "Logout success",
    });
  })
);

app.get(
  "/verifyEmail/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.verifyEmail) {
      res.status(400);
      throw new Error("Email already verify");
    }

    user.verifyEmail = true;
    await user.save();

    const template = `
    <h3>You verified your email</h3>
    `;

    const isSended = await sendEmail(template, {
      userEmail: user.email,
      userMessage: "Email verified",
    });

    if (!isSended) {
      res.status(400);
      throw new Error("Email did not send");
    }

    res.status(200).render("verifiedEmail");
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
}

app.use("/api/v1", require("./routes/filmsRoutes"));
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running, PORT: ${PORT}`.green.italic.bold);
});
