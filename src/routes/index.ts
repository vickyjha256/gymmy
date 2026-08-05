import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import memberRoutes from "../modules/member/member.routes";
import membershipPlanRoutes from "../modules/membership-plan/membershipPlan.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
router.use("/membership-plans", membershipPlanRoutes);

export default router;