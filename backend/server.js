const express = require("express");
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("colors");

const path = require("path");

const connectDB = require("../config/connectDB");
const errorHandler = require("./midllewares/errorHandler");
const UserModel = require("./model/userModel");
const RoleModel = require("./model/roleModel");
const validateBody = require("./midllewares/validateBody");
const bodySchema = require("./schemas/bodySchema");
const authMidlleware = require("./midllewares/authMidlleware");

const configPath = path.join(__dirname, "..", "config", ".env");

require("dotenv").config({ path: configPath });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { PORT, DB_HOST } = process.env;

// const PORT = 62000
// registry - збееження нового користувача в бд
// autenticate - перевірка і порівняння з данними в бд
// авторизация - перевірка прав доступа
// логаут - выход из системы

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

    res.status(201).json({
      code: 201,
      data: {
        email: newUser.email,
        name: newUser.name,
      },
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

    res.status(200).json({
      code: 200,
      data: {
        email: user.email,
        name: user.name,
        token,
      },
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
