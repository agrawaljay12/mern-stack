import express from "express";

import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  updateBlog,
  deleteBlog,
} from "../../../controller/blog_controller.js";

import {
  verifytoken,
} from "../../../middleware/auth.js";

import {
  optionalAuth,
  get_required_roles,
} from "../../../middleware/dependency.js";

import guestIdentity from "../../../middleware/guest.js";

const router =
  express.Router();

const adminOnly =
  get_required_roles([
    "admin",
  ]);

/* =========================================================
   PUBLIC
========================================================= */

router.get(
  "/",
  guestIdentity,
  getBlogs
);

router.get(
  "/:slug",
  guestIdentity,
  optionalAuth,
  getBlogBySlug
);

/* =========================================================
   ADMIN
========================================================= */

router.get(
  "/admin/all",
  verifytoken,
  adminOnly,
  getAdminBlogs
);

router.post(
  "/",
  verifytoken,
  adminOnly,
  createBlog
);

router.put(
  "/admin/:id",
  verifytoken,
  adminOnly,
  updateBlog
);

router.delete(
  "/delete/:id",
  verifytoken,
  adminOnly,
  deleteBlog
);

export default router;