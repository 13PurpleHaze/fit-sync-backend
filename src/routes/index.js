import { Router } from "express";
import { exercisesRouter } from "./exercise.js";
import { authRouter } from "./auth.js";
import { auth } from "../middlewares/auth.js";
import { usersRouter } from "./user.js";
import { workoutsRouter } from "./workout.js";
import { sessionsRouter } from "./session.js";
import { NotFound } from "../errors/NotFound.js";

const router = Router();

router.use(exercisesRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(workoutsRouter);
router.use(sessionsRouter);
router.use('*', (req, res, next) => {
    next(new NotFound(req.url, req.method));
})

export default router;