import Fastify from "fastify";
import cors from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import "dotenv/config";
import { generationQueue } from "./queue.js";

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get("/health", async () => ({ status: "ok", service: "generation-orchestrator" }));

app.post("/internal/generate/final-pack", async (request: any, reply: any) => {
  const body = request.body as { session_id: string; mode?: string };
  const jobId = randomUUID();

  await pool.query(
    `INSERT INTO generation_jobs (id, tenant_id, session_id, model_provider, prompt_payload, seed, status, cost_usd, moderation_status, created_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, NOW())`,
    [jobId, "default-tenant", body.session_id, "openai", JSON.stringify({ mode: body.mode ?? "final_pack" }), 42, "queued", 0, "pending"]
  );

  await generationQueue.add("final-pack", { jobId, sessionId: body.session_id }, { jobId });

  await pool.query(
    `INSERT INTO provider_usage_costs (id, tenant_id, provider_name, operation_name, units, cost_usd, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())`,
    [randomUUID(), "default-tenant", "openai", "generation_requested", 1, 0, JSON.stringify({ session_id: body.session_id })]
  );

  return reply.code(202).send({ job_id: jobId, status: "queued" });
});

const port = Number(process.env.GENERATION_SERVICE_PORT ?? 4003);
app.listen({ port, host: "0.0.0.0" }).catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
