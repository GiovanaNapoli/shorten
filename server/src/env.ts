import { config } from "dotenv";

if (process.env.ENVIRONMENT === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const requiredEnvVars = {
  MONGO_URI: process.env.MONGO_URI,
  ENVIRONMENT: process.env.ENVIRONMENT,
  SHUFFLE_SECRET: process.env.SHUFFLE_SECRET,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  MONGO_URI: process.env.MONGO_URI!,
  ENVIRONMENT: process.env.ENVIRONMENT! as "development" | "test" | "production",
  SHUFFLE_SECRET: parseInt(process.env.SHUFFLE_SECRET!, 16),
  BASE_URL: process.env.BASE_URL || "http://localhost:3333",
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3333,
};
