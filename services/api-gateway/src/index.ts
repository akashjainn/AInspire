import Fastify from "fastify";
import cors from "@fastify/cors";
import { request as httpRequest } from "undici";
import "dotenv/config";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const sessionService = process.env.SESSION_SERVICE_URL ?? "http://localhost:4001";
const rankingService = process.env.RANKING_SERVICE_URL ?? "http://localhost:4002";
const generationService = process.env.GENERATION_SERVICE_URL ?? "http://localhost:4003";

app.addHook("onRequest", async (req: any) => {
  req.log.info({ method: req.method, url: req.url }, "incoming request");
});

app.get("/health", async () => ({ status: "ok", service: "api-gateway" }));

app.post("/sessions/start", async (req: any, reply: any) => {
  const upstream = await httpRequest(`${sessionService}/internal/sessions/start`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

app.get("/feed", async (req: any, reply: any) => {
  const query = req.query as { session_id?: string; limit?: string };
  const qs = new URLSearchParams();
  if (query.session_id) qs.set("session_id", query.session_id);
  if (query.limit) qs.set("limit", query.limit);

  const upstream = await httpRequest(`${rankingService}/internal/feed?${qs.toString()}`, {
    method: "GET"
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

app.post("/interactions", async (req: any, reply: any) => {
  const upstream = await httpRequest(`${sessionService}/internal/interactions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

app.post("/rank/pairwise", async (req: any, reply: any) => {
  const upstream = await httpRequest(`${rankingService}/internal/rank/pairwise`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

app.post("/boards", async (req: any, reply: any) => {
  const upstream = await httpRequest(`${sessionService}/internal/boards`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

app.post("/boards/:boardId/items", async (req: any, reply: any) => {
  const params = req.params as { boardId: string };
  const upstream = await httpRequest(`${sessionService}/internal/boards/${params.boardId}/items`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

app.post("/generate/final-pack", async (req: any, reply: any) => {
  const upstream = await httpRequest(`${generationService}/internal/generate/final-pack`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body)
  });
  const body = await upstream.body.json();
  reply.code(upstream.statusCode).send(body);
});

const port = Number(process.env.API_GATEWAY_PORT ?? 4000);
app.listen({ port, host: "0.0.0.0" }).catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
