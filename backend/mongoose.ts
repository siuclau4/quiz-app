import { Schema, model, connect } from "mongoose";
import fetch from "node-fetch";
import { hashPassword } from "./hash";
require("dotenv").config();

export interface IUser {
  _id?: string;
  name: string;
  password: string;
  result: Array<{
    category: string;
    score: number;
  }>;
}

export interface IQuiz {
  category: string;
  content: [
    { question: string; correct_answer: string; incorrect_answers: string[] }
  ];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    result: [
      {
        category: String,
        score: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const QuizSchema = new Schema<IQuiz>(
  {
    category: String,
    content: [
      { question: String, correct_answer: String, incorrect_answers: [String] },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("User", UserSchema);

export const QuizModel = model<IQuiz>("Quiz", QuizSchema);

run().catch((err) => console.log(err));

async function run(): Promise<void> {
  // Connect to MongoDB
  await connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/quiz`);

  const quiz = await QuizModel.find();

  const demoUser = await UserModel.find({ name: "demouser" });

  if (demoUser.length === 0) {
    const password = await hashPassword("1234");
    const userDoc = new UserModel({
      name: "demouser",
      password,
      result: [
        {
          category: "General Knowledge",
          score: 66,
        },
        {
          category: "General Knowledge",
          score: 66,
        },
        {
          category: "General Knowledge",
          score: 100,
        },
        {
          category: "General Knowledge",
          score: 0,
        },
        {
          category: "Sports",
          score: 100,
        },
        {
          category: "Sports",
          score: 66,
        },
        {
          category: "Sports",
          score: 100,
        },
        {
          category: "Sports",
          score: 100,
        },
        {
          category: "Sports",
          score: 100,
        },
        {
          category: "Sports",
          score: 66,
        },
        {
          category: "History",
          score: 0,
        },
        {
          category: "History",
          score: 0,
        },
        {
          category: "History",
          score: 66,
        },
        {
          category: "History",
          score: 0,
        },
      ],
    });

    await userDoc.save();
  }

  if (quiz.length) return;

  const categoryArr = [
    { category: "General Knowledge", num: 9 },
    { category: "Sports", num: 21 },
    { category: "History", num: 23 },
  ];

  const userDoc = new UserModel({
    name: "demouser",
    password: hashPassword("1234"),
  });

  categoryArr.forEach(async (item) => {
    const fetchRes = await fetch(
      `https://opentdb.com/api.php?amount=3&category=${item.num}&difficulty=easy&type=multiple`
    );

    const res = await fetchRes.json();

    const doc = new QuizModel({
      category: item.category,
      content: res.results,
    });
    await doc.save();
  });
}
