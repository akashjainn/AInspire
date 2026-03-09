import Fastify from "fastify";
import cors from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get("/health", async () => ({ status: "ok", service: "session-service" }));

app.post("/internal/sessions/start", async (request: any, reply: any) => {
  const body = request.body as {
    user_id?: string;
    artifact_type: string;
    vibe_chips?: string[];
    constraints?: Record<string, unknown>;
  };

  const sessionId = randomUUID();
  const userId = body.user_id ?? randomUUID();

  await pool.query(
    `INSERT INTO sessions (id, tenant_id, user_id, artifact_type, vibe_chips, constraints, session_vector, started_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, NOW())`,
    [sessionId, "default-tenant", userId, body.artifact_type, JSON.stringify(body.vibe_chips ?? []), JSON.stringify(body.constraints ?? {}), JSON.stringify([])]
  );

  await pool.query(
    `INSERT INTO event_log (id, tenant_id, session_id, event_name, payload, created_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, NOW())`,
    [randomUUID(), "default-tenant", sessionId, "session_started", JSON.stringify(body)]
  );

  return reply.code(201).send({
    id: sessionId,
    user_id: userId,
    artifact_type: body.artifact_type,
    vibe_chips: body.vibe_chips ?? [],
    started_at: new Date().toISOString()
  });
});

app.post("/internal/interactions", async (request: any, reply: any) => {
  const body = request.body as {
    session_id: string;
    image_id: string;
    action_type: string;
    value?: number;
    attribute_feedback?: Array<{ attribute: string; sentiment: string; value: number }>;
    comparison_image_id?: string;
  };

  await pool.query(
    `INSERT INTO interactions (id, tenant_id, session_id, image_id, action_type, value, attribute_feedback, comparison_image_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, NOW())`,
    [randomUUID(), "default-tenant", body.session_id, body.image_id, body.action_type, body.value ?? 1, JSON.stringify(body.attribute_feedback ?? []), body.comparison_image_id ?? null]
  );

  await pool.query(
    `INSERT INTO event_log (id, tenant_id, session_id, event_name, payload, created_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, NOW())`,
    [randomUUID(), "default-tenant", body.session_id, mapInteractionEvent(body.action_type), JSON.stringify(body)]
  );

  if (body.attribute_feedback && body.attribute_feedback.length > 0) {
    await pool.query(
      `INSERT INTO event_log (id, tenant_id, session_id, event_name, payload, created_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, NOW())`,
      [randomUUID(), "default-tenant", body.session_id, "attribute_feedback_submitted", JSON.stringify(body.attribute_feedback)]
    );
  }

  return reply.code(202).send({ status: "accepted" });
});

app.post("/internal/boards", async (request: any, reply: any) => {
  const body = request.body as { user_id: string; title: string };
  const id = randomUUID();
  await pool.query(
    `INSERT INTO boards (id, tenant_id, user_id, title, created_at) VALUES ($1, $2, $3, $4, NOW())`,
    [id, "default-tenant", body.user_id, body.title]
  );
  return reply.code(201).send({ id, title: body.title });
});

app.post("/internal/boards/:boardId/items", async (request: any, reply: any) => {
  const params = request.params as { boardId: string };
  const body = request.body as { image_id: string; saved_reason?: string };

  await pool.query(
    `INSERT INTO board_items (id, board_id, image_id, saved_reason, order_index, created_at)
     VALUES ($1, $2, $3, $4, COALESCE((SELECT MAX(order_index) + 1 FROM board_items WHERE board_id = $2), 0), NOW())`,
    [randomUUID(), params.boardId, body.image_id, body.saved_reason ?? null]
  );

  return reply.code(201).send({ status: "saved" });
});

function mapInteractionEvent(actionType: string) {
  switch (actionType) {
    case "like":
      return "image_liked";
    case "dislike":
      return "image_disliked";
    case "save":
      return "image_saved";
    case "this_or_that":
      return "pairwise_choice_made";
    default:
      return "interaction_recorded";
  }
}

const port = Number(process.env.SESSION_SERVICE_PORT ?? 4001);
app.listen({ port, host: "0.0.0.0" }).catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
