import { Forbidden } from "../errors/Forbidden.js";

export const admin = (req, res, next) => {
    if(Number(req.user.role_id) === 2) {
        next();
    } else {
        next(new Forbidden());
    }
}