import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import { userRouter, authRouter, boardRouter } from "./routes/index.js";
import socket from "./socketHandler.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/board", boardRouter);

const server = createServer(app);
socket(server);

// logs the db error
dbConnection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
);

const { PORT } = process.env;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
