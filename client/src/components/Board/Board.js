import React, { useEffect, useRef, useState, useContext } from "react";
import "./Board.css";
import io from "socket.io-client";
import { fabric } from "fabric";
import { DataContext } from "../../DataContext";
import "../Container/Container.css";
import {
    FaPencilAlt,
    FaRegSquare,
    FaRegShareSquare,
    FaSlash,
    FaICursor,
    FaMousePointer,
    FaRegCircle,
    FaChalkboardTeacher,
    FaRegSave,
    FaUsers,
} from "react-icons/fa";
import swal from "sweetalert";
import background from "../img/background01.jpg";
import { useHistory } from "react-router-dom";

function Board(props) {
    const { setImage, setBoardName } = useContext(DataContext);
    const [brushSize, setBrushSize] = useState(1);
    const [brushColor, setBrushColor] = useState("black");
    const [showShare, setShowShare] = useState(false);
    const [presentationMode, setPresentationMode] = useState(false);
    const [width] = useState(window.innerWidth);
    const [height] = useState(window.innerHeight);
    const [socketUsers, setSocketUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

    const history = useHistory();

    // Variables
    let circle;
    let line;
    let rectangle;
    let isDown = false;
    let origX;
    let origY;
    let tool;

    // Refs
    const canvas = useRef();
    const brush = useRef();
    let socket = useRef();
    const clientData = useRef();

    useEffect(() => {
        // Create new canvas fabric
        canvas.current = new fabric.Canvas("canvas", {
            isDrawingMode: true,
            selection: true,
            backgroundColor: null,
            preserveObjectStacking: true,
        });

        // Separate board id from url
        let id = window.location.href.substring(
            window.location.href.lastIndexOf("/") + 1
        );

        let clientName = JSON.parse(localStorage.getItem("user_data"));

        if (clientName) {
            clientData.current = {
                roomId: id,
                name: clientName.fname,
            };
        }

        // Connect to socket server
        socket.current = io.connect(process.env.REACT_APP_API_HOST);
        if (clientData.current) {
            socket.current.on("connect", () => {
                socket.current.emit("join", clientData.current);
            });
        }

        // Get users in session
        socket.current.on("users", (data) => {
            setSocketUsers(data);
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
            if (canvas.current) {
                canvas.current.loadFromJSON(obj.data);
                canvas.current.renderAll();
            }
        });

        history.listen((url) => {
            socket.current.disconnect();
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
        canvas.current.on("object:selected", function (o) {
            var activeObj = o.target;
            if (activeObj.get("type") === "group") {
                activeObj.set({
                    borderColor: "#fbb802",
                    cornerColor: "#fbb802",
                });
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
        canvas.current.on("object:removed", () => {
            emitEvent();
        });
        canvas.current.on("object:skewing", () => {
            emitEvent();
        });
        canvas.current.on("object:moving", () => {
            emitEvent();
        });
        canvas.current.on("object:scaling", () => {
            emitEvent();
        });
        canvas.current.on("object:rotating", () => {
            emitEvent();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const enableDragging = () => {
        canvas.current.on("mouse:down", function (opt) {
            var evt = opt.e;
            if (evt.shiftKey === true) {
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
            } else {
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
            isDown = true;
            if (tool === "rect") {
                rectangle = new fabric.Rect({
                    left: origX,
                    top: origY,
                    fill: "transparent",
                    stroke: brushColor,
                    strokeWidth: brushSize,
                    selectable: true,
                });
                canvas.current.add(rectangle);
            } else if (tool === "circle") {
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
            } else if (tool === "line") {
                var points = [pointer.x, pointer.y, pointer.x, pointer.y];
                line = new fabric.Line(points, {
                    strokeWidth: brushSize,
                    // fill: "red",
                    stroke: brushColor,
                    originX: "center",
                    originY: "center",
                });
                canvas.current.add(line);
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
                rectangle.set({
                    left: Math.abs(pointer.x),
                });
            }
            if (origY > pointer.y) {
                rectangle.set({
                    top: Math.abs(pointer.y),
                });
            }

            rectangle.set({
                width: Math.abs(origX - pointer.x),
            });
            rectangle.set({
                height: Math.abs(origY - pointer.y),
            });
            canvas.current.renderAll();
        } else if (tool === "circle") {
            circle.set({ radius: Math.abs(origX - pointer.x) });
            canvas.current.renderAll();
        } else if (tool === "line") {
            line.set({ x2: pointer.x, y2: pointer.y });
            canvas.current.renderAll();
        } else {
            return;
        }
    };

    const onMouseUp = (o) => {
        isDown = false;
        if (tool === "rect") {
            if (rectangle) {
                rectangle.setCoords();
            }
        } else if (tool === "circle") {
            if (circle) {
                circle.setCoords();
            }
        } else if (tool === "line") {
            if (line) {
                line.setCoords();
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
        swal({
            title: "Are you sure you want to clear your board?",
            text: "there is no going back!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((result) => {
            if (result) {
                canvas.current.clear();
                emitEvent();
            }
        });
    };

    // Stroke change
    const handleColorChange = (e) => {
        brush.current.color = e.target.value;
        setBrushColor(e.target.value);
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
        if (canvas.current) {
            canvas.current.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    };

    if (showShare) {
        setTimeout(() => {
            setShowShare(false);
        }, 7000);
    }

    if (document.getElementById("color-picker-container")) {
        if (presentationMode) {
            document.getElementById("color-picker-container").style.display =
                "none";
            document.getElementById("btns-container").style.display = "none";
            document.getElementById("users-icon").style.display = "none";
            document.getElementById("board-container").style.backgroundImage =
                "unset";
            tool = "select";
            disableDrawingMode();
            enableDragging();
            canvas.current.defaultCursor = "grab";
            // document.body.requestFullscreen();
            document.body.webkitRequestFullScreen();
        } else {
            canvas.current.defaultCursor = "default";
            document.getElementById(
                "board-container"
            ).style.backgroundImage = `url(${background})`;
            document.getElementById("color-picker-container").style.display =
                "block";
            document.getElementById("btns-container").style.display = "flex";
            document.getElementById("users-icon").style.display = "block";
            document.webkitCancelFullScreen();
        }
    }

    const ListUsers = () => {
        if (socketUsers) {
            return (
                <div>
                    <h3>Users in session:</h3>
                    {socketUsers.map((item) => {
                        return <p key={item.id}>{item.name}</p>;
                    })}
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <div className="sketch" id="sketch">
            <div
                className={
                    showUsers ? "connected-users active" : "connected-users"
                }
            >
                <ListUsers />
            </div>
            <FaUsers
                onClick={() => setShowUsers(!showUsers)}
                id="users-icon"
                title="Users in session"
            />
            <div id="btns-container">
                <input
                    type="text"
                    id="board-name"
                    defaultValue="My board"
                    onChange={(e) => setBoardName(e.target.value)}
                />
                <button onClick={clear} id="clear-btn" title="Clear board">
                    Clear
                </button>
                <FaRegSave
                    onClick={() => saveImg()}
                    id="share-btn"
                    title="Save board"
                />
                <FaRegShareSquare
                    id="share-btn"
                    title="Share board"
                    onClick={() => setShowShare(!showShare)}
                />
                <div className={showShare ? "copy-popup active" : "copy-popup"}>
                    <input
                        type="text"
                        value={window.location.href}
                        id="copy-input"
                        readOnly
                    />
                    <button
                        id="clear-btn"
                        onClick={() => {
                            let urlCopy = document.getElementById("copy-input");
                            urlCopy.select();
                            urlCopy.setSelectionRange(0, 99999);
                            document.execCommand("copy");
                        }}
                    >
                        Copy
                    </button>
                </div>
            </div>
            <canvas id="canvas" ref={canvas} width={width} height={height} />
            <div id="color-picker-container">
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
                <FaICursor
                    id="item"
                    onClick={() => {
                        canvas.current.add(text);
                        disableDrawingMode();
                        enableDragging();
                        draw();
                    }}
                    title="Text"
                />
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
                <FaRegCircle
                    id="item"
                    onClick={() => {
                        disableShape();
                        tool = "circle";
                        draw();
                    }}
                    title="Circle"
                />
                <FaSlash
                    id="item"
                    onClick={() => {
                        disableShape();
                        tool = "line";
                        draw();
                    }}
                    title="Line"
                />
            </div>
            <FaChalkboardTeacher
                id="presentation-btn"
                onClick={() => {
                    setPresentationMode(!presentationMode);
                }}
                title="Toggle presentation mode"
            >
                Presentation mode
            </FaChalkboardTeacher>
        </div>
    );
}

export default Board;
