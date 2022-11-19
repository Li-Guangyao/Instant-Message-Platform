import { Router, Response, Request } from "express";
import { verifyToken } from "../manager/jwt";
const router: Router = Router();

router.post("/upload_image", async (req: Request, res: Response) => {
  let data = req.body;
  let { username, password } = data;
  res.send(username + password);
});

router.post("/change_name", async (req: Request, res: Response) => {
  res.send("verify_email");
});

router.post("/change_password", async (req: Request, res: Response) => {
  res.send("changename")
});

router.post("/verify_token", async (req: Request, res: Response) => {
  console.log("verify_token")
  res.json(verifyToken(req, res)) 
});

function uploadImage() {}

export default router;
