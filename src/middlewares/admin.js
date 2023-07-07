import { Forbidden } from "../errors/Forbidden.js";

export const admin = (req, res, next) => {
    if(req.user.is_admin) {
        next();
    } else {
        next(new Forbidden());
    }
}