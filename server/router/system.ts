import { Router, Response, Request } from "express";
const model = require("../models/model.js");
const router: Router = Router();

router.post("/upload_image", async (req: Request, res: Response) => {
  let data = req.body;
  let {username, password} = data;
  res.send(username+password);
});

router.post("/change_name", async (req: Request, res: Response) => {
  res.send("verify_email");
});

router.post("/change_password", async (req: Request, res: Response) => {});


function uploadImage(){
    
}


export default router;