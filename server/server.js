import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import { userRouter, authRouter } from "./routes/index.js";
import { Server } from "socket.io";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

dbConnection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
);

/**
 *
 * @param {Socket} socket
 */
const socketListener = (socket) => {
    console.log(socket);
    socket.on("send-coords", (coords) => {
        socket.broadcast.emit("receive-coords", coords);
    });

    socket.on("start-drawing", (coords) => {
        socket.broadcast.emit("start-drawing", coords);
    });

    socket.on("stop-drawing", () => {
        socket.broadcast.emit("stop-drawing");
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
};

io.on("connection", socketListener);

const { PORT } = process.env;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
