import { Router, Response, Request } from "express";
const model = require("../models/model");
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  let data = req.body.data;
  let {usename, password} = data;
  res.send("login");
});

export default router;
