import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Export the pool instance as a NAMED export
export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: false,
});

// Test connection instantly when server mounts
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Database connection failed:", err.stack);
  }
  console.log("PostgreSQL Connected Successfully.");
  release();
});