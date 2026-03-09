# AInspire Monorepo

Taste-first visual preference learning platform.

## Monorepo Structure
- `apps/web` — creator-facing app (artifact selection, image loop, board sidebar, final-pack trigger)
- `apps/admin` — enterprise/admin surface placeholder
- `services/api-gateway` — public API aggregation and routing
- `services/session-service` — sessions, interactions, boards, event logging
- `services/ranking-service` — baseline retrieval + reranking
- `services/generation-orchestrator` — generation job queue + cost records
- `services/ml-service` — pairwise/taste inference stubs (FastAPI)
- `services/moderation-service` — policy engine stub
- `packages/api-client` — typed API client
- `packages/types` — shared contracts
- `packages/analytics` — telemetry event contracts
- `infra/docker` — local dependencies (Postgres, Redis, MinIO, Qdrant)
- `docs` — PRD/system design/OpenAPI/ERD/ML artifacts

## Quick Start
1. Install dependencies:
   - `pnpm install`
2. Start local infra:
   - `docker compose -f infra/docker/docker-compose.yml up -d`
3. Copy env template:
   - `cp .env.example .env`
4. Run DB migrations:
   - `pnpm db:migrate`
5. Seed corpus:
   - `pnpm db:seed`
6. Run all services/apps:
   - `pnpm dev`

## One-command Bootstrap
- macOS/Linux:
   - `bash scripts/bootstrap.sh`
- Windows PowerShell:
   - `./scripts/bootstrap.ps1`

## CI
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Runs on push/PR to `main`
- Checks:
   - Node workspace install + typecheck + build
   - Python ML service dependency install + syntax smoke test

## Default Ports
- API Gateway: `4000`
- Session Service: `4001`
- Ranking Service: `4002`
- Generation Orchestrator: `4003`
- ML Service (FastAPI, manual run): `8000`
- Moderation Service: `4005`
- Web App: `3000`
- Admin App: `3001`

## Sprint-1 Usable Loop
- `POST /sessions/start`
- `GET /feed`
- `POST /interactions`
- board create + save endpoints
- final-pack generation queue endpoint

## ML Service Run (separate)
From `services/ml-service`:
- `python -m venv .venv`
- `.venv\Scripts\activate` (Windows)
- `pip install -r requirements.txt`
- `uvicorn app.main:app --reload --port 8000`
