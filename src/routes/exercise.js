import { Router } from "express";
import ExerciseController from "../controllers/ExerciseController.js";
import { validate } from "../middlewares/validatate.js";
import { createRules, deleteRules, findRules, updateRules } from "../rules/exercise-rules.js";
import { catcher } from "../middlewares/errors-catcher.js";
import upload from "../middlewares/file-uploader.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";

const router = Router();
const exerciseController = new ExerciseController();

router.get('/exercises', auth, catcher(exerciseController.get));
router.get('/exercises/:id', auth, findRules, validate, catcher(exerciseController.find));
router.post('/exercises', auth, admin, upload.single('img') ,createRules, validate, catcher(exerciseController.create));
router.patch('/exercises/:id', auth, admin, upload.single('img'), updateRules, validate, catcher(exerciseController.update));
router.delete('/exercises/:id', auth, admin, deleteRules, validate, catcher(exerciseController.delete));

export const exercisesRouter = router;