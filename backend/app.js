import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

import authRouter from "./routes/authRoutes.js";
app.use("/api/v1/auth/", authRouter);

export { app };
