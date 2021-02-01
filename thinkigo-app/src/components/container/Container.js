import React, { useState } from "react";
import Board from "../board/Board";
import "./Container.css";
import { FaPencilAlt, FaRegSquare, FaArrowUp, FaEraser } from "react-icons/fa";

function Container() {
  const [color, setColor] = useState();

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <div className="container">
      {/* <div>
        <h1>name</h1>
      </div> */}
      <div className="color-picker-container">
        <input
          type="color"
          onChange={handleColorChange}
          value={color}
          id="color-input"
        />
        <FaPencilAlt id="item" />
        <FaRegSquare id="item" />
        <FaArrowUp id="item" />
        <FaEraser id="item" />
      </div>
      <div className="board-container">
        <Board color={color}></Board>
      </div>
    </div>
  );
}

export default Container;
