import { body, param } from "express-validator";
import { BadRequest } from "../errors/BadRequest.js";

export const createRules = [
    body('title').notEmpty().withMessage('Field title is required'),
    body('is_static').isBoolean().withMessage('Field is_static must be a boolean'),
    body('img').custom(async (value, {req}) => {
        if(!req.file) {
            throw new BadRequest('Field img is require');
        }
    })
];

export const findRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
];

export const updateRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
    body('is_static').optional().isBoolean().withMessage('Field is_static must be a boolean'),
];

export const deleteRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
];