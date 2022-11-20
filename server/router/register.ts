import { Router, Response, Request } from "express";
import redisManager from "../manager/redisManager";
import User from "../models/User";

const emailManager = require("../manager/emailManager.js");
const router: Router = Router();

function generateCode(): string {
  const res = "" + Math.round(Math.random() * 1000000);
  return res;
}

function sendCode(email: string): void {
  const code = generateCode();
  emailManager.sendMail(email, code);
  const codeObj = {
    code,
    expireTime: Date.now() + 1000 * 60 * 2,
  };
  redisManager.set(email, JSON.stringify(codeObj));
}

async function verifyCode(email: string, code: string) {
  const codeObj = JSON.parse(await redisManager.get(email));
  console.log("code", code);
  if (codeObj && Date.now() <= codeObj.expireTime) {
    return codeObj.code == code;
  } else {
    return false;
  }
}

// 执行注册功能
router.post("/", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  User.findOrCreate({
    where: { email },
    defaults: {
      username,
      email,
      password,
    },
  }).then((e) => {
    if (e[1]) {
      res.json({
        status: 200,
        msg: "Create user successfully.",
      });
    } else {
      res.json({
        status: 404,
        msg: "User already exists.",
      });
    }
  });
});

router.post("/send_code", async (req: Request, res: Response) => {
  const { email } = req.body;

  let targetUser = await User.findOne({
    attributes: ["username", "email"],
    where: { email },
  });
  if (targetUser) {
    res.json({
      status: 404,
      msg: "The email has been registered, please change one.",
    });
  } else {
    sendCode(email);
    res.json({
      status: 200,
      msg: "Send a authorization code.",
    });
  }
});

router.post("/verify_code", async (req: Request, res: Response) => {
  const { email, code } = req.body;
  res.json({
    status: await verifyCode(email, code),
  });
});

export default router;
