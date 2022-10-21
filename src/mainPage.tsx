import { doesNotThrow } from 'assert';
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import style from './mainPage.module.css';
const { TextArea } = Input;

let socket = new WebSocket("ws://39.99.133.150:8081/ws");

interface messageObj {
  time: Date,
  sender: String,
  content: String,
  // status: boolean,
}

function MainPage() {

  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<Array<Object>>([]);

  console.log('socket', socket);

  socket.onmessage = function (event: any) {
    // let ta = document.getElementById("responseText") as HTMLTextAreaElement;
    // ta.value = ta.value + "\n" + event.data;

    const newMessage: messageObj = {
      time: new Date(),
      sender: '',
      content: event.data,
    }
    setMessageList([...messageList, newMessage])
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
    if (!window.WebSocket) {
      return;
    }
    if (socket.readyState == WebSocket.OPEN) {
      socket.send(message);
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
        <image></image>
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
            messageList.map((item: any) => {
              return <div className={style['single-message']}>
                <div className={style['single-message-avatar']}></div>
                <div className={style['arrow']}></div>
                <div className={style['single-message-content']}>
                  {item?.content}
                </div>
              </div>
            })
          }
        </div>
        <div className={style['input-box']}>
          {/* <div className={style['input-function']}>123</div> */}
          <TextArea className={style['input-content']} id="input-content" onChange={(e:any) => { setMessage(e.target.value) }}
            onPressEnter={sendMessage} bordered={false}></TextArea>
          <div className={style['input-send-btn']} onClick={() => { console.log(message) }}>Send</div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
