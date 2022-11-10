import React, { useEffect, useState } from "react";
import { message as antdmessage, Popover } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import style from "./chatPage.module.css";
import "antd/lib/popover/style/index.css";
import "antd/lib/message/style/index.css";
import "antd/lib/popconfirm/style/index.css";

// let socket = new WebSocket("ws://39.99.133.150:8082/ws");
let email = localStorage.getItem("email") as string;
let socket: WebSocket = new WebSocket("ws://127.0.0.1:8081/" + email);

interface messageObj {
  time?: Date;
  isMine?: boolean;
  content: string;
  sender: string;
  receiver: string;
}

interface chatListObj {
  username: string;
  email: string;
  messageList: Array<messageObj>;
  lastMessageTime: Date;
  unsentMessage: string;
}

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      email = location.state.email;
    } else {
      navigate("../login");
    }
  }, []);

  console.log("email", email);

  const [searchStr, setSearchStr] = useState("");

  const [receiverIdx, setReceiverIdx] = useState(0);
  const [message, setMessage] = useState<messageObj>({
    sender: email,
    receiver: "",
    content: "",
  });

  const [messageList, setMessageList] = useState<Array<messageObj>>([]);
  const [chatList, setChatList] = useState<Array<chatListObj>>([
    {
      username: "AI Robot",
      email: "22042527g@connect.polyu.hk",
      messageList: [],
      lastMessageTime: new Date(),
      unsentMessage: "",
    },
  ]);

  // Will be triggered when receiveing a message;
  socket.onmessage = function (e: any) {
    const newMessage: messageObj = JSON.parse(e.data);
    console.log(newMessage);
    setMessageList([...messageList, newMessage]);
  };

  socket.onopen = function (event: any) {
    console.log("Websocket connected.");
  };

  socket.onclose = function (event: any) {
    console.log("Websocket disconnected.");
  };

  useEffect(() => {
    changeChat(0);
  }, []);

  function sendMessage() {
    if (message.content.length == 0 || !window.WebSocket) {
      return;
    }

    message.sender = email;
    message.receiver = chatList[receiverIdx].email;
    message.time = new Date();
    setMessage(message);
    console.log(message);

    if (socket.readyState !== WebSocket.OPEN) {
      // socket = new WebSocket("ws://39.99.133.150:8081/ws");
      socket = new WebSocket("ws://127.0.0.1:8081/" + email);
    }

    (document.getElementById("input-content") as HTMLTextAreaElement).value =
      "";

    setMessageList([...messageList, JSON.parse(JSON.stringify(message))]);
    socket.send(JSON.stringify(message));

    // 重设，等待下一个消息输入
    message.content = "";
    setMessage(message);
  }

  function searchUser() {
    axios
      .post("http://127.0.0.1:8081/chat/search_user", {
        email: searchStr,
      })
      .then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          let user = JSON.parse(res.data.data.user);
          let newChat: chatListObj = {
            username: user.username,
            email: user.email,
            messageList: [],
            lastMessageTime: new Date(),
            unsentMessage: "",
          };
          changeChat(0, newChat);
          (document.getElementById("search-input") as HTMLInputElement).value =
            "";
        } else if (res.data.code == 404) {
          antdmessage.warn(res.data.msg);
        }
      });
  }

  function changeChat(index: number, newChat?: chatListObj) {
    let textarea = document.getElementById(
      "input-content"
    ) as HTMLTextAreaElement;
    // 保存聊天数据
    chatList[receiverIdx].messageList = JSON.parse(JSON.stringify(messageList));
    chatList[receiverIdx].unsentMessage = textarea.value;
    setChatList(chatList);

    if (newChat) {
      // 设置新的聊天数据
      setMessageList([]);
      setChatList([newChat, ...chatList]);
    } else {
      // 改变接收者的值
      setReceiverIdx(index);
      // 设置新的聊天数据
      setMessageList(JSON.parse(JSON.stringify(chatList[index].messageList)));
    }

    let temp = document.getElementById(
      "chat-list-item" + receiverIdx
    ) as HTMLElement;
    temp.className = temp.className.split(" ")[0];
    (
      document.getElementById("chat-list-item" + index) as HTMLElement
    ).className += " " + style["chosen"];
    textarea.focus();
    textarea.value = chatList[index].unsentMessage;
  }

  function logout() {
    navigate("../login");
  }

  const settingPanel = (
    <div className={style["setting-panel"]}>
      <div onClick={logout}>Log out</div>
      {/* <img className={style["setting-panel-logout"]} src={require("./images/logout.png")}></img> */}
    </div>
  );

  return (
    <div className={style["container"]}>
      <div className={style["side-bar"]}>
        {/* <img className={style['avatar']} ></img> */}
        <img
          className={style["avatar"]}
          src={require("./images/avatar.jpg")}
          alt=""
        ></img>
        <Popover content={settingPanel} placement="right" trigger={"click"}>
          <img
            className={style["setting"]}
            src={require("./images/setting.png")}
            alt=""
          ></img>
        </Popover>
      </div>

      <div className={style["info-bar"]}>
        <div className={style["search-box"]}>
          <input
            className={style["search-input"]}
            id="search-input"
            placeholder="Type to Search Users"
            onInput={(e: any) => {
              setSearchStr(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.code === "Enter" || e.code == "NumpadEnter") {
                searchUser();
              }
            }}
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
                  changeChat(index);
                }}
              >
                <div className={style["chat-list-item-avatar-container"]}>
                  <img
                    className={style["chat-list-item-avatar"]}
                    src={require("./images/avatar.jpg")}
                    alt=""
                  ></img>
                </div>
                <div className={style["chat-list-item-info"]}>
                  <div className={style["chat-list-item-username"]}>
                    {item.username}
                  </div>
                  <div className={style["chat-list-item-lastmessage"]}>
                    {chatList[index].messageList.length > 0
                      ? chatList[index].messageList.slice(-1)[0].content
                      : ""}
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
                      alt=""
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
                      alt=""
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
          <textarea
            className={style["input-content"]}
            id="input-content"
            disabled={chatList.length == 0}
            onInput={(e: any) => {
              message.content = e.target.value;
              setMessage(message);
            }}
            onKeyUp={(e: React.KeyboardEvent) => {
              e.preventDefault();
              if (e.code == "Enter" || e.code == "NumpadEnter") {
                sendMessage();
              }
            }}
          ></textarea>
          <div
            className={style["input-send-btn"]}
            onClick={() => {
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
