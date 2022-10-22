import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import LoginPage from './loginPage';
import MainPage from './mainPage';
import RegistrationPage from './registrationPage';
import {Routes, Route, BrowserRouter} from 'react-router-dom'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className={style['background']}></div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegistrationPage/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
