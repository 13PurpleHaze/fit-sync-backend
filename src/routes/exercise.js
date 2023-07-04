import { Router } from "express";
import ExerciseController from "../controllers/ExerciseController.js";

const router = Router();
const exerciseController = new ExerciseController();

router.get('/exercises', exerciseController.get);
router.get('/exercises/:id', () => {});
router.post('/exercises', () => {});
router.patch('/exercises/:id', () => {});
router.delete('/exercises/:id', () => {});

export const exercisesRouter = router;