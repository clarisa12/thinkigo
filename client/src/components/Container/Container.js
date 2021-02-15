import React from "react";
import Board from "../Board/Board";
import "./Container.css";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";

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
      <div className="board-container">
        <Board />
      </div>
    </div>
  );
}

export default Container;
