import express from "express";
import jwtSimple from "jwt-simple";
import jwt from "./jwt";
import { Bearer } from "permit";
import { UserModel } from "./mongoose";

// interface IGetUserAuthInfoRequest extends express.Request {
//   user: string; // or any other type
// }

const permit = new Bearer({
  query: "access_token",
});

export async function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    //no token, return
    const token = permit.check(req);

    if (!token) {
      return res.status(401).json({ message: "Permission Denied - No token" });
    }

    //has token
    const payload: { id: number } = jwtSimple.decode(token, jwt.jwtSecret);
    const user: any = await UserModel.findById(payload.id);

    if (!user) {
      return res.status(401).json({ message: "Permission Denied - No user" });
    }
    // just want info other than password
    const { password, ...others } = user._doc;

    req.user = { ...others };

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Permission Denied - something's wrong" });
  }
}

export async function getUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    //no token, return
    const token = permit.check(req);

    if (!token) {
      return next();
    }

    //has token
    const payload: { id: number } = jwtSimple.decode(token, jwt.jwtSecret);

    const user: any = await UserModel.findById(payload.id);

    if (!user) {
      return next();
    }
    // just want info other than password
    const { password, ...others } = user._doc;

    req.user = { ...others };

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Permission Denied - something's wrong" });
  }
}
