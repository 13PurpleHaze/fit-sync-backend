import { Router } from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import { auth } from "../middlewares/auth.js";
import { createRules, getExercisesRules, updateRules, deleteRules, findRules } from "../rules/workout-rules.js";
import { validate } from "../middlewares/validatate.js";
import { catcher } from "../middlewares/errors-catcher.js";

const router = Router();
const workoutController = new WorkoutController();

router.post("/workouts", auth, createRules, validate, catcher(workoutController.create));
router.get("/workouts", auth, catcher(workoutController.get));
router.get('/workouts/:id', auth, findRules, validate, catcher(workoutController.find))
router.patch('/workouts/:id', auth, updateRules, validate, catcher(workoutController.update));
router.delete('/workouts/:id', auth, deleteRules, validate, catcher(workoutController.delete));
router.get('/history',auth, catcher(workoutController.getHistory));

export {router as workoutsRouter};
