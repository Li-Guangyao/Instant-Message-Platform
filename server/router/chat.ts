// login.js
import express from "express";
import { generateToken } from "../manager/jwt";
import User from "../models/User";
const router = express.Router();

router.post("/search_user", async (req, res) => {
  const email = req.body.email;

  let targetUser = await User.findOne({
    attributes: ["username", "email"],
    where: { email },
  });
  targetUser
    ? res.json({
        code: 200,
        msg: "User exist.",
        data: { user: JSON.stringify(targetUser) },
      })
    : res.json({
        code: 404,
        msg: "User doesn't exist.",
      });
});

export default router;
