import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  updateBlog,
  deleteBlog,
} from "../../../controller/blog_controller.js";
import {verifytoken} from "../../../middleware/auth.js";
import {get_required_roles, optionalAuth, ensureGuestToken} from "../../../middleware/dependency.js";
const adminOnly = get_required_roles(["admin"]);

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
  verifytoken,
  adminOnly,
  getAdminBlogs
);

// URL:http://localhost:8000/api/v1/admin/blog
// Method:POST
// description:fetch all user
router.post(
  "/",
  verifytoken,
  adminOnly,
  createBlog
);

// URL:http://localhost:8000/api/v1/blog/admin/:id
// Method:PUT
// description:fetch all user
router.put(
  "/admin/:id",
  verifytoken,
  adminOnly,
  updateBlog
);

// URL:http://localhost:8000/api/v1/blog/admin/delete/:id
// Method:DELETE
// description:DELETE BLOG
router.delete(
  "/delete/:id",
  verifytoken,
  adminOnly,
  deleteBlog
);

// URL:http://localhost:8000/api/v1/blog
// Method:get
// description:fetch all user
// Public / optional authentication
router.get("/:slug", optionalAuth, ensureGuestToken, getBlogBySlug);

export default router;