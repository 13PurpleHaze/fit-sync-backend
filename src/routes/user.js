import { Router } from "express";
import UserControlelr from "../controllers/UserController.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import { registerRules, statusRules } from "../rules/user-rules.js";
import { validate } from "../middlewares/validatate.js";

const userController = new UserControlelr();
const router = Router();

router.get("/users", auth, admin, userController.get);
router.post("/users", auth, admin, registerRules, validate, userController.create);
router.patch("/users/:id/block", auth, admin, statusRules, validate, userController.block);
router.patch("/users/:id/unblock", auth, admin, statusRules, validate, userController.unblock);

export  { router as usersRouter};