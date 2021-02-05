import jwt from "jsonwebtoken";
import { getJWTTokenFromHeader } from "../jwt/utils.js";

export const authGuard = (req, res, next) => {
    const token = getJWTTokenFromHeader(req);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // TODO: create logs using something like winston
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
