import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
// If CORS_ORIGIN is set in your environment, allow that origin otherwise allow *, meaning any origin
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
