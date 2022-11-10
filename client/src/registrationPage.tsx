import style from "./registrationPage.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import "antd/lib/message/style/index.css";

interface User {
  username: string;
  password: string;
}
let timeChange: any;

function RegistrationPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailCorrect, setEmailCorrect] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [countdown, setCountdown] = useState(60);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [btnContent, setBtnContent] = useState("Send Verification Code");

  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const [code, setCode] = useState("");

  useEffect(() => {
    clearInterval(timeChange);
    return () => clearInterval(timeChange);
  }, []);

  useEffect(() => {
    if (countdown > 0 && countdown < 60) {
      setBtnContent(`Resend after ${countdown}s`);
    } else {
      clearInterval(timeChange);
      setIsBtnDisabled(false);
      setCountdown(60);
      setBtnContent("Send Verification Code");
    }
  }, [countdown]);

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
          setIsBtnDisabled(true);
          timeChange = setInterval(function () {
            if (countdown > 0) {
              setCountdown((countdown) => --countdown);
            }
          }, 1000);
        });
    }
  }

  function verifyCode(): void {
    axios
      .post("http://127.0.0.1:8081/register/verify_code", {
        email: emailAddress,
        code,
      })
      .then((res) => {
        if (res.data.status) {
          message.success("Email verified successfully!");
          setIsEmailVerified(true);
        } else {
          message.warn("You input a wrong code.");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  function regisgter(): void {
    if (!isEmailVerified) {
      message.error("Your email is not verified!");
    } else {
      axios
        .post("http://127.0.0.1:8081/register", {
          username: username,
          email: emailAddress,
          password: password,
        })
        .then((res) => {
          if (res.data.status === 200) {
            localStorage.setItem("username", username);
            localStorage.setItem("email", emailAddress);
            navigate("/chat", { state: { email: emailAddress } });
          } else {
            message.warn(res.data.tip);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }

  function inputEmail(e: any): void {
    const reg = new RegExp(
      "^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$"
    );
    const email = e.target.value;

    if (reg.test(email)) {
      setEmailCorrect(true);
      setEmailAddress(e.target.value);
      setIsEmailVerified(false);
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
              alt=""
            ></img>
          ) : (
            <img
              className={style["status-sign"]}
              src={require("./images/cross.png")}
              alt=""
            ></img>
          )}
          <button
            className={style["send-code-btn"]}
            disabled={isBtnDisabled}
            onClick={sendCode}
          >
            {btnContent}
          </button>
        </div>

        <div className={style["email-verify"]}>
          <input
            className={style["code-input-box"]}
            placeholder="Input the 6-bit code you received."
            onInput={(e: any) => {
              setCode(e.target.value);
            }}
          ></input>
          {isEmailVerified ? (
            <img
              className={style["status-sign"]}
              src={require("./images/check.png")}
              alt=""
            ></img>
          ) : (
            <img
              className={style["status-sign"]}
              src={require("./images/cross.png")}
              alt=""
            ></img>
          )}
          <button
            className={style["verify-code-btn"]}
            onClick={verifyCode}
            disabled={!isEmailCorrect || isEmailVerified}
          >
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
        <h3>Reinput the password.</h3>
        <div className={style["password-reinput"]}>
          <input
            className={style["password-input"]}
            type="password"
            onInput={(e: any) => {
              if (e.target.value !== "") {
                setIsPasswordVerified(password === e.target.value);
              }
            }}
          ></input>
          {isPasswordVerified ? (
            <img
              className={style["status-sign"]}
              src={require("./images/check.png")}
              alt=""
            ></img>
          ) : (
            <img
              className={style["status-sign"]}
              src={require("./images/cross.png")}
              alt=""
            ></img>
          )}
        </div>
      </div>

      <button className={style["register"]} onClick={regisgter}>
        Submit Registration
      </button>

      <div className={style["back-btn"]} onClick={goBack}>
        &lt;- Go Back
      </div>
    </div>
  );
}

export default RegistrationPage;
