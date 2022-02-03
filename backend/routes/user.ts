import express from "express";
import { checkPassword, hashPassword } from "../hash";
import { UserModel } from "../mongoose";
import jwtSimple from "jwt-simple";
import jwt from "../jwt";
import { authenticate } from "../guards";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const userInfo = req.body;

    if (!userInfo.username || !userInfo.password) {
      res.status(400).json({ message: "Please input all required data" });
    }

    userInfo.password = await hashPassword(userInfo.password);

    let userId: number;

    const matchedUsernameUsers: any = await UserModel.find({
      name: userInfo.username,
    });

    if (matchedUsernameUsers.length) {
      res.status(400).json({ message: "username already used" });
      return;
    }

    const user = new UserModel({
      name: userInfo.username,
      password: userInfo.password,
    });

    await user.save(function (err, user) {
      res.status(200).json({ user_id: user._id });
    });
  } catch (e) {
    res.status(500).json({ message: 500 });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(401).json({ message: "missing username/password" });
      return;
    }
    const { username, password } = req.body;

    const user = await UserModel.findOne({ name: username });

    if (!user || !(await checkPassword(password, user.password))) {
      res.status(401).json({ message: "wrong email/password" });
      return;
    }

    const payload = {
      id: user.id,
    };
    const token = jwtSimple.encode(payload, jwt.jwtSecret);

    res.json({
      user_id: user.id,
      username: user.name,
      token: token,
    });
    return;
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/info", authenticate, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      user: {
        username: user?.name,
        id: user?._id,
      },
    });
  } catch (e) {
    res.status(401).json({ message: "unauthorized" });
  }
});

export default router;
