// login.js
import express from "express"
const router = express.Router();
import { generateToken } from "../manager/jwt"

// 路由
// router.post("/", (req, res) => {
// //   const token = req.body.token;
// //   const password = req.body.password;
//   const token = generateToken({ username: username });

//   res.json({
//     code: 200,
//     msg: "登录成功",
//     data: { token },
//   });
// });

module.exports = router;
