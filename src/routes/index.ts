import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import memberRoutes from "../modules/member/member.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);


export default router;