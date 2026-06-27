import express from "express";
import helmet from "helmet";
import cors from "cors";
import logger from "./config/logger.ts";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.ts";

const app = express();

app.use(helmet());
// If CORS_ORIGIN is set in your environment, allow that origin otherwise allow *, meaning any origin
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
  }),
);

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim(), { type: "http" }),
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
