import style from "./registrationPage.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import "antd/lib/message/style/index.css";
import { clearInterval } from "timers";
import {setInterval} from 'timers';

interface User {
  username: string;
  password: string;
}

function RegistrationPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailCorrect, setEmailCorrect] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  let codeInput: string = "";

  function login(): void {
    navigate("/");
  }

  function goBack() {
    navigate(-1);
  }

  function sendCode(): void {
    if (!isEmailCorrect) {
      message.warn("Email Address Format Incorrect.");
    } else {
      axios
        .post("http://127.0.0.1:8081/register/send_code", {
          email: emailAddress,
        })
        .then((res) => {
          let temptimer = setInterval(() => {
            if (countdown > 0) {
              setCountdown(countdown - 1);
            }
            let btn = document.getElementById("send-code-btn") as HTMLElement;
            btn.innerText = countdown + "s";
          }, 1000);
          clearInterval(temptimer);
        });
    }
  }

  function verifyCode(): void {
    axios
      .post("http://127.0.0.1:8081/register/verify_code", {
        email: emailAddress,
        code: codeInput,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  function regisgter(): void {
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

  function inputEmail(e: any): void {
    const reg = new RegExp(
      "^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$"
    );
    const email = e.target.value;

    if (reg.test(email)) {
      setEmailCorrect(true);
      setEmailAddress(e.target.value);
    } else {
      setEmailCorrect(false);
    }
  }

  return (
    <div className={style["container"]}>
      <div className={style["username"]}>
        <h3>Set username</h3>
        <input
          className={style["username-input"]}
          type=""
          placeholder="Input username"
          onInput={(e: any) => {
            setUsername(e.target.value);
          }}
        ></input>
      </div>

      <div className={style["email"]}>
        <h3>Email</h3>
        <div className={style["email-input"]}>
          <input
            className={style["email-input-box"]}
            type="email"
            placeholder="example@domain.xxx"
            onInput={(e) => {
              inputEmail(e);
            }}
          ></input>
          {isEmailCorrect ? (
            <img
              className={style["status-sign"]}
              src={require("./images/check.png")}
            ></img>
          ) : (
            <img
              className={style["status-sign"]}
              src={require("./images/cross.png")}
            ></img>
          )}
          <button
            className={style["send-code-btn"]}
            id="send-code-btn"
            onClick={sendCode}
          >
            Send Verification Code
          </button>
        </div>

        <div className={style["email-verify"]}>
          <input
            className={style["code-input-box"]}
            placeholder="Input the 6-bit code you received."
            onInput={(e: any) => {
              codeInput = e.target.value;
            }}
          ></input>
          {isEmailVerified ? (
            <img
              className={style["status-sign"]}
              src={require("./images/check.png")}
            ></img>
          ) : (
            <img
              className={style["status-sign"]}
              src={require("./images/cross.png")}
            ></img>
          )}
          <button className={style["verify-code-btn"]} onClick={verifyCode}>
            Verify Email
          </button>
        </div>
      </div>

      <div className={style["password"]}>
        <h3>Set a password</h3>
        <input
          className={style["password-input"]}
          type="password"
          onInput={(e: any) => {
            setPassword(e.target.value);
          }}
        ></input>
        <h4>Reinput the password.</h4>
        <div className={style["password-reinput"]}>
          <input
            className={style["password-input"]}
            type="password"
            onInput={(e: any) => {
              password == e.target.value
                ? setIsPasswordVerified(true)
                : setIsPasswordVerified(false);
            }}
          ></input>
          {isPasswordVerified ? (
            <img
              className={style["status-sign"]}
              src={require("./images/check.png")}
            ></img>
          ) : (
            <img
              className={style["status-sign"]}
              src={require("./images/cross.png")}
            ></img>
          )}
        </div>
      </div>

      <button className={style["register"]} onClick={regisgter}>
        Submit Registration
      </button>

      <div className={style["back-btn"]} onClick={goBack}>
        &lt; -Go Back
      </div>
    </div>
  );
}

export default RegistrationPage;
