import { defineConfig } from 'drizzle-kit';
import { config } from "dotenv";

    // Load environment variables from .env.local (or .env if path is not specified)
config({ path: "../../.env" }); 
console.log("Database URL:", process.env.DATABASE_URL);
export default {
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;
