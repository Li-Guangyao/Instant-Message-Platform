import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = "secretKey";

export function generateToken(payload) {
  const token: any =
    "Bearer " +
    jwt.sign(payload, secretKey, {
      expiresIn: "1h",
    });
  return token;
}

export function verifyToken(req: Request, res?: Response, next?) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secretKey, function (err: any, decoded) {
    if (err) {
      console.log("verify error", err);
      return res.json({ code: 404, msg: "token无效" });
    } else {
      console.log("verify decoded", decoded);
      return res.json({ code: 200, msg: "token有效" });
    }
    next();
  });
}
