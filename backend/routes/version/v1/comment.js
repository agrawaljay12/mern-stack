import express from "express";

import {
  addComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/:blogId",
  protect,
  addComment
);

router.delete(
  "/:commentId",
  protect,
  deleteComment
);

export default router;