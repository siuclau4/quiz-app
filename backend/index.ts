import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import mongoose from "mongoose";
import fetch from "node-fetch";

import { UserModel, QuizModel, IUser, IQuiz } from "./mongoose";

// Connecting to the database
mongoose
  .connect("mongodb://localhost:27017/quiz")
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const app = express();

function shuffle(array: string[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// use compression
app.use(compression());

// use CORS
app.use(cors());

// set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  const user: IUser | null = await UserModel.findOne({ name: "Bill" });
  res.send(user?.name || "hi");
});

app.get("/quiz", async (req, res) => {
  const { category } = req.query;

  let categoryName: string = "";

  switch (category) {
    case "1":
      categoryName = "General Knowledge";
    case "2":
      categoryName = "Sports";
    case "3":
      categoryName = "History";
  }

  // console.log(req.query);

  const quiz: IQuiz | null = await QuizModel.findOne({
    category: categoryName,
  });

  if (!quiz) {
    res.status(404).json({ message: "quiz not found" });
  }

  const quizContent = quiz?.content.map(
    (content: {
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
    }) => {
      let allAns = [...content.incorrect_answers];
      allAns.push(content.correct_answer);
      return { question: content.question, all_ans: shuffle(allAns) };
    }
  );

  res.json(quizContent);
});

app.post("/check", async (req, res) => {
  const { category, ans } = req.body;

  let categoryName: string = "";

  switch (category) {
    case "1":
      categoryName = "General Knowledge";
    case "2":
      categoryName = "Sports";
    case "3":
      categoryName = "History";
  }

  const quiz: IQuiz | null = await QuizModel.findOne({
    category: categoryName,
  });

  let correctAnsCount = 0;

  ans.forEach((item: string, index: number) => {
    if (item === quiz?.content[index].correct_answer) correctAnsCount++;
  });

  res.json({ score: Math.round((correctAnsCount / ans.length) * 100) });
});

app.listen(8080, () => {
  console.log("The application is listening on port 8080!");
});
