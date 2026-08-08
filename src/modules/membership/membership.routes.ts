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



export default router;