import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "./useWindowSize";
import "./Board.css";
import { FaRedo, FaUndo } from "react-icons/fa";
import UndoCanvas from "undo-canvas";
import InfiniteCanvas from "ef-infinite-canvas";

function Board(props) {
  const [drawing, setDrawing] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  // const [image, setImage] = useState();
  const [tool, setTool] = useState("brush");

  const canvasRef = useRef();
  const ctx = useRef();

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");
    UndoCanvas.enableUndo(ctx.current);
  }, []);

  let startX = 0;
  let startY = 0;

  function drawOval(x, y) {
    ctx.current.clearRect(0, 0, width, height);
    ctx.current.beginPath();
    ctx.current.moveTo(startX, startY + (y - startY) / 2);
    ctx.current.bezierCurveTo(
      startX,
      startY,
      x,
      startY,
      x,
      startY + (y - startY) / 2
    );
    ctx.current.bezierCurveTo(
      x,
      y,
      startX,
      y,
      startX,
      startY + (y - startY) / 2
    );
    ctx.current.closePath();
    ctx.current.stroke();
  }

  const drawRect = () => {};

  const clear = () => {
    ctx.current.clearRect(0, 0, width, height);
  };

  function handleMouseMove(e) {
    const coords = [
      e.clientX - canvasRef.current.offsetLeft,
      e.clientY - canvasRef.current.offsetTop,
    ];
    if (tool === "brush") {
      if (drawing) {
        ctx.current.lineTo(...coords);
        ctx.current.stroke();
      }
      if (props.handleMouseMove) {
        props.handleMouseMove(...coords);
      }
    } else if (tool === "rect") {
      if (drawing) {
        e.preventDefault();
        e.stopPropagation();
        let mouseX = parseInt(e.clientX - canvasRef.current.offsetLeft);
        let mouseY = parseInt(e.clientY - canvasRef.current.offsetTop);
        drawRect(mouseX, mouseY);
      }
    } else if (tool === "oval") {
      if (drawing) {
        e.preventDefault();
        e.stopPropagation();
        let mouseX = parseInt(e.clientX - canvasRef.current.offsetLeft);
        let mouseY = parseInt(e.clientY - canvasRef.current.offsetTop);
        drawOval(mouseX, mouseY);
      }
    }
  }

  const undo = () => {
    ctx.current.undoTag();
  };
  const redo = () => {
    ctx.current.redoTag();
  };

  function startDrawing(e) {
    if (tool === "brush") {
      ctx.current.lineJoin = "round";
      ctx.current.lineCap = "round";
      ctx.current.lineWidth = props.brush;
      ctx.current.strokeStyle = props.color;
      ctx.current.beginPath();
      ctx.current.moveTo(
        e.clientX - canvasRef.current.offsetLeft,
        e.clientY - canvasRef.current.offsetTop
      );
    } else if (tool === "rect") {
      // ctx.current.beginPath();
      startX = parseInt(e.clientX - canvasRef.current.offsetLeft);
      startY = parseInt(e.clientY - canvasRef.current.offsetTop);
    } else if (tool === "oval") {
      startX = parseInt(e.clientX - canvasRef.current.offsetLeft);
      startY = parseInt(e.clientY - canvasRef.current.offsetTop);
    }
    setDrawing(true);
    ctx.current.putTag();
  }

  function stopDrawing() {
    ctx.current.closePath();
    // setImage(canvasRef.current.toDataURL());
    setDrawing(false);
    ctx.current.putTag();
  }

  let scaleFactor = 1.0;

  const scaleup = () => {
    scaleFactor *= 1.1;
    translate();
  };

  const translate = () => {
    // ctx.current.clearRect(0, 0, width, height);
    ctx.current.scale(scaleFactor, scaleFactor);
    ctx.current.beginPath();
    ctx.current.closePath();
    ctx.current.fillStyle = "blue";
    ctx.current.restore();
  };

  return (
    <div className="sketch" id="sketch">
      <div className="btns-container">
        <button onClick={clear} id="clear-btn">
          Clear board
        </button>
        <FaUndo className="undo-redo" onClick={undo} />
        <FaRedo className="undo-redo" onClick={redo} />
      </div>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={props.width || width}
        height={props.height || height}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export default Board;
