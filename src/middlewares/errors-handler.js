import { BadRequest } from "../errors/BadRequest.js";
import { Unauthorized } from "../errors/Unauthorized.js";
import { Forbidden } from "../errors/Forbidden.js";
import { NotFound } from "../errors/NotFound.js";

export const handler = (err, req, res, next) => {
    if(err instanceof BadRequest) {
        res.status(400).json({error: err.message});
    } else if(err instanceof Unauthorized) {
        res.status(401).json({error: err.message});
    } else if(err instanceof Forbidden) {
        res.status(403).json({error: err.message});
    } else if(err instanceof NotFound) {
        res.status(404).json({error: err.message});
    } else {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
}