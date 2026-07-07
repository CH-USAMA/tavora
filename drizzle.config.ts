import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env.local for local development migrations
dotenv.config({ path: ".env.local" });

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is missing");
}

export default defineConfig({
  schema: "./src/shared/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
});
