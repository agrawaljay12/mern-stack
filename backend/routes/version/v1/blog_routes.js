import express from "express";

import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// URL:http://localhost:8000/api/v1/blog
// Method:get
// description:fetch blog
// Public
router.get("/", getBlogs);


// URL:http://localhost:8000/api/v1/blog/admin/all
// Method:get
// description:fetch all user
// Admin
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminBlogs
);

// URL:http://localhost:8000/api/v1/admin/blog
// Method:POST
// description:fetch all user
router.post(
  "/",
  protect,
  adminOnly,
  createBlog
);

// URL:http://localhost:8000/api/v1/blog/admin/:id
// Method:PUT
// description:fetch all user
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateBlog
);

// URL:http://localhost:8000/api/v1/blog/admin/delete/:id
// Method:DELETE
// description:DELETE BLOG
router.delete(
  "/delete/:id",
  protect,
  adminOnly,
  deleteBlog
);

// URL:http://localhost:8000/api/v1/blog
// Method:get
// description:fetch all user
// Public / optional authentication
router.get("/:slug", getBlogBySlug);

export default router;