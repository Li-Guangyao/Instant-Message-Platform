import { doesNotThrow } from 'assert';
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import style from './mainPage.module.css';
const { TextArea } = Input;

let socket = new WebSocket("ws://39.99.133.150:8081/ws");

interface messageObj {
  time?: Date,
  isMine?: boolean,
  content?: String,
  // status: boolean,
}

function MainPage() {

  const [message, setMessage] = useState<messageObj>({isMine: true});
  const [messageList, setMessageList] = useState<Array<messageObj>>([]);

  console.log('socket', socket);

  socket.onmessage = function (event: any) {
    // let ta = document.getElementById("responseText") as HTMLTextAreaElement;
    // ta.value = ta.value + "\n" + event.data;

    console.log(event)

    // const newMessage: messageObj = JSON.parse(event.data);
    // newMessage.isMine = false;
      // const newMessage: messageObj = {
    //   time: new Date(),
    //   isMine: true,
    //   content: event.data,
    // }
    // setMessageList([...messageList, newMessage])
  };

  // socket.onopen = function (event:any) {
  //   let ta = document.getElementById("responseText") as HTMLTextAreaElement;
  //   ta.value = "连接开启!";
  // };

  // socket.onclose = function (event:any) {
  //   let ta = document.getElementById("responseText") as HTMLTextAreaElement;
  //   ta.value = ta.value + "连接被关闭";
  // };

  // function isPressEnter(e: any) {
  //   if (e.key == 'Enter') sendMessage();
  // }

  function sendMessage() {
    message.time = new Date();
    setMessage(message);

    if (!window.WebSocket) {
      return;
    }
    if (socket.readyState == WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      alert("连接没有开启.");
    }
  }

  return (
    <div className={style['container']}>
      <div className={style["side-bar"]}>
        {/* <img className={style['avatar']} ></img> */}
        <div className={style['avatar']}></div>
        <img className={style['setting']} src={require('./images/setting.png')}></img>
      </div>

      <div className={style["info-bar"]}>
        <div className={style['search-box']}>
          <input className={style['search-input']} placeholder="Type to Search" ></input>
        </div>
      </div>

      <div className={style['dialogue-panel']}>
        <div className={style['dialogue-header']}>
          <div className={style['contact-name']}>James Lee</div>
        </div>

        <div className={style['dialogue-content']} id='dialogue-content'>
          {/* <textarea className={style['response-text']} id="responseText" ></textarea> */}
          {
            messageList.map((item: messageObj) => {
              return <>
                {
                  item.isMine ?
                    <div className={style['single-message-self']}>
                      <div className={style['single-message-avatar-self']}></div>
                      <div className={style['arrow-self']}></div>
                      <div className={style['single-message-content-self']}>
                        {item?.content}
                      </div>
                    </div> :
                    <div className={style['single-message']}>
                      <div className={style['single-message-avatar']}></div>
                      <div className={style['arrow']}></div>
                      <div className={style['single-message-content']}>
                        {item?.content}
                      </div>
                    </div>
                }
              </>
            })
          }
        </div>

        <div className={style['input-box']}>
          {/* <div className={style['input-function']}>123</div> */}
          <TextArea className={style['input-content']} id="input-content" 
            onChange={(e: any) => { setMessage({content:e.target.value}) }}
            onPressEnter={sendMessage} bordered={false}></TextArea>
          <div className={style['input-send-btn']} onClick={() => { console.log(message) }}>Send</div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
