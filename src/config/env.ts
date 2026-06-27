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

  // Server configuration
  // In Zod, z.coerce means “try to convert the input to this type before validating"
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("localhost"),

  // Database configuration
  DATABASE_URL: z.string().startsWith("postgresql://"),

  // JWT & Authentication
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),

  JWT_EXPIRATION: z.string().default("1h"),

  // Security
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

// Type inference from schema
export type Env = z.infer<typeof envSchema>;

// Parse & validate environment variables
const parseEnv = (): Env => {
  try {
    const parsed = envSchema.parse(process.env);
    console.table(parsed); // Later change to logger.info
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );
      console.error("Environment variable validation error:", errorMessage);
      process.exit(1);
    }

    throw error; // Re-throw if it's not a ZodError
  }
};

const env: Env = parseEnv();

// Helper functions for environment checks
export const isProd = () => env.NODE_ENV === "production";
export const isDev = () => env.NODE_ENV === "development";
export const isTestEnv = () => env.NODE_ENV === "test";

// Export the validated environment
export { env };
export default env;
