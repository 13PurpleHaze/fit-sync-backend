import { Unauthorized } from "../errors/Unauthorized.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export const auth = (req, res, next) => {
    const token = req.headers?.authorization;
    if(!token) {
        next(new Unauthorized());
        return;
    }
    const [, accessToken] = token.split(' ');
    if(!accessToken) {
        next(new Unauthorized());
        return;
    }
    
    try {
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = payload; 
        next();
    } catch(error) {
        next(new Unauthorized());
    }
}