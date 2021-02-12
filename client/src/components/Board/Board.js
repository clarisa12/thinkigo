import React, { useEffect, useRef, useState, useContext } from "react";
import "./Board.css";
import io from "socket.io-client";
import { fabric } from "fabric";
import { DataContext } from "../../DataContext";
import "../Container/Container.css";
import {
  FaPencilAlt,
  FaRegSquare,
  FaShareAltSquare,
  FaArrowUp,
  FaICursor,
  FaMousePointer,
  FaCircle,
} from "react-icons/fa";

function Board(props) {
  const { setImage, setBoardName } = useContext(DataContext);
  const [brushSize, setBrushSize] = useState(1);
  const [brushColor, setBrushColor] = useState("black");
  // const [tool, setTool] = useState("brush");
  const [showShare, setShowShare] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // Variables
  let circle;
  let isDown = false;
  let origX;
  let origY;
  let tool;

  // Refs
  let rectangle = useRef();
  // let onMouseDown = useRef();
  // let onMouseUp = useRef();
  // let onMouseMove = useRef();
  // let enableDragging = useRef();
  let socket = useRef();
  const canvas = useRef();
  const brush = useRef();

  useEffect(() => {
    // Create new canvas fabric
    canvas.current = new fabric.Canvas("canvas", {
      isDrawingMode: true,
      selection: true,
    });
    // Separate board id from url
    let id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    // Connect to socket server
    socket.current = io.connect("http://localhost:8080");
    socket.current.emit("create", id);
    socket.current.on("connect", () => {
      socket.current.emit("event");
    });

    // Receive drawing event
    socket.current.on("draw", (obj) => {
      let ratio = width / obj.w;
      obj.data.objects.forEach(function (object) {
        object.left *= ratio;
        object.scaleX *= ratio;
        object.top *= ratio;
        object.scaleY *= ratio;
      });
      canvas.current.loadFromJSON(obj.data);
      canvas.current.renderAll();
    });

    // Brush variable
    brush.current = canvas.current.freeDrawingBrush;

    // Zooming and panning

    canvas.current.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.current.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.01) zoom = 0.01;
      canvas.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    canvas.current.on("object:selected", function (o) {
      var activeObj = o.target;
      if (activeObj.get("type") === "group") {
        activeObj.set({ borderColor: "#fbb802", cornerColor: "#fbb802" });
      }
    });

    canvas.current.on("path:created", () => {
      if (!canvas.current._activeObject) {
        emitEvent();
      }
    });
    canvas.current.on("object:modified", () => {
      if (!canvas.current._activeObject) {
        emitEvent();
      }
    });
  }, []);

  const enableDragging = () => {
    canvas.current.on("mouse:down", function (opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    canvas.current.on("mouse:move", function (opt) {
      if (this.isDragging) {
        canvas.current.isDrawingMode = false;
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    canvas.current.on("mouse:up", function (opt) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      emitEvent();
    });
  };

  const onMouseDown = (o) => {
    if (!canvas.current.selection && !canvas.current._activeObject) {
      var pointer = canvas.current.getPointer(o.e);
      canvas.current.isDrawingMode = false;
      origX = pointer.x;
      origY = pointer.y;
      if (tool === "rect") {
        isDown = true;
        rectangle.current = new fabric.Rect({
          left: origX,
          top: origY,
          fill: "transparent",
          stroke: brushColor,
          strokeWidth: brushSize,
          selectable: true,
        });
        canvas.current.add(rectangle.current);
      } else if (tool === "circle") {
        isDown = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        circle = new fabric.Circle({
          left: origX,
          top: origY,
          radius: 1,
          strokeWidth: brushSize,
          stroke: brushColor,
          fill: "transparent",
          selectable: true,
          originX: "center",
          originY: "center",
        });
        canvas.current.add(circle);
      } else {
        return;
      }
    }
  };

  const onMouseMove = (o) => {
    if (!isDown) return;
    var pointer = canvas.current.getPointer(o.e);
    if (tool === "rect") {
      if (origX > pointer.x) {
        rectangle.current.set({
          left: Math.abs(pointer.x),
        });
      }
      if (origY > pointer.y) {
        rectangle.current.set({
          top: Math.abs(pointer.y),
        });
      }

      rectangle.current.set({
        width: Math.abs(origX - pointer.x),
      });
      rectangle.current.set({
        height: Math.abs(origY - pointer.y),
      });
      canvas.current.renderAll();
    } else if (tool === "circle") {
      circle.set({ radius: Math.abs(origX - pointer.x) });
      canvas.current.renderAll();
    } else {
      return;
    }
  };

  const onMouseUp = (o) => {
    isDown = false;
    if (tool === "rect") {
      if (rectangle.current) {
        rectangle.current.setCoords();
      }
    } else if (tool === "circle") {
      if (circle) {
        circle.setCoords();
      }
    } else {
      return;
    }
    emitEvent();
  };

  // Socket event

  const emitEvent = () => {
    if (canvas.current) {
      let json = canvas.current.toJSON();
      let data = {
        w: width,
        h: height,
        data: json,
      };
      socket.current.emit("draw", data);
    }
  };

  // Text  box

  let text = new fabric.Textbox("New text", {
    width: 250,
    top: 250,
    left: 500,
    textAlign: "center",
  });

  // Clear board

  const clear = () => {
    canvas.current.clear();
  };

  // Stroke change
  const handleColorChange = (e) => {
    brush.current.color = e.target.value;
    setBrushColor(e.target.value);
    if (rectangle.current) {
      rectangle.current.stroke = e.target.value;
    }
  };

  // Color change
  const handleBrushChange = (e) => {
    brush.current.width = parseInt(e.target.value, 10);
    setBrushSize(e.target.value);
  };

  // Deleting objects
  function deleteSelectedObjectsFromCanvas(e) {
    if (canvas.current && e.key === "Delete") {
      var selection = canvas.current.getActiveObject();
      if (selection && selection.type === "activeSelection") {
        selection.forEachObject(function (element) {
          canvas.current.remove(element);
        });
      } else {
        canvas.current.remove(selection);
      }
      canvas.current.discardActiveObject();
      canvas.current.requestRenderAll();
    }
  }
  document.addEventListener("keyup", deleteSelectedObjectsFromCanvas, false);

  // Drawing functions
  const disableShape = () => {
    canvas.current.selection = true;
    canvas.current.off("mouse:down");
    canvas.current.off("mouse:move");
    canvas.current.off("mouse:up");
  };

  const enableDrawingMode = () => {
    canvas.current.isDrawingMode = true;
    disableShape();
  };

  const disableDrawingMode = () => {
    canvas.current.isDrawingMode = false;
    disableShape();
  };

  function draw() {
    canvas.current.isDrawingMode = false;
    canvas.current.selection = false;
    canvas.current.on("mouse:down", onMouseDown);
    canvas.current.on("mouse:move", onMouseMove);
    canvas.current.on("mouse:up", onMouseUp);
  }

  const saveImg = () => {
    setImage(canvas.current.toJSON());
    // saveBoardInDb();
  };

  // Handle window resizing
  window.onresize = () => {
    canvas.current.setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  if (showShare) {
    setTimeout(() => {
      setShowShare(false);
    }, 4000);
  }

  return (
    <div className="sketch" id="sketch">
      <div className="btns-container">
        <input
          type="text"
          id="board-name"
          defaultValue="My board"
          onChange={(e) => setBoardName(e.target.value)}
        />
        <button onClick={clear} id="clear-btn" title="Clear board">
          Clear board
        </button>
        <button onClick={() => saveImg()} id="clear-btn" title="Save board">
          Save Board
        </button>
        <FaShareAltSquare
          id="share-btn"
          title="Share board"
          onClick={() => setShowShare(!showShare)}
        />
        <div className={showShare ? "copy-popup active" : "copy-popup"}>
          <input type="text" value={window.location.href} id="copy-input" />
          <button
            id="copy-popup-btn"
            onClick={() => {
              let urlCopy = document.getElementById("copy-input");
              urlCopy.select();
              urlCopy.setSelectionRange(0, 99999);
              document.execCommand("copy");
            }}
          >
            Copy to clipboard
          </button>
        </div>
      </div>
      <canvas id="canvas" ref={canvas} width={width} height={height} />
      <div className="color-picker-container">
        <input
          type="color"
          id="color-input"
          onChange={handleColorChange}
          title="Color"
        />{" "}
        <FaMousePointer
          id="item"
          onClick={() => {
            tool = "select";
            disableDrawingMode();
            enableDragging();
          }}
          title="Select and drag"
        />
        <FaPencilAlt
          id="item"
          onClick={() => {
            disableShape();
            tool = "brush";
            disableShape();
            enableDragging();
            enableDrawingMode();
          }}
          title="Pencil"
        />
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={brushSize}
          id="brush-slider"
          onChange={handleBrushChange}
          title="Brush size"
        />
        <p>{brushSize}</p>
        <FaRegSquare
          id="item"
          onClick={() => {
            canvas.current.isDrawingMode = false;
            disableShape();
            tool = "rect";
            draw();
          }}
          title="Rectangle"
        />
        <FaCircle
          id="item"
          onClick={() => {
            disableShape();
            tool = "circle";
            draw();
          }}
          title="Circle"
        />
        <FaArrowUp id="item" />
        <FaICursor
          id="item"
          onClick={() => {
            canvas.current.add(text);
            disableDrawingMode();
            enableDragging();
            draw();
          }}
        />
      </div>
    </div>
  );
}

export default Board;
