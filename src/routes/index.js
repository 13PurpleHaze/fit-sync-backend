import { Router } from "express";
import { exercisesRouter } from "./exercise.js";

const router = Router();

router.use(exercisesRouter);

export default router;