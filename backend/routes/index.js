// register the all routes  of application 
import userrouter from "./version/v1/user.js";
import blogRoutes from "./version/v1/blog_routes.js";
import likeRoutes from "./version/v1/comment.js";
import commentRoutes from "./version/v1/like.js";

const registerroutes = (app) =>{

    // http://localhost:8000/api/v1/auth/
    app.use("/api/v1/auth",userrouter)  

    // http://localhost:8000/api/v1/blog/
    app.use("/api/v1/blogs", blogRoutes);

    // http://localhost:8000/api/v1/like/
    app.use("/api/v1/like", likeRoutes);

    // http://localhost:8000/api/v1/comment/
    app.use("/api/v1/comments", commentRoutes);
} 

export default registerroutes;
