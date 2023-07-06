import { Router } from "express";
import ExerciseController from "../controllers/ExerciseController.js";
import { validate } from "../middlewares/validatate.js";
import { createRules, deleteRules, findRules, updateRules } from "../rules/exercise-rules.js";
import { catcher } from "../middlewares/errors-catcher.js";
import upload from "../middlewares/file-uploader.js";

const router = Router();
const exerciseController = new ExerciseController();

router.get('/exercises', catcher(exerciseController.get));
router.get('/exercises/:id', findRules, validate, catcher(exerciseController.find));
router.post('/exercises', upload.single('file'), createRules, validate, catcher(exerciseController.create));
router.patch('/exercises/:id', upload.single('file'), updateRules, validate, catcher(exerciseController.update));
router.delete('/exercises/:id', deleteRules, validate, catcher(exerciseController.delete));

export const exercisesRouter = router;