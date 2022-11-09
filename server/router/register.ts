import { Router, Response, Request } from "express";
import redisManager from "../manager/redisManager";

const emailManager = require("../manager/emailManager.js");
const model = require("../models/model.js");
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const { username, password } = data;
  res.send(username + password);
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
  if (codeObj && Date.now() < codeObj.expireTime) {
    return codeObj.code == code;
  } else {
    return false;
  }
}

export default router;