import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "../Landing";
import Quiz from "../Quiz";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
