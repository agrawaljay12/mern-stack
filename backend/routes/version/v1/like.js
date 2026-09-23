import express from "express";

import { toggleLike } from "../controllers/like.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/:blogId",
  protect,
  toggleLike
);

export default router;