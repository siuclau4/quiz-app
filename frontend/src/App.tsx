import React, {
  createContext,
  Dispatch,
  useEffect,
  useReducer,
  useState,
} from "react";
import "./App.css";
import Router from "./pages/router/Router";
import "antd/dist/antd.css";
import { IActions, IState } from "./pages/store/interface";
import { appReducer } from "./pages/store/reducer";

const initialState: IState = {
  isAuthenticated: false,
  token: null,
  userId: null,
  username: null,
};

export const AppContext = createContext<{
  state: IState;
  dispatch: Dispatch<IActions>;
}>({
  state: initialState,
  dispatch: (action) =>
    console.error(
      "Dispatched action outside of an AppContext provider",
      action
    ),
});

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState as any);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("token")) {
        setIsReady(true);
        return;
      }

      const token: string = localStorage.getItem("token") || "";

      const fetchRes = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (fetchRes.status !== 200) {
        dispatch({ type: "@@AUTH/LOGOUT" });
        setIsReady(true);
        return;
      }

      const res = await fetchRes.json();

      dispatch({
        type: "@@AUTH/LOGIN",
        token: token,
        username: res.username,
        userId: res.user_id,
      });

      setIsReady(true);
    })();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {isReady && <Router />}
    </AppContext.Provider>
  );
}

export default App;
