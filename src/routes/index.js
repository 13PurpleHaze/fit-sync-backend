import { Router } from "express";
import { exercisesRouter } from "./exercise.js";
import { authRouter } from "./auth.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.use(exercisesRouter);
router.use(authRouter);
router.post("/dummy", auth)

export default router;