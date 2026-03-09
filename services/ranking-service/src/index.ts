import Fastify from "fastify";
import cors from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get("/health", async () => ({ status: "ok", service: "ranking-service" }));

app.get("/internal/feed", async (request: any, reply: any) => {
  const query = request.query as { session_id?: string; limit?: string };
  if (!query.session_id) {
    return reply.code(400).send({ error: "session_id is required" });
  }

  const limit = Number(query.limit ?? 10);

  const session = await pool.query(`SELECT id, artifact_type FROM sessions WHERE id = $1`, [query.session_id]);
  if (session.rowCount === 0) {
    return reply.code(404).send({ error: "Session not found" });
  }

  const artifactType = session.rows[0].artifact_type as string;

  const imagesResult = await pool.query(
    `SELECT i.id,
            i.storage_url,
            i.metadata_json,
            COALESCE(SUM(CASE WHEN inter.action_type = 'save' THEN 1 WHEN inter.action_type = 'like' THEN 0.5 WHEN inter.action_type = 'dislike' THEN -1 ELSE 0 END), 0) AS feedback_score
     FROM images i
     LEFT JOIN interactions inter ON inter.image_id = i.id
     WHERE (i.artifact_type = $1 OR i.artifact_type = 'any')
     GROUP BY i.id
     ORDER BY feedback_score DESC, RANDOM()
     LIMIT $2`,
    [artifactType, limit]
  );

  const items = imagesResult.rows.map((row: any) => ({
    image_id: row.id,
    url: row.storage_url,
    score: Number(row.feedback_score),
    explanation: {
      artifact_match: true,
      baseline_score: Number(row.feedback_score)
    },
    attributes: row.metadata_json
  }));

  await pool.query(
    `INSERT INTO event_log (id, tenant_id, session_id, event_name, payload, created_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, NOW())`,
    [randomUUID(), "default-tenant", query.session_id, "feed_loaded", JSON.stringify({ limit, returned: items.length })]
  );

  for (const item of items) {
    await pool.query(
      `INSERT INTO event_log (id, tenant_id, session_id, event_name, payload, created_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, NOW())`,
      [randomUUID(), "default-tenant", query.session_id, "image_impression", JSON.stringify({ image_id: item.image_id })]
    );
  }

  return { session_id: query.session_id, items };
});

app.post("/internal/rank/pairwise", async (request: any, reply: any) => {
  const body = request.body as {
    session_id: string;
    image_a_id: string;
    image_b_id: string;
  };

  const winner = Math.random() >= 0.5 ? body.image_a_id : body.image_b_id;

  await pool.query(
    `INSERT INTO event_log (id, tenant_id, session_id, event_name, payload, created_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, NOW())`,
    [randomUUID(), "default-tenant", body.session_id, "pairwise_choice_made", JSON.stringify({ ...body, winner_image_id: winner })]
  );

  return reply.send({ winner_image_id: winner, model_version: "pairwise_baseline_v0" });
});

const port = Number(process.env.RANKING_SERVICE_PORT ?? 4002);
app.listen({ port, host: "0.0.0.0" }).catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
