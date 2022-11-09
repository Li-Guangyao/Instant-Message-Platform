import { Router, Response, Request } from "express";
import { register } from "ts-node";
import redisManager from "../manager/redisManager";
import User from "../models/User";

const emailManager = require("../manager/emailManager.js");
const router: Router = Router();

// 执行注册功能
router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const { username, email, password } = data;
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
        tip: "Create user successfully.",
      });
    } else {
      res.json({
        status: 404,
        tip: "User already exists.",
      });
    }
  });
});

router.post("/send_code", async (req: Request, res: Response) => {
  const data = req.body;
  const { email } = data;
  sendCode(email);
  res.json({
    tip: "Send a authorization code.",
    status: 200,
  });
});

router.post("/verify_code", async (req: Request, res: Response) => {
  const data = req.body;
  const { email, code } = data;
  res.json({
    status: await verifyCode(email, code),
  });
});

function sendCode(email: string): void {
  const code = generateCode();
  emailManager.sendMail(email, code);
  const codeObj = {
    code,
    expireTime: Date.now() + 1000 * 60 * 2,
  };
  redisManager.set(email, JSON.stringify(codeObj));
}

function generateCode(): string {
  const res = "" + Math.round(Math.random() * 1000000);
  return res;
}

async function verifyCode(email: string, code: string): Promise<any> {
  const codeObj = JSON.parse(await redisManager.get(email));
  console.log("code", code);
  if (codeObj && Date.now() < codeObj.expireTime) {
    return codeObj.code == code;
  } else {
    return false;
  }
}

export default router;
