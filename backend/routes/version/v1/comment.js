import express from "express";

import {
  addComment,
  deleteComment,
} from "../../../controller/comment_controller.js";

// import { protect } from "../../../middleware/auth.js";
import { optionalAuth } from "../../../middleware/dependency.js";

const router = express.Router();

router.post(
  "/:blogId",
  addComment
);

router.delete(
  "/:commentId",
  optionalAuth,
  deleteComment
);

export default router;