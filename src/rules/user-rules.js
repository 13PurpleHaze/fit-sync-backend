import { body, cookie, param } from "express-validator";
export const registerRules = [
    body('first_name').notEmpty().withMessage('Field first_name is required').isLength({max: 255}).withMessage('Max length of field first_name is 255'),
    body('sur_name').notEmpty().withMessage('Field sur_name is requiredld').isLength({max: 255}).withMessage('Max length of field sur_name is 255'),
    body('age').notEmpty().withMessage('Field age is required').isInt().withMessage('Field age must be an integer').isLength({max:3}),
    body('gender').notEmpty().withMessage('Field gender is required').isBoolean().withMessage('Field gender must be a boolean'),
    body('login').notEmpty().withMessage('Field login is required').isLength({max: 255}).withMessage('Max length of field login is 255'),
    body('password').notEmpty().withMessage('Field password is required').isLength({max: 255}).withMessage('Max length of field password is 255'),
];

export const loginRules = [
    body('login').notEmpty().withMessage('Field login is required').isLength({max: 255}).withMessage('Max length of field login is 255'),
    body('password').notEmpty().withMessage('Field password is required').isLength({max: 255}).withMessage('Max length of field password is 255'),
];

export const statusRules = [
    param('id').isInt().withMessage('Param id must be an integer'),
];

