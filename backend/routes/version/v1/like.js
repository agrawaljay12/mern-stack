import express from "express";

import {
  toggleLike,
} from "../../../controller/like_controller.js";

import guestIdentity from "../../../middleware/guest.js";

const router = express.Router();

router.post(
  "/:blogId",
  guestIdentity,
  toggleLike
);

export default router;