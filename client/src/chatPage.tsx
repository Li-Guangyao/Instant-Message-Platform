import { doesNotThrow } from "assert";
import React, { useEffect, useState } from "react";
import { Input, Popover } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./chatPage.module.css";
import "antd/lib/popover/style/index.css";

const { TextArea } = Input;

let socket = new WebSocket("ws://39.99.133.150:8081/ws");

interface messageObj {
  time?: Date;
  isMine?: boolean;
  content?: String;
  sender?: String;
  receiver?: String;
}

function ChatPage() {
  const [message, setMessage] = useState<messageObj>({});
  const [messageList, setMessageList] = useState<Array<messageObj>>([]);
  const location = useLocation();
  const { email } = location.state;

  console.log("socket", socket);

  // Will be triggered when receives a message;
  socket.onmessage = function (event: any) {
    const newMessage: messageObj = {
      isMine: false,
      content: event.data,
    };
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
    setMessage({});
    let chatInputBox = document.getElementById(
      "input-content"
    ) as HTMLTextAreaElement;
    setTimeout(() => {
      chatInputBox.value = "";
      chatInputBox.textContent = "";
    }, 150);

    if (!window.WebSocket) return;
    if (socket.readyState != WebSocket.OPEN) {
      socket = new WebSocket("ws://39.99.133.150:8081/ws");
    }

    socket.send(JSON.stringify(message));
  }

  const settingPanel = (
    <div className={style["setting-panel"]}>
      <p>content</p>
    </div>
  );

  return (
    <div className={style["container"]}>
      <div className={style["side-bar"]}>
        {/* <img className={style['avatar']} ></img> */}
        <div className={style["avatar"]}></div>
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
      </div>

      <div className={style["dialogue-panel"]}>
        <div className={style["dialogue-header"]}>
          <div className={style["contact-name"]}>James Lee</div>
        </div>

        <div className={style["dialogue-content"]} id="dialogue-content">
          {messageList.map((item: messageObj, key) => {
            return (
              <>
                {item.isMine ? (
                  <div className={style["message-self"]}>
                    <div className={style["message-avatar-self"]}></div>
                    <div className={style["arrow-self"]}></div>
                    <div className={style["message-content-self"]}>
                      {item?.content}
                    </div>
                  </div>
                ) : (
                  <div className={style["message"]}>
                    <div className={style["message-avatar"]}></div>
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
