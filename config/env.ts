import { env as loadEnv } from "custom-env";
import { z } from "zod";

// Determine application stage
process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTest = process.env.APP_STAGE === "test";

// Load .env files based on environment
if (isDevelopment) {
  loadEnv("local", false); // Loads .env.local without overriding existing variables
  loadEnv(); // Loads .env
} else if (isTest) {
  loadEnv("test"); // Loads .env.test
}

// Production environment variables should be set in the hosting environment and not in .env files

// Define validation schema for environment variables
const envSchema = z.object({
  // Node environments
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  // Custom application stage to load environment-specific variables
  APP_STAGE: z.enum(["dev", "production", "test"]).default("dev"),
});
