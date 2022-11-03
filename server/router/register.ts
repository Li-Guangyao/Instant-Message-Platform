import { Router, Response, Request } from "express";

const emailManager = require('../manager/emailManager.js');
// const model = require("../models/model.js");
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  let data = req.body;
  let {username, password} = data;
  res.send(username+password);
});

router.post("/verify_email", async (req: Request, res: Response) => {
  let data = req.body;
  let {code} = data; 
  res.send("verify_email");
});

router.post("/send_code", async (req: Request, res: Response) => {
  let data = req.body;
  let {email} = data;
  emailManager.sendMail(email);
});

router.post("/verify_code", async (req: Request, res: Response) => {});

export default router;
