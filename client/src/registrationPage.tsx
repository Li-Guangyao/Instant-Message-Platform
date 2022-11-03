import style from "./registrationPage.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegistrationPage() {
  const navigate = useNavigate();

  interface User {
    username: string;
    password: string;
  }

  function login(): void {
    navigate("/");
  }

  function goBack() {
    navigate(-1);
  }

  function sendCode(email: String) {
    axios
      .post("http://127.0.0.1:8081/register/send_code", {
        email: email
      })
      .then((res) => {
        console.log("res", res);
      });
  }

  function regisgter() {
    axios
      .post("http://127.0.0.1:8081/register", {
        liguangyao: "name",
        age: 56,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  return (
    <div className={style["container"]}>
      <div className={style["email-varification"]}>
        <div className={style["email-varification-first"]}>
          <input
            className={style["email-input"]}
            type="email"
            placeholder="example@domain.xxx"
          ></input>
          <div className={style["status-sign"]}>Yes</div>
          <button
            className={style["send-code-btn"]}
            onClick={() => {
              sendCode("1720344233@qq.com");
            }}
          >
            Send a Code
          </button>
        </div>
        <div className={style["email-varification-second"]}>
          <input className={style["verification-code"]}></input>
          <div className={style["status-sign"]}>Yes</div>
        </div>
        <button className={style["register-btn"]} onClick={regisgter}>
          Register an Account
        </button>
        <div className={style["back-btn"]} onClick={goBack}>
          Go Back
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
