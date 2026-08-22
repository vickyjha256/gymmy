import { Router } from "express";
import * as memberController from "./member.controller";
import { authenticate } from "../../common/middleware/auth.middleware";


const router = Router();

router.post("/", authenticate, memberController.createMember);

router.get("/", authenticate, memberController.getMembers);

// Note:- Kept "/search" endpoint before "/:id". Because, else Express treats "search" as id.
router.get("/search", authenticate, memberController.searchMembers);

router.get("/:id", authenticate, memberController.getMemberById);

router.put("/:id", authenticate, memberController.updateMember);

router.delete("/:id", authenticate, memberController.deleteMember);



export default router;