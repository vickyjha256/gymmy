import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.get(
  "/stats",
  authenticate,
  dashboardController.getDashboardStats
);

router.get(
  "/revenue",
  authenticate,
  dashboardController.getRevenueStats
);


export default router;