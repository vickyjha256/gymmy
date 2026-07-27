import { Router } from "express";
import * as memberController from "./member.controller";
import { authenticate } from "../../common/middleware/auth.middleware";


const router = Router();

router.post("/", authenticate, memberController.createMember);

router.get("/", authenticate, memberController.getMembers);

router.get("/:id", authenticate, memberController.getMemberById);


export default router;