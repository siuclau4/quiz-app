import { Alert, Radio, RadioChangeEvent, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppContext } from "../App";
import "./Quiz.scss";

interface IQuiz {
  question: string;
  all_ans: string[];
}

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [currQuizQuestion, setCurrQuizQuestion] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<string[]>([]);

  const [quiz, setQuiz] = useState<IQuiz[] | null>(null);

  const [score, setScore] = useState<number | null>(null);

  const [errMsg, setErrMsg] = useState<string>("");

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    getQuiz();
  }, []);

  useEffect(() => {
    if (category && selectedAns && currQuizQuestion === 3) {
      getScore(category, selectedAns, state.token);
    }
  }, [currQuizQuestion]);

  useEffect(() => {
    setStartTime(new Date());
  }, [quiz]);

  async function getQuiz() {
    try {
      const fetchRes = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/quiz?category=" + category
      );

      if (fetchRes.status === 404) {
        throw new Error("quiz not found");
        return;
      }

      if (fetchRes.status === 500) {
        throw new Error("internal server error");
      }

      const res = await fetchRes.json();

      setQuiz(res);
    } catch (err) {
      setErrMsg(err as string);
    }
  }

  async function getScore(
    category: string,
    selectedAns: string[],
    token: string | null
  ) {
    const headers: HeadersInit = token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
        };

    const fetchRes = await fetch(process.env.REACT_APP_BACKEND_URL + "/check", {
      method: "POST",
      headers,
      body: JSON.stringify({
        category,
        ans: selectedAns,
      }),
    });

    const res = await fetchRes.json();

    setScore(res.score);

    setEndTime(new Date());
  }

  function ansOnchange(e: RadioChangeEvent): void {
    const newSelectAns = [...selectedAns];
    newSelectAns.push(e.target.value);
    setSelectedAns(newSelectAns);
    setCurrQuizQuestion((prev) => prev + 1);
  }

  return (
    <div>
      {errMsg && <Alert message={errMsg} type="error" />}
      <div id="quiz-outer-container">
        {currQuizQuestion <= 2 && (
          <>
            <div id="quiz-inner-container">
              <div id="question">{quiz && quiz[currQuizQuestion].question}</div>
              <div>
                <Radio.Group
                  onChange={ansOnchange}
                  //value={value}
                >
                  <Space direction="vertical">
                    {quiz &&
                      quiz[currQuizQuestion].all_ans.map((ans, index) => (
                        <Radio value={ans} key={"ans" + index}>
                          {ans}
                        </Radio>
                      ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </>
        )}
        {currQuizQuestion === 3 && (
          <div id="quiz-inner-container">
            <Space direction="vertical">
              <div
                id="quiz-pass-fail-container"
                style={{ color: score && score >= 50 ? "green" : "red" }}
              >
                {score && score >= 50 ? "Pass" : "Fail"}
              </div>
              <div>Your Score: {score}</div>

              <div>
                Time used: {(endTime.getTime() - startTime.getTime()) / 1000} s
              </div>

              <Link to="/">Back to Home</Link>
            </Space>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
