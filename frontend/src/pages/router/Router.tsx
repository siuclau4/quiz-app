import React, { Component, ReactNode, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppContext } from "../../App";
import Dashboard from "../Dashboard";
import Landing from "../Landing";
import Quiz from "../Quiz";

const PrivateRoute: React.FC = (props: any) => {
  const { state, dispatch } = useContext(AppContext);

  console.log(state);

  return state.isAuthenticated && props.children ? (
    props.children
  ) : (
    <Navigate to="/" />
  );
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
