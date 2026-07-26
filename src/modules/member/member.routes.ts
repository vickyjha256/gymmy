import { Router } from "express";
import * as memberController from "./member.controller";
import { authenticate } from "../../common/middleware/auth.middleware";


const router = Router();

router.post("/", authenticate, memberController.createMember);

export default router;