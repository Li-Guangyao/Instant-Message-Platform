import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import MainPage from './mainPage';
import RegistrationPage from './registrationPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className={style['background']}></div>
    <MainPage />
    {/* <RegistrationPage></RegistrationPage> */}
  </React.StrictMode>
);
