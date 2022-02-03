import { IActions, IState } from "./interface";

export const appReducer = (state: IState, action: IActions) => {
  switch (action.type) {
    case "@@AUTH/LOGIN":
      localStorage.setItem("token", action.token);

      return {
        ...state,
        isAuthenticated: true,
        token: action.token,
        username: action.username,
        userId: action.userId,
      };

    case "@@AUTH/LOGOUT":
      localStorage.removeItem("token");

      return {
        ...state,
        isAuthenticated: false,
        token: "",
        userId: "",
        username: "",
      };
  }
};
