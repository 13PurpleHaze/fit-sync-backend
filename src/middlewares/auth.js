import { Unauthorized } from "../errors/Unauthorized.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) {
        next(new Unauthorized());
    }
    const [, accessToken] = token.split(' ');
    if(!accessToken) {
        next(new Unauthorized());
    }

    try {
        const payload = jwt.verify(accessToken, "ACCESS_SECRET_KEY");
        req.user = payload;
        console.log(req.user)
        next();
    } catch(error) {
        next(new Unauthorized());
    }
}