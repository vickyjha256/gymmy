import { Router } from "express";
import * as membershipController from "./membership.controller";
import { authenticate } from "../../common/middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  membershipController.createMembership
);


router.get(
  "/member/:memberId",
  authenticate,
  membershipController.getMembershipHistory
);

router.post(
  "/renew/:memberId",
  authenticate,
  membershipController.renewMembership
);

router.get(
  "/upcoming-expiring",
  authenticate,
  membershipController.getUpcomingAndExpiringMemberships
);


export default router;