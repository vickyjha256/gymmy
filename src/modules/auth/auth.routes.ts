import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/register", authenticate, authController.register);
router.post("/login", authController.login);

export default router;