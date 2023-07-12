import { Router } from "express";
import UserControlelr from "../controllers/UserController.js";

const userController = new UserControlelr();
const router = Router();

router.post("/users/:id/block", userController.block);
router.post("/users/:id/unblock", userController.unblock);

export const userRouter = router;