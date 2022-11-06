const app = require("express")()
const server = require("http").Server(app)

import WebSocket from "ws";
const MyWs = new WebSocket.Server({ port: 8081 })

MyWs.on("open", () => {
  console.log("connected")
})

MyWs.on("close", () => {
  console.log("disconnected")
})

MyWs.on("connection", (ws, req) => {
  const port = req.connection.remotePort
  const clientName = port
  console.log(`${clientName} is connected`)
  // 发送欢迎信息给客户端
  ws.send("Welcome :" + clientName + "加入聊天室")

  ws.on("message", (message) => {
    // 广播消息给所有客户端
    MyWs.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(clientName + " -> " + message)
      }
    })
  })
})
app.get("/", (req, res) => {
  res.sendfile(__dirname + "/index.html")
})

app.listen(3000)