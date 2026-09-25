import express from "express";
const app = express();
import router from "../routes/index.js"
import cors from "cors";

//middleware 
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-stack-weld-nu.vercel.app",
];


app.use(cors({ 
    origin: allowedOrigins,
    exposedHeaders: ["X-Guest-Token"]
 }));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(morgan("dev"))

// register routes of application
router(app);

export default app;