import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import * as userController from "./user.controller";

const router = Router();

router.get(
  "/me",
  authenticate,
  userController.getProfile
);

router.patch(
  "/me",
  authenticate,
  userController.updateProfile
);

router.patch(
  "/change-password",
  authenticate,
  userController.changePassword
);


export default router;