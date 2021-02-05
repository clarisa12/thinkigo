import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import { userRouter, authRouter } from "./routes/index.js";
import ws from "./ws/ws.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);

dbConnection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
);

const { HTTP_PORT } = process.env;
app.listen(HTTP_PORT, () => console.log(`Server on port ${HTTP_PORT}`));
