import React from "react";
import "./Login.css";
import "./Link.css";
import { Link } from "react-router-dom";
import loginIllu from "./undraw_right_places_h9n3.svg";
import { useDispatch } from "react-redux";
import { login } from "../../actions/index";

export default function Login() {
  const dispatch = useDispatch();

  return (
    <div>
      <div className="login-container-grid">
        <div className="login-container-left">
          <div className="login-header">
            <h2 id="login-header-h2">Welcome to</h2>
            <h1 id="login-header-h1">Thinkigo</h1>
          </div>
          <div className="form-container">
            <form id="login-form" onSubmit={() => dispatch(login())}>
              <input
                type="email"
                placeholder="Email Address"
                id="email-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                id="password-input"
                required
              />
              <button id="sign-in-btn" type="submit">
                Sign in
              </button>
              <p>Don't have an account?</p>
              <Link to="/register" className="linking">
                <span id="sign-up-btn">Sign up!</span>
              </Link>
            </form>
          </div>
        </div>
        <div className="login-container-right">
          <div className="login-right-text-box">
            <h3 className="login-container-right-text">DRAW</h3>
            <h2 className="login-container-right-text">PLAY</h2>
            <h1 className="login-container-right-text">PLAN</h1>
            <h1 id="login-container-right-main">HAVE FUN!</h1>
            <img
              src={loginIllu}
              height="300px"
              draggable="false"
              alt="main-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
