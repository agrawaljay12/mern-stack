import express from "express";
import cors from "cors";
import router from "../routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://mern-stack-weld-nu.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Guest-Token",
    ],

    exposedHeaders: ["X-Guest-Token"],

    credentials: true,

    optionsSuccessStatus: 204,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
router(app);

export default app;