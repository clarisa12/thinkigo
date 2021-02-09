import React, { useState } from "react";
import "./Register.css";
import "./Link.css";
import { useHistory, Link } from "react-router-dom";
import AuthService from "../../AuthService";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function Register() {
    const history = useHistory();
    const [registerData, setRegisterData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        const { fname, lname, email, password } = registerData;

        try {
            const response = await AuthService.register(
                fname,
                lname,
                email,
                password
            );
            if (response.success) {
                history.push("/");
            } else {
                //TODO: show ui errors
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
            <div className="regis-container-grid">
                <div className="regis-container-left">
                    <div className="regis-header">
                        <h2 id="regis-header-h2">Welcome to</h2>
                        <h1 id="regis-header-h1">Thinkigo</h1>
                    </div>
                </div>
                <div className="regis-container-right">
                    <h2 id="regis-header-h2-2">Register Here</h2>

                    <div className="form-container">
                        <form id="regis-form" onSubmit={onSubmit}>
                            <input
                                type="text"
                                placeholder="First Name"
                                id="fname-input"
                                onChange={(ev) =>
                                    setRegisterData({
                                        ...registerData,
                                        fname: ev.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                id="lname-input"
                                onChange={(ev) =>
                                    setRegisterData({
                                        ...registerData,
                                        lname: ev.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                id="email-input"
                                onChange={(ev) =>
                                    setRegisterData({
                                        ...registerData,
                                        email: ev.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                id="password-input"
                                onChange={(ev) =>
                                    setRegisterData({
                                        ...registerData,
                                        password: ev.target.value,
                                    })
                                }
                                required
                            />
                            <button id="regis-btn" type="submit">
                                Register
                            </button>
                        </form>
                        <Link to="/" className="linking">
                            <div id="login-btn">« Back to login</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
