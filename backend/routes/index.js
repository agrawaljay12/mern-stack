import userrouter from "./version/v1/user.js";

import blogRoutes from "./version/v1/blog_routes.js";

import likeRoutes from "./version/v1/like.js";

import commentRoutes from "./version/v1/comment.js";

const registerroutes = (
  app
) => {
  /*
   * USERS
   */
  app.use(
    "/api/v1/auth",
    userrouter
  );

  /*
   * BLOGS
   */
  app.use(
    "/api/v1/blogs",
    blogRoutes
  );

  /*
   * LIKES
   */
  app.use(
    "/api/v1/like",
    likeRoutes
  );

  /*
   * COMMENTS
   */
  app.use(
    "/api/v1/comments",
    commentRoutes
  );
};

export default registerroutes;