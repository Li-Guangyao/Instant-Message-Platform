import WebSocket from "ws";

let wsClients = new Map<String, WebSocket>();

export default function WSS(server: any) {
  const wss = new WebSocket.Server({ server });

  wss.on("open", (e) => {
    console.log("connected", e);
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
    // ws.send("Welcome :" + "加入聊天室");
    // ws.send(JSON.stringify(client));

    const clientEmail: string = req.url.slice(1);
    wsClients.set(clientEmail, ws);

    ws.on("message", (message) => {
      // console.log("-----------------------------");
      // console.log("ws", typeof ws);
      // console.log("-----------------------------");
      // console.log("req", req.url);
      // console.log("-----------------------------");
      // console.log("client", client);
      // console.log("-----------------------------");

      const messageObj = JSON.parse(message);
      // console.log("messgeObj", messageObj);
      const senderStr = messageObj.sender;
      const receiverStr = messageObj.receiver;
      // console.log("receiverStr", messageObj.receiver);
      const senderObj = wsClients.get(senderStr);
      const receiverObj = wsClients.get(receiverStr);
      // console.log("receiverObj", receiverObj);
      // console.log(wsClients);

      if (receiverObj instanceof WebSocket) {
        if (receiverObj.readyState == WebSocket.OPEN) {
          receiverObj.send("" + message);
        } else if (senderObj.readyState == WebSocket.OPEN) {
          let systemMessge = {
            sender: "system",
            receiver: senderStr,
            content: "Receiver unreachable.",
          };
          senderObj.send("" + systemMessge);
        }
      }

      // wss.clients.forEach((client) => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send("" + message);
      //   }
      // });
    });
  });
}
