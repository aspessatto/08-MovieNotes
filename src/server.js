require("dotenv");
require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations")
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require("./routes")
const uploadConfig = require("./configs/upload");
const cors = require("cors");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({status: "error", message: error.message});
  }

  console.error(error);

  return res.status(500).json({status: "error", message: "Internal Server Error"})
})  

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))