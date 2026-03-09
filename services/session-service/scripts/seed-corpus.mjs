import process from "node:process";
import path from "node:path";
import { randomUUID } from "node:crypto";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

const artifacts = [
  "poster",
  "tattoo",
  "logo",
  "painting",
  "storyboard",
  "ui_design",
  "album_cover",
  "game_concept_art",
  "illustration",
  "brand_identity"
];

async function run() {
  for (let i = 0; i < 60; i++) {
    const artifact = artifacts[i % artifacts.length];
    const imageId = randomUUID();
    const attrId = randomUUID();

    await pool.query(
      `INSERT INTO images (id, tenant_id, source_type, storage_url, embedding_id, artifact_type, metadata_json, license_type, provenance, moderation_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        imageId,
        "default-tenant",
        "curated",
        `https://picsum.photos/seed/ainspire-${i}/768/1024`,
        `emb_${i}`,
        artifact,
        JSON.stringify({ palette: i % 2 === 0 ? "warm neon" : "muted earth", density: i % 3 === 0 ? "high" : "medium" }),
        "licensed",
        "seed-corpus-v1",
        "pass"
      ]
    );

    await pool.query(
      `INSERT INTO image_attributes (id, image_id, palette, composition_type, linework, texture, realism_score, density_score, typography_present, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)`,
      [
        attrId,
        imageId,
        i % 2 === 0 ? "warm neon" : "cool grayscale",
        i % 3 === 0 ? "centered" : "rule_of_thirds",
        i % 2 === 0 ? "thick" : "thin",
        i % 3 === 0 ? "grain" : "clean",
        (i % 10) / 10,
        ((i + 3) % 10) / 10,
        i % 4 === 0,
        JSON.stringify([artifact, i % 2 === 0 ? "cinematic" : "editorial"])
      ]
    );
  }

  console.log("Seed corpus created");
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
