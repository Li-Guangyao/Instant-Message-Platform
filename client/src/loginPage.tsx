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

  interface UserInfo {
    username: String;
    email: string;
  }

  //   Check if the token stored in localstorage expired, if not, users will be directed to chat page without authentication.
  useEffect(() => {
    // If users access from home path(/), then it will check the token information;
    // If users access from login path(/login), then nothing will be done.
    if (location.pathname != "/") return;

    const token: any = localStorage.getItem("token");
    const user: any = localStorage.getItem("user");
    if (token && user) {
      axios
        .post(
          "http://127.0.0.1:8081/system/verify_token",
          {
            email: user.email,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res: any) => {
          console.log("verify_token", res);
          if (res.data.code == 200) {
            navigate("/chat", {
              state: {
                email: email,
              },
            });
          } else {
            message.warn("Token expired, please log in again.");
            navigate("/login");
          }
        });
    } else {
      navigate("/login");
    }
  }, []);

  function login(): void {
    axios
      .post("http://127.0.0.1:8081/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        const body = res.data;
        if (body.code == 200) {
          localStorage.setItem("email", email);
          localStorage.setItem("token", body.data.token);
          navigate("/chat", {
            state: {
              email: email,
            },
          });
        } else {
          message.warn("Wrong Password, or the user doesn't exist.");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  return (
    <div className={style["container"]}>
      <img
        className={style["avatar"]}
        src={require("./images/polyu.png")}
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
