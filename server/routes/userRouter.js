import { Router } from "express";
import {
    createUser,
    getUserInfo,
    getUserBoards,
} from "../controllers/userController.js";
import { authGuard } from "../middleware/authGuard.js";
import { hasBody } from "../middleware/hasBody.js";

const userRouter = Router();

userRouter.post("/add", hasBody, createUser);
userRouter.get("/info", authGuard, getUserInfo);
userRouter.get("/boards", authGuard, getUserBoards);

export default userRouter;
