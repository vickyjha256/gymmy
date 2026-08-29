import { Router } from "express";
import * as memberController from "./member.controller";
import { authenticate, authorize } from "../../common/middleware/auth.middleware";
import { UserRole } from "@prisma/client";


const router = Router();

router.post("/", authenticate, authorize(UserRole.OWNER), memberController.createMember);

router.get("/", authenticate, authorize(UserRole.OWNER), memberController.getMembers);

// Note:- Kept "/search" endpoint before "/:id". Because, else Express treats "search" as id.
router.get("/search", authenticate, authorize(UserRole.OWNER), memberController.searchMembers);

router.get("/:id", authenticate, authorize(UserRole.OWNER), memberController.getMemberById);

router.put("/:id", authenticate, authorize(UserRole.OWNER), memberController.updateMember);

router.delete("/:id", authenticate, authorize(UserRole.OWNER), memberController.deleteMember);



export default router;