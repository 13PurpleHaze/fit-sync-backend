import { Router } from "express";
import SessionController from "../controllers/SessionController.js";
import { catcher } from "../middlewares/errors-catcher.js";

const router = Router();
const sessionController = new SessionController();

router.get('/session/:id/users', catcher(sessionController.getUsers));

export { router as sessionsRouter}