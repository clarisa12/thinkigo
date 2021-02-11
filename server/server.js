import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import { userRouter, authRouter, boardRouter } from "./routes/index.js";
import { Server } from "socket.io";
import { Socket } from "dgram";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/board", boardRouter);

const server = createServer(app);
/* creating a new socket.io server instance */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// logs the db error
dbConnection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

/**
 *
 * @param {Socket} socket
 */
const socketListener = (socket) => {
  //when it receives the event "send-coords", the function executes the content (socket.broadcast.emit)
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("send-coords", (coords) => {
    socket.broadcast.emit("receive-coords", coords);
  });

  socket.on("stop-drawing", () => {
    socket.broadcast.emit("stop-drawing");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
};

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
    console.log("drawing..");
  });
});

const { PORT } = process.env;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
