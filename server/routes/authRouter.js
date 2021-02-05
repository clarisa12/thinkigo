import { Router } from "express";
import { handleSignIn } from "../controllers/authController.js";
import { hasBody } from "../middleware/hasBody.js";
import { authGuard } from "../middleware/authGuard.js";

const authRouter = Router();

authRouter.post("/signin", hasBody, handleSignIn);
// authRouter.post("/signout", authGuard, handleeSignOut);
// authRouter.post("/refresh-token", handleRefreshToken);

export default authRouter;
