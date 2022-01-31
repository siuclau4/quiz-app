import { Schema, model, connect } from "mongoose";
import fetch from "node-fetch";

// type result = Array<{
//   category: string;
//   score: number;
// }>;

export interface IUser {
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
  await connect("mongodb://localhost:27017/quiz");

  const quiz = await QuizModel.find();

  if (quiz.length) return;

  const categoryArr = [
    { category: "General Knowledge", num: 9 },
    { category: "Sports", num: 21 },
    { category: "History", num: 23 },
  ];

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
