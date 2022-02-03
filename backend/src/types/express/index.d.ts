import * as express from "express";
import { IUser } from "../../../mongoose";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
