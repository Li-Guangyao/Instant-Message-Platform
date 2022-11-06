// login.js
import express from "express"
const router = express.Router();
import { generateToken } from "../manager/jwt"

// 路由
router.post("/", (req, res) => {
  const token = req.body.token;
  res.json({
    code: 200,
    msg: "登录成功",
    data: { token },
  });
});

module.exports = router;
