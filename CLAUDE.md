# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands use **pnpm** as the package manager and **Turbo** for task orchestration.

### Development
```bash
pnpm dev                    # Start all services in parallel
pnpm --filter web dev       # Start only the web app (port 3000)
pnpm --filter admin dev     # Start only the admin app (port 3001)
pnpm --filter api-gateway dev   # Start a specific service
```

### Build, Lint, Typecheck
```bash
pnpm build                  # Build all packages/services
pnpm lint                   # Lint all packages
pnpm typecheck              # Type-check all packages
```

### Database
```bash
pnpm db:migrate             # Run PostgreSQL migrations (session-service)
pnpm db:seed                # Seed corpus data
```

### Local infrastructure (Docker)
```bash
docker compose -f infra/docker/docker-compose.yml up -d   # Start Postgres, Redis, MinIO, Qdrant
```

### ML service (Python — runs separately)
```bash
cd services/ml-service && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Bootstrap (first-time setup)
```bash
bash scripts/bootstrap.sh   # Unix
# or
pwsh scripts/bootstrap.ps1  # PowerShell
```

## Architecture

AInspire is a **taste-first visual preference learning platform** — it learns user design preferences via pairwise visual comparisons and generates personalized style outputs.

### Monorepo layout
- `apps/` — Next.js frontends (web on 3000, admin on 3001)
- `services/` — Node.js/Fastify microservices + Python ML service
- `packages/` — Shared libraries (types, api-client, ui, analytics)
- `infra/` — Docker Compose, Kubernetes, Terraform
- `docs/` — PRD, system design, OpenAPI spec, ERD, ML pipeline docs

### Service topology

```
Browser → apps/web (Next.js)
            ↓
        services/api-gateway (port 4000) — auth, rate-limiting, routing
            ↓
    ┌───────────────────────────────────┐
    │  session-service  (port 4001)     │  PostgreSQL — sessions, interactions, boards
    │  ranking-service  (port 4002)     │  ANN retrieval + pairwise reranking
    │  generation-orchestrator (4003)   │  BullMQ + Redis — image gen job queue
    │  moderation-service (port 4005)   │  Policy engine
    └───────────────────────────────────┘
            ↓
        ml-service (port 8000, FastAPI/Python) — pairwise preference inference
```

### Key data flows
1. **Feed**: request hits api-gateway → ranking-service (vector ANN + rerank) → session-service (log interaction) → update user taste vector
2. **Generation**: api-gateway → generation-orchestrator queues BullMQ job → calls OpenAI Images API → moderation check → persist to S3/R2
3. **Session state**: session-service owns PostgreSQL (sessions, boards, interactions) and computes session vectors

### Shared packages
- `packages/types` — canonical TypeScript types shared across services and apps
- `packages/api-client` — OpenAPI-generated typed client; regenerate from `docs/openapi.yaml`
- `packages/ui` — shared React components
- `packages/analytics` — telemetry event contracts

### TypeScript config
All packages extend `tsconfig.base.json` at the root (ES2022 target, strict mode, NodeNext module resolution).

### Environment
Copy `.env.example` to `.env` — covers Postgres, Redis, S3/MinIO, vector DB URLs, and third-party API keys (OpenAI, Clerk/Auth0, Stripe, PostHog).

### CI
GitHub Actions (`.github/workflows/ci.yml`) runs typecheck + build for Node packages and syntax validation for the Python ML service on every push/PR to `main`.

### Deployment
Vercel handles `apps/web` deployment (configured in `vercel.json`). Services are containerized via `infra/docker/` and deployed via `infra/k8s/`.
