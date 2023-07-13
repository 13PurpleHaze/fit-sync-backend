import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { catcher } from "../middlewares/errors-catcher.js";
import { loginRules, registerRules } from "../rules/user-rules.js";
import { validate } from "../middlewares/validatate.js";
import { auth } from "../middlewares/auth.js";

const router = Router();
const authController = new AuthController();

router.post('/auth/register', registerRules, validate, catcher(authController.register));
router.post('/auth/login', loginRules, validate, catcher(authController.login));
router.post('/auth/logout', auth, catcher(authController.logout));
router.post('/auth/refresh', catcher(authController.refresh));

export { router as authRouter };