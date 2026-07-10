import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:geArYJSlzVGXmDRAdantjXmncwAgowHN@hayabusa.proxy.rlwy.net:58845/railway";

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// Completely sanitized SQL string with pure ASCII characters
const sql = `
ALTER TABLE cart DROP CONSTRAINT IF EXISTS unique_user_product;

ALTER TABLE cart ADD CONSTRAINT unique_user_product_size UNIQUE (user_id, product_id, selected_size);
`;

async function run() {
  try {
    await client.connect();
    console.log("Connected to Railway Postgres successfully!");
    await client.query(sql);
    console.log("🚀 All database updates applied successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

run();