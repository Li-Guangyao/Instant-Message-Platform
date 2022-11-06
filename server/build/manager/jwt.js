import jwt from "jsonwebtoken";
var secretKey = "secretKey";
export function generateToken(payload) {
    var token = "Bearer " +
        jwt.sign(payload, secretKey, {
            expiresIn: "24h"
        });
    return token;
}
export function verifyToken(req, res, next) {
    var token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            console.log("verify error", err);
            return res.json({ code: "404", msg: "token无效" });
        }
        console.log("verify decoded", decoded);
        next();
    });
}
//# sourceMappingURL=jwt.js.map