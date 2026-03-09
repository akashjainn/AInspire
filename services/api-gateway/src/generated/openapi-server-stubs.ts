import type { FastifyInstance } from "fastify";

export async function registerOpenApiStubs(app: FastifyInstance) {
  app.post("/sessions/start", async () => ({ status: "implemented" }));
  app.get("/feed", async () => ({ status: "implemented" }));
  app.post("/interactions", async () => ({ status: "implemented" }));
  app.post("/rank/pairwise", async () => ({ status: "implemented" }));
  app.post("/generate/final-pack", async () => ({ status: "implemented" }));
  app.get("/style-pack/:session_id", async () => ({ status: "implemented" }));
}
