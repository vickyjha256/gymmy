import { Router } from "express";
import * as membershipPlanController from "./membershipPlan.controller";
import { authenticate, authorize } from "../../common/middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", authenticate, authorize(UserRole.OWNER), membershipPlanController.createMembershipPlan);

router.get("/", authenticate, authorize(UserRole.OWNER), membershipPlanController.getMembershipPlans);

router.put("/:id", authenticate, authorize(UserRole.OWNER), membershipPlanController.updateMembershipPlan);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.OWNER),
  membershipPlanController.deleteMembershipPlan
);

router.patch(
  "/:id/activate",
  authenticate,
  authorize(UserRole.OWNER),
  membershipPlanController.activateMembershipPlan
);

export default router;