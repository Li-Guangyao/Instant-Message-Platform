import jwt from "jsonwebtoken";

const secretKey = "secretKey";

export function generateToken(payload) {
  const token:any =
    "Bearer " +
    jwt.sign(payload, secretKey, {
      expiresIn: "24h",
    });
  return token;
}

export function verifyToken(req, res?, next?) {
  // const token = req.headers.authorization.split(" ")[1];
  const token = req.split(" ")[1];
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log("verify error", err);
      // return res.json({ code: "404", msg: "token无效" });
    }
    console.log("verify decoded", decoded);
    // next();
  });
}
