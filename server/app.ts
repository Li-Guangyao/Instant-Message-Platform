import registerRouter from "./router/register";
import loginRouter from "./router/login";
import systemRouter from "./router/system";
import { verifyToken } from "./manager/jwt";
import express from "express";
import WSS from "./manager/websocket";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(verifyToken)

app.get("/", function (req: any, res: any) {
  res.send("后端成功启动!!!");
});
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/system", systemRouter);

const server = app.listen(process.env.SERVER_PORT, () => {
  const host: any = server.address();
  console.log("The server has started, on the port %s", host.port);
});

WSS(server);
