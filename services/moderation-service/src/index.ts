import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get("/health", async () => ({ status: "ok", service: "moderation-service" }));

app.post("/internal/moderation/check", async (request: any) => {
  const body = request.body as { text?: string; image_url?: string };

  const blockedTerms = ["violence", "hate", "nsfw"];
  const content = `${body.text ?? ""} ${body.image_url ?? ""}`.toLowerCase();
  const matched = blockedTerms.filter((term) => content.includes(term));

  return {
    status: matched.length === 0 ? "pass" : "review",
    reasons: matched,
    policy_version: "v0"
  };
});

const port = Number(process.env.MODERATION_SERVICE_PORT ?? 4005);
app.listen({ port, host: "0.0.0.0" }).catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
