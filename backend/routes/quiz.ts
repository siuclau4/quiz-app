import express from "express";
import { authenticate, getUser } from "../guards";
import { IQuiz, IUser, QuizModel, UserModel } from "../mongoose";

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

const router = express.Router();

router.get("/quiz", getUser, async (req, res) => {
  // console.log(req.user);

  const { category } = req.query;

  let categoryName: string = "";

  switch (category) {
    case "1":
      categoryName = "General Knowledge";
      break;
    case "2":
      categoryName = "Sports";
      break;
    case "3":
      categoryName = "History";
      break;
  }

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

router.post("/check", getUser, async (req, res) => {
  const { category, ans } = req.body;

  const user: IUser | undefined = req.user;

  let categoryName: string = "";

  switch (category) {
    case "1":
      categoryName = "General Knowledge";
      break;
    case "2":
      categoryName = "Sports";
      break;
    case "3":
      categoryName = "History";
      break;
  }

  const quiz: IQuiz | null = await QuizModel.findOne({
    category: categoryName,
  });

  let correctAnsCount = 0;

  ans.forEach((item: string, index: number) => {
    if (item === quiz?.content[index].correct_answer) correctAnsCount++;
  });

  const score = Math.round((correctAnsCount / ans.length) * 100);

  if (user) {
    const newResult: { category: String; score: Number }[] = [
      ...user.result,
      { category: categoryName, score },
    ];

    await UserModel.findOneAndUpdate({ _id: user?._id }, { result: newResult });
  }

  res.json({ score });
});

router.get("/dashboard", authenticate, (req, res) => {
  const user: IUser | undefined = req.user;

  if (!user) {
    res.status(401).json({
      message: "unauthenticated",
    });
    return;
  }

  let count = 0;
  const result: { score: number; category: string }[] = [];
  const categoryArr: string[] = [];

  user.result.forEach((item) => {
    count += item.score;
    result.push({ score: item.score, category: item.category });
    categoryArr.push(item.category);
  });

  const removeDuplicateCategoryArr = [...new Set(categoryArr)];

  const passDataset = new Array(removeDuplicateCategoryArr.length).fill(0);
  const failDataset = new Array(removeDuplicateCategoryArr.length).fill(0);

  user.result.forEach((item) => {
    const index = removeDuplicateCategoryArr.indexOf(item.category);
    if (item.score >= 50) {
      passDataset[index]++;
    } else {
      failDataset[index]++;
    }
  });

  const barData = {
    labels: removeDuplicateCategoryArr,
    datasets: [
      {
        label: "Pass",
        data: passDataset,
        backgroundColor: ["rgba(20, 155, 20, 0.4)"],
      },
      {
        label: "Fail",
        data: failDataset,
        backgroundColor: ["rgba(255, 50, 132, 0.4)"],
      },
    ],
  };

  res.status(200).json({
    average_score: (count / user.result.length).toFixed(2) || 0,
    recent_record: result,
    bar_data: barData,
  });
  return;
});

export default router;
