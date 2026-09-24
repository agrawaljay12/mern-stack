import express from "express";

import { toggleLike } from "../../../controller/like_controller.js";
// import { protect } from "../../../middleware/dependency.js";

const router = express.Router();

router.post(
  "/:blogId",
  toggleLike
);

export default router;