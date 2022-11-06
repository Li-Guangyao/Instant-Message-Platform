import { Router, Response, Request } from "express";
import redisManager from '../manager/redisManager'

const emailManager = require("../manager/emailManager.js");
const model = require("../models/model.js");
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  let data = req.body;
  let { username, password } = data;
  res.send(username + password);
});

router.post("/send_code", async (req: Request, res: Response) => {
  let data = req.body;
  let { email } = data;
  sendCode(email);
});

router.post("/verify_code", async (req: Request, res: Response) => {
  let data = req.body;
  let { code } = data;
  res.send(await verifyCode(code))
});

function sendCode(email: string): void {
  let code = generateCode();
  emailManager.sendMail(email, code);
  redisManager.set("username", code);
}

function generateCode(): string {
  let res = "" + Math.round(Math.random() * 1000000);
  return res;
}

async function verifyCode(usercode:string) :Promise<any>{
  console.log("Request verify Code")
  const code = await redisManager.get("username")
  return code==usercode
}

export default router;