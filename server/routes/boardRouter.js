import { Router } from "express";
import { createNew, getUserBoards } from "../controllers/boardController.js";
import { authGuard } from "../middleware/authGuard.js";

const boardRouter = Router();

boardRouter.post("/new", authGuard, createNew);
boardRouter.get("/retrieve", authGuard, getUserBoards);

export default boardRouter;
