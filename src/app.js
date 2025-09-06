import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import leadRouter from "./routes/lead.routes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";
import apiKeyAuth from "./middleware/apiKeyAuth.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Basic rate limit for safety
app.use("/api", rateLimiter);

// Optional lightweight API key guard (can be removed if not needed)
app.use("/api", apiKeyAuth);

// Routes
app.use("/api/leads", leadRouter);

// Health
app.get("/health", (req, res) =>
  res.status(200).json({ status: true, message: "Lead API working" })
);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
