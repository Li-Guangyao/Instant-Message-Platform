import React, { useEffect, useState } from "react";
import { message as antdmessage, Popover } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import style from "./chatPage.module.css";
import "antd/lib/popover/style/index.css";
import "antd/lib/message/style/index.css";
import "antd/lib/popconfirm/style/index.css";

// let socket = new WebSocket("ws://http://127.0.0.1:8082/ws");
let email = localStorage.getItem("email") as string;
let username = localStorage.getItem("username") as string;
let socket: WebSocket = new WebSocket("ws://127.0.0.1:8081/" + email);

interface messageObj {
  sender: string;
  senderName: string;
  receiver: string;
  receiverName: string;
  content: string;
  time?: Date;
}

interface chatListObj {
  username: string;
  email: string;
  messageList: Array<messageObj>;
  lastMessageContent: string;
  unsentMessage: string;
}

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    changeChat(0);
  }, []);

  useEffect(() => {
    if (location.state) {
      email = location.state.email;
    } else {
      navigate("../login");
    }
  }, []);

  const [searchStr, setSearchStr] = useState("");
  const [message, setMessage] = useState<messageObj>({
    sender: email,
    senderName: username,
    receiver: "",
    receiverName: "",
    content: "",
  });

  const [receiverIdx, setReceiverIdx] = useState(0);
  const [messageList, setMessageList] = useState<Array<messageObj>>([]);
  const [chatList, setChatList] = useState<Array<chatListObj>>([
    {
      username: "AI Robot",
      email: "robot",
      messageList: [],
      lastMessageContent: "hello",
      unsentMessage: "",
    },
  ]);

  useEffect(() => {
    // console.log("receiveIdx改变", receiverIdx);
    (
      document.getElementById("chat-list-item" + receiverIdx) as HTMLElement
    ).className += " " + style["chosen"];
  }, [receiverIdx]);

  // Will be triggered when receiveing a message;
  socket.onmessage = function (e: any) {
    const newMessage: messageObj = JSON.parse(e.data);
    console.log(newMessage);

    // if (newMessage.sender == "system") {
    //   antdmessage.warn("system"+ message.content);
    // } else {
    // 三种情况
    // 1. 用户就是当前聊天对象
    // 2. 用户在当前列表中，但不是当前聊天
    // 3. 用户不在当前列表中

    // 情况1
    if (chatList[receiverIdx].email == newMessage.sender) {
      setMessageList([...messageList, newMessage]);
      chatList[receiverIdx].lastMessageContent = newMessage.content;
      setChatList(JSON.parse(JSON.stringify(chatList)));
      autoScroll();
      return;
    }

    // 情况2
    for (let i = 0; i < chatList.length; i++) {
      if (chatList[i].email == newMessage.sender) {
        chatList[i].messageList.push(newMessage);
        chatList[i].lastMessageContent = newMessage.content;
        setChatList(JSON.parse(JSON.stringify(chatList)));
        return;
      }
    }

    // 情况3
    let newChat: chatListObj = {
      username: newMessage.senderName,
      email: newMessage.sender,
      messageList: [newMessage],
      lastMessageContent: newMessage.content,
      unsentMessage: "",
    };
    setChatList([newChat, ...chatList]);
    setReceiverIdx((receiverIdx) => receiverIdx + 1);
    let temp = document.getElementById("chat-list-item0") as HTMLElement;
    temp.className = temp.className.split(" ")[0];
  };
  // };

  socket.onopen = function (event: any) {
    console.log("Websocket connected.");
  };

  socket.onclose = function (event: any) {
    console.log("Websocket disconnected.");
  };

  function sendMessage() {
    if (message.content.length == 0 || !window.WebSocket) return;

    message.sender = email;
    message.senderName = localStorage.getItem("username") as string;
    message.receiver = chatList[receiverIdx].email;
    message.time = new Date();
    setMessage(message);
    console.log("send", message);

    if (socket.readyState !== WebSocket.OPEN) {
      socket = new WebSocket("ws://127.0.0.1:8081/" + email);
    }

    (document.getElementById("input-content") as HTMLTextAreaElement).value =
      "";

    setMessageList([...messageList, JSON.parse(JSON.stringify(message))]);
    socket.send(JSON.stringify(message));
    chatList[receiverIdx].lastMessageContent = message.content;
    setChatList(JSON.parse(JSON.stringify(chatList)));

    // 重设，等待下一个消息输入
    message.content = "";
    setMessage(message);

    autoScroll();
  }

  function searchUser() {
    for (let i = 0; i < chatList.length; i++) {
      if (chatList[i].email == searchStr) {
        changeChat(i);
        return;
      }
    }

    axios
      .post("http://127.0.0.1:8081/chat/search_user", {
        email: searchStr,
      })
      .then((res) => {
        if (res.data.status == 200) {
          let user = JSON.parse(res.data.data.user);
          let newChat: chatListObj = {
            username: user.username,
            email: user.email,
            messageList: [],
            lastMessageContent: "",
            unsentMessage: "",
          };

          changeChat(0, newChat);
          (document.getElementById("search-input") as HTMLInputElement).value =
            "";
        } else if (res.data.status == 404) {
          antdmessage.warn(res.data.msg);
        }
      });
  }

  function saveChatMessage() {
    let textarea = document.getElementById(
      "input-content"
    ) as HTMLTextAreaElement;
    // 保存聊天数据
    chatList[receiverIdx].messageList = JSON.parse(JSON.stringify(messageList));
    chatList[receiverIdx].unsentMessage = textarea.value;
    setChatList(chatList);
  }

  function changeChat(index: number, newChat?: chatListObj) {
    saveChatMessage();
    if (newChat) {
      // 设置新的聊天数据
      // 触发情况：1. 用户搜索并新增了聊天对象
      setChatList([newChat, ...chatList]);
      setMessageList([]);
    } else if (index != receiverIdx) {
      // 触发情况：1.用户点击，切换聊天对象.
      // 2. 用户搜索聊天对象，但是现在已经有了对话窗口
      setReceiverIdx(index);
      setMessageList(JSON.parse(JSON.stringify(chatList[index].messageList)));
      flushChatlistStyle(index);
    }

    let textarea = document.getElementById(
      "input-content"
    ) as HTMLTextAreaElement;

    textarea.value = "";
    textarea.value = chatList[index].unsentMessage;
    textarea.focus();
    autoScroll();
  }

  function flushChatlistStyle(index: number) {
    let temp = document.getElementById(
      "chat-list-item" + receiverIdx
    ) as HTMLElement;
    temp.className = temp.className.split(" ")[0];
  }

  function logout() {
    navigate("../login");
  }

  function autoScroll() {
    setTimeout(() => {
      let temp = document.getElementById(
        "dialogue-content-scroll"
      ) as HTMLElement;
      if (temp.children.length > 2) {
        temp.children[temp.children.length - 1].scrollIntoView(true);
      }
    }, 100);
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
                    {item.username ? item.username : item.email}
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
          <div
            className={style["dialogue-content-scroll"]}
            id="dialogue-content-scroll"
          >
            {messageList.map((item: messageObj, index: number) => (
              <div id="message-item">
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
              </div>
            ))}
          </div>
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

// scrollHeight: 1172
// scrollTop: 684
// scrollTopMax: 812
// 684

// scrollHeight: 1300
// scrollTop: 812
// scrollTopMax: 940
// 812

// scrollHeight: 1428
// ​scrollTop: 588
// ​scrollTopMax: 1068
// 588
