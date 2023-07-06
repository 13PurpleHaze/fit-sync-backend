import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh', authController.refresh);

export const authRouter = router;