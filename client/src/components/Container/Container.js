import React, { useState } from "react";
import Board from "../Board/Board";
import "./Container.css";
import { Link } from "react-router-dom";

function Container() {
  const [color, setColor] = useState("black");
  const [brushSize, setBrushSize] = useState(3);

  return (
    <div className="container">
      <Link to="/">
        <div className="logo-overlay">
          <h1 id="logo-overlay-text">thinkigo</h1>
        </div>
      </Link>
      <div className="board-container">
        <Board color={color} brush={brushSize} setColor={setColor}></Board>
      </div>
    </div>
  );
}

export default Container;
