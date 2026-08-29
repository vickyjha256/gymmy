import { Router } from "express";
import { authenticate, authorize } from "../../common/middleware/auth.middleware";
import * as gymController from "./gym.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(UserRole.OWNER),
  gymController.getGym
);

router.patch(
  "/",
  authenticate,
  authorize(UserRole.OWNER),
  gymController.updateGym
);

export default router;