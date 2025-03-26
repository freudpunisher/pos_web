import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema"; // Adjust the path as necessary

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is set in your .env file
});

// Pass the schema as the second argument to drizzle
export const db = drizzle(pool, { schema });
