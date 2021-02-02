import React, { useState } from "react";
import Board from "../board/Board";
import "./Container.css";
import { FaPencilAlt, FaRegSquare, FaArrowUp, FaEraser } from "react-icons/fa";

function Container() {
  const [color, setColor] = useState();
  const [brushSize, setBrushSize] = useState(3);

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    setBrushSize(e.target.value);
  };

  console.log(brushSize);

  return (
    <div className="container">
      <div className="logo-overlay">
        <h1>thinkigo</h1>
      </div>
      <div className="color-picker-container">
        <input
          type="color"
          onChange={handleColorChange}
          value={color}
          id="color-input"
        />{" "}
        <FaPencilAlt id="item" />
        <input
          type="range"
          min="0.2"
          max="20"
          step="0.2"
          onChange={handleSizeChange}
          id="brush-slider"
        />
        <p>{brushSize}</p>
        <FaRegSquare id="item" />
        <FaArrowUp id="item" />
        <FaEraser id="item" />
      </div>
      <div className="board-container">
        <Board color={color} brush={brushSize} setColor={setColor}></Board>
      </div>
    </div>
  );
}

export default Container;
