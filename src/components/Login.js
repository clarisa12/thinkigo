import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <div className="login-container-grid">
        <div className="login-container-left">
          <div className="login-header">
            <h2 id="login-header-h2">Welcome to</h2>
            <h1 id="login-header-h1">thinkigo</h1>
          </div>
          <div className="form-container">
            <form id="login-form">
              <input type="text" placeholder="Username" id="username-input" />
              <input
                type="password"
                placeholder="Password"
                id="password-input"
              />
              <button id="sign-in-btn">Sign in</button>
              <p>Don't have an account?</p>
              <Link to="/register" id="Link">
                <span id="sign-up-btn">Sign up!</span>
              </Link>
            </form>
          </div>
        </div>
        <div className="login-container-right"></div>
      </div>
    </div>
  );
}

export default Login;
