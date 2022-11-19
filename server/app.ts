import registerRouter from "./router/register";
import loginRouter from "./router/login";
import systemRouter from "./router/system";
import chatRouter from "./router/chat";

import { verifyToken } from "./manager/jwt";
import express, { Request, Response } from "express";
import WSS from "./manager/websocket";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const serverPort = parseInt(process.env.SERVER_PORT);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(verifyToken)

app.get("/", function (req: Request, res: Response) {
  res.send("后端成功启动!!!");
});
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/system", systemRouter);
app.use("/chat", chatRouter);

const server = app.listen(8081, () => {
  const host: any = server.address();
  console.log("The server has started, on the port %s", host.port);
  console.log(serverPort);
});

WSS(server);
