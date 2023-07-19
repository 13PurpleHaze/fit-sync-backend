import { Router } from "express";
import { exercisesRouter } from "./exercise.js";
import { authRouter } from "./auth.js";
import { auth } from "../middlewares/auth.js";
import { usersRouter } from "./user.js";
import { workoutsRouter } from "./workout.js";
import { sessionsRouter } from "./session.js";

const router = Router();

router.use(exercisesRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(workoutsRouter);
router.use(sessionsRouter);
router.post("/dummy", auth)

export default router;