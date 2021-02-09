import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "./useWindowSize";
import "./Board.css";
import { FaRedo, FaUndo } from "react-icons/fa";
import UndoCanvas from "undo-canvas";
import { fabric } from "fabric";
import "../Container/Container.css";
import {
    FaPencilAlt,
    FaRegSquare,
    FaArrowUp,
    FaICursor,
    FaMousePointer,
    FaCircle,
} from "react-icons/fa";

function Board(props) {
    const [brushSize, setBrushSize] = useState(1);
    const [tool, setTool] = useState("brush");

    let rectangle = useRef();
    let circle;
    let isDown = false;
    let origX;
    let origY;
    let onMouseDown = useRef();
    let onMouseUp = useRef();
    let onMouseMove = useRef();
    let enableDragging = useRef();

    const canvas = useRef();
    const brush = useRef();

    useEffect(() => {
        // Create new canvas fabric
        canvas.current = new fabric.Canvas("canvas", {
            isDrawingMode: true,
            selection: true,
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
            canvas.current.zoomToPoint(
                { x: opt.e.offsetX, y: opt.e.offsetY },
                zoom
            );
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }, []);

    useEffect(() => {
        enableDragging.current = () => {
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
            });
        };

        onMouseDown.current = (o) => {
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
                        stroke: "black",
                        strokeWidth: props.brush,
                        selectable: true,
                    });
                    canvas.current.add(rectangle.current);
                } else if (tool === "circle") {
                    isDown = true;
                    circle = new fabric.Circle({
                        left: pointer.x,
                        top: pointer.y,
                        radius: 1,
                        strokeWidth: 1,
                        stroke: "black",
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

        onMouseMove.current = (o) => {
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

        onMouseUp.current = (o) => {
            isDown = false;
            if (tool === "rect") {
                rectangle.current.setCoords();
            } else if (tool === "circle") {
                // circle.setCoords();
            }
        };
    }, [tool]);

    let text = new fabric.Textbox("New text", {
        width: 250,
        top: 250,
        left: 500,
        textAlign: "center",
    });

    // Clear

    const clear = () => {
        canvas.current.clear();
    };

    // Stroke change
    const handleColorChange = (e) => {
        brush.current.color = e.target.value;
        if (rectangle.current) {
            rectangle.current.stroke = e.target.value;
        }
    };

    const handleBrushChange = (e) => {
        brush.current.width = e.target.value;
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
        canvas.current.selection = false;
        canvas.current.on("mouse:down", onMouseDown.current);
        canvas.current.on("mouse:move", onMouseMove.current);
        canvas.current.on("mouse:up", onMouseUp.current);
    }

    return (
        <div className="sketch" id="sketch">
            <div className="btns-container">
                <button onClick={clear} id="clear-btn">
                    Clear board
                </button>
            </div>
            <canvas
                id="canvas"
                ref={canvas}
                width={window.innerWidth}
                height={window.innerHeight}
            />
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
                        setTool("select");
                        disableDrawingMode();
                        enableDragging.current();
                    }}
                    title="Select and drag"
                />
                <FaPencilAlt
                    id="item"
                    onClick={() => {
                        disableShape();
                        setTool("brush");
                        disableShape();
                        enableDragging.current();
                        enableDrawingMode();
                    }}
                    title="Pencil"
                />
                <input
                    type="range"
                    min="1"
                    max="30"
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
                        disableShape();
                        setTool("rect");
                        draw();
                    }}
                    title="Rectangle"
                />
                <FaCircle
                    id="item"
                    onClick={() => {
                        disableShape();
                        setTool("circle");
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
                        enableDragging.current();
                        draw();
                    }}
                />
            </div>
        </div>
    );
}

export default Board;
