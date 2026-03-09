# System Design

## 1. High-Level Architecture

```text
Web App (Next.js/TS)
        |
        v
API Gateway (Node.js)
        |
  ------------------------------
  |             |             |
Session      Ranking      Generation
Service      Service      Orchestrator
(Node)       (Python)        (Node)
  |             |             |
Postgres      Vector DB     OpenAI Images API
Redis         (Pinecone)    Moderation APIs
  \             |            /
   ------------ Assets -------------
            (S3 / Cloudflare R2)
                    |
                Analytics
            (PostHog/Amplitude)
```

## 2. Service Responsibilities

### API Gateway (Node)
- AuthN/AuthZ and tenant context resolution
- Request validation and rate limiting
- Routing to Session, Ranking, Generation services
- Correlation IDs for observability

### Session Service (Node)
- Start sessions and persist session state
- Aggregate user interactions
- Compute and store lightweight session vectors
- Manage boards and board items

### Ranking Service (Python + FastAPI)
- Candidate retrieval from vector DB
- Pairwise/attribute-aware reranking
- Diversity and fatigue suppression
- Return ranked feed explanations

### Generation Orchestrator (Node)
- Compile style payload from interactions and saved centroid
- Call image generation API
- Run moderation checks
- Store assets and generation metadata

## 3. Data Flow
1. User starts session with artifact + vibe chips.
2. Session Service writes `sessions` row and seed vector.
3. Feed request triggers Ranking Service:
   - fetch candidates by ANN + filters
   - rerank by score function/model
   - return top 10
4. User interactions are logged to `interactions` and update vectors.
5. At generation gate, Generation Orchestrator builds style payload and calls image API.
6. Moderation result stored; safe assets persisted to object storage.
7. Style pack built and returned with references.

## 4. Availability & Scalability
- Stateless app services behind autoscaling.
- Redis for hot session state and queueing.
- Async workers for embedding and generation jobs.
- CDN for image delivery.
- Backpressure via queue depth limits and generation quotas.

## 5. Security
- JWT-based auth with tenant claims.
- Encryption in transit (TLS) and at rest.
- Signed URLs for private image access.
- Role-based access (`admin`, `editor`, `viewer`).
- Audit logs for save/export/generation/moderation overrides.

## 6. Multi-Tenancy
- `tenant_id` on all primary business tables.
- Tenant-scoped queries and service guards.
- Optional physically separate storage buckets for enterprise plans.

## 7. Cost Controls
- Per-tenant generation quotas.
- Dynamic image resolution policy by subscription tier.
- Caching feed candidates per session window.
- Track `cost_usd` per generation job.

## 8. SLO Targets (initial)
- Feed API P95 < 800ms
- Interaction write API P95 < 250ms
- Final generation pack completion P95 < 20s
- 99.9% monthly API availability
