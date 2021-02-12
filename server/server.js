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

let drawingData = [];

io.on("connection", (socket) => {
  // Create room
  socket.on("create", (room) => {
    socket.join(room);
    console.log(`user with id ${socket.id} joined room ${room}`);
    // Emit drawing received from client
    socket.on("draw", (data) => {
      drawingData.push(data);
      socket.in(room).broadcast.emit("draw", data);
    });
  });
});

const { PORT } = process.env;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
