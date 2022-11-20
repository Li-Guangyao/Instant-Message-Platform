import { Router, Response, Request } from "express";
import { generateToken } from "../manager/jwt";
import User from "../models/User";
const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  let data = req.body;
  const { email, password } = data;

  const { count, rows } = await User.findAndCountAll({
    where: {
      email: email,
      password: password,
    },
  });

  if (count == 0) {
    res.json({
      status: 404,
      msg: "There is no user, or you input the wrong password.",
    });
  } else if (rows.length == 1) {
    const token = generateToken({
      email: email,
    });

    res.json({
      status: 200,
      msg: "Log in successfully.",
      data: {
        username: rows[0].username,
        token,
      },
    });
  }
});

export default router;
