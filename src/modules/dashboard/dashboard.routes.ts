import { Router } from "express";
import { authenticate, authorize } from "../../common/middleware/auth.middleware";
import * as dashboardController from "./dashboard.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorize(UserRole.OWNER),
  dashboardController.getDashboardStats
);

router.get(
  "/revenue",
  authenticate,
  authorize(UserRole.OWNER),
  dashboardController.getRevenueStats
);


export default router;