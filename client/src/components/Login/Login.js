import React, { useState } from "react";
import "./Login.css";
import "./Link.css";
import loginIllu from "./undraw_right_places_h9n3.svg";
import AuthService from "../../AuthService";
import { useHistory, Link } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import logo from "../img/logo.png";

export default function Login() {
    const history = useHistory();
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = loginData;

        try {
            const response = await AuthService.signIn(email, password);
            if (response.success) {
                const queryString = window.location.search;
                const params = new URLSearchParams(queryString);
                history.push(params.get("redirect") || "/");
            } else {
                //TODO: show ui errors
                setError(response.message);
            }
        } catch (error) {
            console.log(error);
            // TODO: handle auth error
        }
    };

    if (AuthService.auth.isSignedIn) {
        return <Redirect path="/" />;
    }

    return (
        <div>
            <div className="login-container-grid">
                <div className="login-container-left">
                    <div className="login-header">
                        <h2 id="login-header-h2">Welcome to</h2>
                        {/* <h1 id="login-header-h1">Thinkigo</h1> */}
                        <img src={logo} alt="thinkigo-logo" width="250px" />
                    </div>
                    <div className="form-container">
                        <form id="login-form" onSubmit={onSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                id="email-input"
                                onChange={(ev) =>
                                    setLoginData({
                                        ...loginData,
                                        email: ev.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                id="password-input"
                                onChange={(ev) =>
                                    setLoginData({
                                        ...loginData,
                                        password: ev.target.value,
                                    })
                                }
                                required
                            />
                            {error && <div id="err-handling">{error}</div>}
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
                            id="login-logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
