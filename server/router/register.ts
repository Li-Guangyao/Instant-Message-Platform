import { Router, Response, Request } from "express";
const model = require("../models/model.js");
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  let data = req.body;
  let {username, password} = data;
  res.send(username+password);
});

router.post("/verifyEmail", async (req: Request, res: Response) => {
  res.send("verifyEmail");
});

router.post("/sendCode", async (req: Request, res: Response) => {});

router.post("/verifyCode", async (req: Request, res: Response) => {});

export default router;
