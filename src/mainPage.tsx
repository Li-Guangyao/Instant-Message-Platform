import React from 'react';
import style from './mainPage.module.css';

function MainPage() {
  return (
    <div className={style['container']}>
      <div className={style["side-bar"]}>
        <image className={style['avatar']}></image>
      </div>
      <div className={style["info-bar"]}>
          <div className={style['search-box']}></div>
      </div>
      <div className={style['chat-panel']}>
        <div className={style['contact-name']}></div>
        <div className={style['dialogue-content']}></div>
        <div className={style['input-box']}></div>
      </div>
    </div>
  );
}

export default MainPage;
