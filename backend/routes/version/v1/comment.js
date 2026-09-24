import express from "express";

import {
  addComment,
  deleteComment,
} from "../../../controller/comment_controller.js";

import guestIdentity from "../../../middleware/guest.js";
import { optionalAuth } from "../../../middleware/dependency.js";

const router = express.Router();

router.post(
  "/:blogId",
  guestIdentity,
  addComment
);

router.delete(
  "/:commentId",
  guestIdentity,
  optionalAuth,
  deleteComment
);

export default router;