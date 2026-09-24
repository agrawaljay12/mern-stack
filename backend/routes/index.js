import userRouter from "./version/v1/user.js";
import blogRoutes from "./version/v1/blog_routes.js";
import commentRoutes from "./version/v1/comment.js";
import likeRoutes from "./version/v1/like.js";

const registerroutes = (app) => {
  app.use("/api/v1/auth", userRouter);
  app.use("/api/v1/blogs", blogRoutes);
  app.use("/api/v1/like", likeRoutes);
  app.use("/api/v1/comments", commentRoutes);
};

export default registerroutes;
