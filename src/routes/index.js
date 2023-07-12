import { Router } from "express";
import { exercisesRouter } from "./exercise.js";
import { authRouter } from "./auth.js";
import { auth } from "../middlewares/auth.js";
import { userRouter } from "./user.js";

const router = Router();

router.use(exercisesRouter);
router.use(authRouter);
router.use(userRouter);
router.post("/dummy", auth)

export default router;