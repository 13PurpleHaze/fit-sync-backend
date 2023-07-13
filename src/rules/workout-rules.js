import { body, param } from "express-validator";
import { BadRequest } from "../errors/BadRequest.js";

export const createRules = [
    body('title').notEmpty().withMessage('Field title is required').isLength({max: 255}).withMessage('Max length of field title is 255'),
    body('exercises').custom(value => {
        if(value && !Array.isArray(value) && typeof value === 'object') {
            for(let key in value) {
                if(!Number.isInteger(+key) || !Number.isInteger(+value[key])) {
                    throw new BadRequest('Incorrect type of field exercises');
                }
            }
        } else {
            throw new BadRequest('Incorrect type of field exercises or it is empty');
        }
        return true;
    }),
];

export const getExercisesRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
];

export const updateRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
    body('title').isLength({max: 255}).withMessage('Max length of field title is 255'),
    body('exercises').custom(value => {
        if(!Array.isArray(value) && typeof value === 'object') {
            for(let key in value) {
                if(!Number.isInteger(+key) || !Number.isInteger(+value[key])) {
                    throw new BadRequest('Incorrect type of field exercises');
                }
            }
        } else if(typeof value !== 'undefined') {
            throw new BadRequest('Incorrect type of field exercises');
        }
        return true;
    }),
];

export const deleteRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
];