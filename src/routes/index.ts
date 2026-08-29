import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import memberRoutes from "../modules/member/member.routes";
import membershipPlanRoutes from "../modules/membership-plan/membershipPlan.routes";
import membershipRoutes from "../modules/membership/membership.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import userRoutes from "../modules/user/user.routes";
import gymRoutes from "../modules/gym/gym.routes";



const router = Router();

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
router.use("/membership-plans", membershipPlanRoutes);
router.use("/memberships", membershipRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/users", userRoutes);

router.use("/gym", gymRoutes);


export default router;