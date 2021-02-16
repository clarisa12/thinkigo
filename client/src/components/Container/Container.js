import React from "react";
import Board from "../Board/Board";
import "./Container.css";
import { Link } from "react-router-dom";

import logo from "../img/logo.png";
import ProtectedRoute from "../../ProtectedRoute";

function Container() {
    return (
        <div className="container">
            <Link to="/">
                <div className="logo-overlay">
                    <img
                        src={logo}
                        width="240px"
                        draggable="false"
                        alt="thinkigo-logo"
                        unselectable="on"
                        id="board-logo"
                        onClick={() => {
                            document.webkitCancelFullScreen();
                        }}
                    />
                </div>
            </Link>
            <div id="board-container">
                <Board />
            </div>
        </div>
    );
}

function ProtectedContainer() {
    return <ProtectedRoute component={Container} />;
}

export default ProtectedContainer;
