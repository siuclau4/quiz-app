export interface IState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  username: string | null;
}

interface ILogin {
  type: "@@AUTH/LOGIN";
  token: string;
  username: string;
  userId: string;
}

interface ILogout {
  type: "@@AUTH/LOGOUT";
}

export type IActions = ILogin | ILogout;
