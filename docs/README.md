# AInspire Enterprise Blueprint Index

This folder contains an executable planning package for building the visual preference learning platform.

## Document Map
1. `PRD.md` — product requirements and release criteria
2. `system-design.md` — architecture and service boundaries
3. `openapi.yaml` — backend API contract
4. `erd.mmd` — data model diagram (Mermaid)
5. `data-collection-schema.md` — telemetry + feature-store event schema
6. `ml-pipeline.md` — ML training/serving lifecycle
7. `ranking-experiments.md` — A/B and ranking optimization plan
8. `execution-plan-12-weeks.md` — sprint-ready delivery plan

## Required External APIs / Services
- Image generation/editing: OpenAI Images API
- Optional alternative generation: Stable Diffusion API providers, Replicate-hosted models
- Moderation: OpenAI moderation + internal policy engine
- Auth/enterprise identity: Clerk/Auth0/WorkOS
- Billing: Stripe
- Analytics: PostHog/Amplitude
- Vector DB: Pinecone/Weaviate/Cloudflare Vectorize
- Storage: Cloudflare R2 or AWS S3

## Recommended Build Order
1. Lock contracts (`openapi.yaml`, `data-collection-schema.md`)
2. Implement session + feed + interaction endpoints
3. Add vector retrieval and baseline reranker
4. Integrate generation + moderation
5. Ship style pack output
6. Start ranking experiments and iterate

## Immediate Engineering Kickoff (Week 1)
- Approve artifact taxonomy and attribute schema.
- Create backend repos/services (`api-gateway`, `session-service`, `ranking-service`, `generation-orchestrator`).
- Generate server/client stubs from `openapi.yaml`.
- Stand up Postgres/Redis/object storage + event pipeline.
- Seed initial image corpus with embeddings and metadata.
