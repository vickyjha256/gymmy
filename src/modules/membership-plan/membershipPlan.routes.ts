import { Router } from "express";
import * as membershipPlanController from "./membershipPlan.controller";
import { authenticate } from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, membershipPlanController.createMembershipPlan);

router.get("/", authenticate, membershipPlanController.getMembershipPlans);

router.put("/:id", authenticate, membershipPlanController.updateMembershipPlan);

router.delete(
  "/:id",
  authenticate,
  membershipPlanController.deleteMembershipPlan
);

export default router;