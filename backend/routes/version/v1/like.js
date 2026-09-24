import express from "express";
import { toggleLike } from "../../../controller/like_controller.js";
import { optionalAuth } from "../../../middleware/dependency.js";
import { ensureGuestToken } from "../../../middleware/dependency.js";

const router = express.Router();

router.post("/:blogId", optionalAuth, ensureGuestToken, toggleLike);

export default router;
