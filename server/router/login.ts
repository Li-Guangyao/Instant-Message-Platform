import { Router, Response, Request } from "express";
import { generateToken } from "../manager/jwt";
import { User } from "../models/User";
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  let data = req.body.data;
  const { username, email, password } = data;

  const { count, rows } = await User.findAndCountAll({
    where: {
      username: username,
      email: email,
      password: password,
    },
  });

  if (count == 0) {
    res.json({
      code: 404,
      msg: "There is no user, or you input the wrong password."
    });
    res.send("wrong number")
  } else if (rows.length == 1) {
    const token = generateToken({
      username: username,
      email: email,
    });

    res.json({
      code: 200,
      msg: "Log in successfully.",
      data: { token },
    });
  }
});

export default router;
