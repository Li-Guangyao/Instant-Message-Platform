import style from "./loginPage.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button, message } from "antd";
import "antd/lib/message/style/index.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  //   Check if the token stored in localstorage expired, if not, users will be directed to chat page without authentication.
  useEffect(() => {
    // 从主页能直接跳转到login
    // 如果是从index跳转到login，且本地的token没有过期，就直接登录到chat页面，不用再操作
    // 如果从其他页面来的，不能直接登录，因为register,chat也能跳到login，如果直接登录，用户就不能进行操作了

    if (location.pathname != "/") return;

    const token = localStorage.getItem("token");
    const email: any = localStorage.getItem("user");
    if (token && email) {
      axios
        .post(
          "http://127.0.0.1:8081/system/verify_token",
          {
            email,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res: any) => {
          console.log("verify_token", res);
          if (res.data.status == 200) {
            navigate("/chat", {
              state: {
                email,
              },
            });
          } else {
            message.warn("Token expired, please log in again.");
            navigate("/login");
          }
        });
    }
  }, []);

  function login(): void {
    if (email.length == 0 || password.length == 0) {
      message.warn("Please input email and password.");
      return;
    }
    axios
      .post("http://127.0.0.1:8081/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        const body = res.data;
        if (body.status == 200) {
          message.success(res.data.msg);
          localStorage.setItem("email", email);
          localStorage.setItem("token", body.data.token);
          navigate("/chat", {
            state: {
              email,
            },
          });
        } else {
          message.warn(res.data.msg);
        }
      });
  }

  return (
    <div className={style["container"]}>
      <img
        className={style["avatar"]}
        src={require("./images/polyu.png")}
        alt=""
      ></img>

      <input
        className={style["email-input"]}
        placeholder="Email Address"
        onInput={(e: any) => {
          setEmail(e.target.value);
        }}
      ></input>
      <input
        className={style["password-input"]}
        placeholder="Password"
        type={"password"}
        onInput={(e: any) => {
          setPassword(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.code == "Enter" || e.code == "NumpadEnter") {
            login();
          }
        }}
      ></input>

      <Button className={style["login-btn"]} onClick={login}>
        LOG IN
      </Button>

      <div
        className={style["switch-account-btn"]}
        onClick={() => navigate("/register")}
      >
        Register-&gt;
      </div>
    </div>
  );
}
