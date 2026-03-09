import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function run() {
  const migrationsDir = path.resolve(process.cwd(), "services/session-service/migrations");
  const files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    console.log(`Applying migration: ${file}`);
    await pool.query(sql);
  }

  console.log("Migrations complete");
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
