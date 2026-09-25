import express from "express";
import cors from "cors";
import router from "../routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-stack-weld-nu.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    exposedHeaders: ["X-Guest-Token"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

export default app;