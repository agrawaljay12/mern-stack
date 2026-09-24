import express from "express";
import { addComment, deleteComment, getAllComments } from "../../../controller/comment_controller.js";
import { optionalAuth, verifytoken } from "../../../middleware/auth.js";
import { ensureGuestToken, get_required_roles } from "../../../middleware/dependency.js";

const router = express.Router();

router.get("/admin/all", verifytoken, get_required_roles(["admin"]), getAllComments);
router.post("/:blogId", optionalAuth, ensureGuestToken, addComment);
router.delete("/:commentId", optionalAuth, ensureGuestToken, deleteComment);

export default router;
