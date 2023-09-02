const express = require("express");
require("colors");
const path = require("path");

const connectDB = require("../config/connectDB");
const errorHandler = require("./midllewares/errorHandler")

const configPath = path.join(__dirname, "..", "config", ".env");

require("dotenv").config({ path: configPath });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const { PORT, DB_HOST } = process.env;

// const PORT = 62000

app.use("/api/v1", require("./routes/filmsRoutes"));
app.use(errorHandler)

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running, PORT: ${PORT}`.green.italic.bold);
});
