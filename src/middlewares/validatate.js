import { validationResult } from "express-validator";
import { BadRequest } from "../errors/BadRequest.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new BadRequest(`${errors.array()[0].msg}`));
    } else {
        next();
    }
}