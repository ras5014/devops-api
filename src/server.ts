import app from "./app.ts";
const PORT = process.env.PORT || 3000;
import logger from "./config/logger.ts";

app
  .listen(PORT, () => {
    logger.info("Server is running on http://localhost:" + PORT);
  })
  .on("error", (err) => {
    logger.error("Failed to start server:", err);
  });
