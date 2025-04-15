"use client";

import "../login/style.css";
import React, { useState } from "react";
import axios from "axios";

export default function login() {
  const [email, setEmail] = useState("");
  const [loginpswd, setLoginPswd] = useState("");
  const [userName, setUserName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: loginpswd,
      });
      console.log("Login response:", response.data);
      localStorage.setItem("responseData", response.data);
    } catch {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const handRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        email: email,
        password: loginpswd,
        name: userName,
      });
      console.log(response.data);
    } catch {
      console.error("Register error:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className="body">
        <div className="main">
          <input type="checkbox" id="chk" aria-hidden="true" />

          <div className="signup">
            <form onSubmit={handRegister}>
              <label aria-hidden="true">Sign up</label>
              <input
                type="text"
                name="txt"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User name"
                required=""
                style={{
                  color: "black",
                }}
              />
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required=""
                style={{
                  color: "black",
                }}
              />
              <input
                type="password"
                name="pswd"
                onChange={(e) => setLoginPswd(e.target.value)}
                placeholder="Password"
                required=""
                style={{
                  color: "black",
                }}
              />
              <button>Sign up </button>
            </form>
          </div>

          <div className="login">
            <form onSubmit={handleLogin}>
              <label for="chk" aria-hidden="true">
                Login
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required=""
                style={{
                  color: "black",
                }}
              />
              <input
                type="password"
                name="pswd"
                value={loginpswd}
                onChange={(e) => setLoginPswd(e.target.value)}
                placeholder="Password"
                required=""
                style={{
                  color: "black",
                }}
              />
              <button>Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
