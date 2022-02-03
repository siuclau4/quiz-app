import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import mongoose from "mongoose";
import userRoute from "./routes/user";
import quizRoute from "./routes/quiz";
require("dotenv").config();

// Connecting to the database
console.log("db host: ", process.env.DB_HOST);

mongoose
  .connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/quiz`)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const app = express();

// use compression
app.use(compression());

// use CORS
app.use(cors());

// set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", quizRoute);

app.use("/user", userRoute);

app.listen(8080, () => {
  console.log("The application is listening on port 8080!");
});
