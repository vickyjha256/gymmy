import { Router } from "express";
import * as membershipController from "./membership.controller";
import { authenticate, authorize } from "../../common/middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.OWNER),
  membershipController.createMembership
);


router.get(
  "/member/:memberId",
  authenticate,
  authorize(UserRole.OWNER),
  membershipController.getMembershipHistory
);

router.post(
  "/renew/:memberId",
  authenticate,
  authorize(UserRole.OWNER),
  membershipController.renewMembership
);

router.get(
  "/upcoming-expiring",
  authenticate,
  authorize(UserRole.OWNER),
  membershipController.getUpcomingAndExpiringMemberships
);

router.patch(
  "/:membershipId/cancel",
  authenticate,
  authorize(UserRole.OWNER),
  membershipController.cancelMembership
);

router.get(
  "/:membershipId",
  authenticate,
  authorize(UserRole.OWNER),
  membershipController.getMembershipById
);

export default router;