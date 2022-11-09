import { doesNotThrow } from "assert";
import React, { useEffect, useState } from "react";
import { Input, Popover } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./chatPage.module.css";
import "antd/lib/popover/style/index.css";

const { TextArea } = Input;

// let socket = new WebSocket("ws://39.99.133.150:8082/ws");
let socket: any = new WebSocket(
  "ws://127.0.0.1:8081/" + localStorage.getItem("email")
);

interface messageObj {
  time?: Date;
  isMine?: boolean;
  content?: String;
  sender: String;
  receiver: String;
}

interface chatListObj {
  username: String;
  email: String;
  messageList: Array<messageObj>;
  lastMessageTime: Date;
}

function ChatPage() {
  const location = useLocation();
  const { email } = location.state;
  const [receiverIdx, setReceiverIdx] = useState(0);
  const [message, setMessage] = useState<messageObj>({
    sender: email,
    receiver: "1720344233@qq.com",
  });
  const [messageList, setMessageList] = useState<Array<messageObj>>([]);
  // const [chatList, setChatList] = useState(new Map());
  const [chatList, setChatList] = useState<Array<chatListObj>>([
    {
      username: "Li Guangyao",
      email: "1169969860@qq.com",
      messageList: [],
      lastMessageTime: new Date(),
    },
    {
      username: "Li Goudan",
      email: "1169969860@qq.com",
      messageList: [],
      lastMessageTime: new Date(),
    },
  ]);

  // Will be triggered when receiveing a message;
  socket.onmessage = function (e: any) {
    const newMessage: messageObj = JSON.parse(e.data);
    console.log(newMessage);
    setMessageList([...messageList, newMessage]);
  };

  socket.onopen = function (event: any) {
    console.log("Websocket established.");
  };

  // socket.onclose = function (event:any) {
  //   let ta = document.getElementById("responseText") as HTMLTextAreaElement;
  //   ta.value = ta.value + "连接被关闭";
  // };

  function sendMessage() {
    if (message.content == "") return;
    if (!window.WebSocket) return;
    if (socket.readyState != WebSocket.OPEN) {
      // socket = new WebSocket("ws://39.99.133.150:8081/ws");
      socket = new WebSocket("ws://127.0.0.1:8081/" + email);
    }

    let chatInputBox = document.getElementById(
      "input-content"
    ) as HTMLTextAreaElement;
    setTimeout(() => {
      chatInputBox.value = "";
    }, 150);

    setMessageList([...messageList, JSON.parse(JSON.stringify(message))]);
    socket.send(JSON.stringify(message));
    message.content = "";
    setMessage(message);
  }

  const settingPanel = (
    <div className={style["setting-panel"]}>
      <div>Log Out</div>
    </div>
  );

  return (
    <div className={style["container"]}>
      <div className={style["side-bar"]}>
        {/* <img className={style['avatar']} ></img> */}
        <img
          className={style["avatar"]}
          src={require("./images/avatar.jpg")}
        ></img>
        <Popover content={settingPanel} placement="right" trigger={"click"}>
          <img
            className={style["setting"]}
            src={require("./images/setting.png")}
          ></img>
        </Popover>
      </div>

      <div className={style["info-bar"]}>
        <div className={style["search-box"]}>
          <input
            className={style["search-input"]}
            placeholder="Type to Search"
          ></input>
        </div>
        <div className={style["chat-list"]}>
          {chatList.map((item, index) => {
            return (
              <div
                className={style["chat-list-item"]}
                id={"chat-list-item" + index}
                key={index}
                onClick={() => {
                  let temp = document.getElementById(
                    "chat-list-item" + receiverIdx
                  ) as HTMLElement;
                  temp.className = temp.className.split(" ")[0];
                  setReceiverIdx(index);
                  temp = document.getElementById(
                    "chat-list-item" + index
                  ) as HTMLElement;
                  temp.className += " " + style["chosen"];
                }}
              >
                <div className={style["chat-list-item-avatar-container"]}>
                  <img
                    className={style["chat-list-item-avatar"]}
                    src={require("./images/avatar.jpg")}
                  ></img>
                </div>
                <div className={style["chat-list-item-info"]}>
                  <div className={style["chat-list-item-username"]}>
                    {item.username}
                  </div>
                  <div className={style["chat-list-item-lastmessage"]}>
                    Hello, nice to meet you!{" "}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={style["dialogue-panel"]}>
        <div className={style["dialogue-header"]}>
          <div className={style["contact-name"]}>
            {chatList[receiverIdx].username}
          </div>
        </div>

        <div className={style["dialogue-content"]} id="dialogue-content">
          {messageList.map((item: messageObj, index: number) => {
            return (
              <>
                {item.sender == email ? (
                  <div className={style["message-self"]}>
                    <img
                      className={style["message-avatar-self"]}
                      src={require("./images/avatar.jpg")}
                    ></img>
                    <div className={style["arrow-self"]}></div>
                    <div className={style["message-content-self"]}>
                      {item?.content}
                    </div>
                  </div>
                ) : (
                  <div className={style["message"]}>
                    <img
                      className={style["message-avatar"]}
                      src={require("./images/avatar.jpg")}
                    ></img>
                    <div className={style["arrow"]}></div>
                    <div className={style["message-content"]}>
                      {item?.content}
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>

        <div className={style["input-box"]}>
          {/* <div className={style['input-function']}>123</div> */}
          <TextArea
            className={style["input-content"]}
            id="input-content"
            onChange={(e: any) => {
              let tempMessage = JSON.parse(JSON.stringify(message));
              tempMessage.time = new Date();
              tempMessage.sender = email;
              tempMessage.content = e.target.value;
              setMessage(tempMessage);
            }}
            onPressEnter={(e: React.KeyboardEvent) => {
              e.preventDefault();
              sendMessage();
            }}
            bordered={false}
          ></TextArea>
          <div
            className={style["input-send-btn"]}
            onClick={() => {
              console.log(message);
              sendMessage();
            }}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
