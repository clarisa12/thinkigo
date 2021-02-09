import { Router } from "express";
import { createNew } from "../controllers/boardController.js";
import { authGuard } from "../middleware/authGuard.js";

const boardRouter = Router();

boardRouter.post("/new", authGuard, createNew);

export default boardRouter;
