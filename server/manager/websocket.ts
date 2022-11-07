import WebSocket from "ws";

export default function WSS(server: any) {
  const wss = new WebSocket.Server({ server });

  wss.on("open", () => {
    console.log("connected");
  });

  wss.on("close", () => {
    console.log("Disconnected");
  });

  wss.on("connection", (ws, req, client) => {
    // const port = req.connection.remotePort;
    // const clientName = port;
    // console.log(`${clientName} is connected`);
    // console.log(req.connection);
    // 发送欢迎信息给客户端
    // ws.send("Welcome :" + clientName + "加入聊天室");

    ws.on("message", (message) => {
      // 广播消息给所有客户端
      console.log(wss.clients)

      wss.clients.forEach((client) => {
        if (client != ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
}
