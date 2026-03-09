# ML Training & Serving Pipeline

## 1. Objectives
- Learn user taste from sparse interactions.
- Improve feed quality through pairwise and attribute-aware ranking.
- Convert style signals into controlled generation payloads.

## 2. Pipeline Overview
1. **Ingest** events (`interactions`, `pairwise_vote`, `save`, `dislike`) from stream.
2. **Validate** and deduplicate into bronze/silver/gold datasets.
3. **Feature build** for user/session/image/attribute features.
4. **Train** ranking and attribute models.
5. **Evaluate** against offline metrics.
6. **Deploy** via model registry and canary release.
7. **Monitor** quality, drift, and business lift.

## 3. Models
### A. Embedding Similarity Layer
- Input: image assets + metadata
- Output: image embeddings to vector DB
- Update cadence: daily batch + nearline for new assets

### B. Pairwise Ranking Model
- Input features:
  - user/session vector
  - image A/B embeddings
  - artifact type
  - recent feedback summary
- Label: winner from `this-or-that`
- Objective: maximize pairwise preference prediction

### C. Attribute Preference Model
- Predicts affinity for:
  - palette, composition, linework, texture, realism, density, typography
- Output used in reranker and style pack extraction

### D. Style Clustering
- Algorithm: HDBSCAN on embedding + attribute space
- Outputs stable style cluster IDs and cluster descriptors

## 4. Feature Definitions
- `session_save_rate`
- `session_negative_rate`
- `image_popularity_by_artifact`
- `recency_weighted_similarity`
- `attribute_alignment_score`
- `fatigue_penalty` (exposure repeat factor)

## 5. Serving Architecture
- Online feature fetch from Redis/feature store cache
- Reranking endpoint in Python service (`/rank/pairwise`)
- Model version in every feed response for attribution

## 6. MLOps Requirements
- Model registry (MLflow/Weights & Biases + artifact store)
- Dataset versioning
- Automated training pipeline (daily/weekly)
- Canary rollout with traffic split (5% → 25% → 50% → 100%)

## 7. Monitoring
- Technical: latency, error rate, drift (embedding and action distribution)
- Product: save rate, completion rate, reranker lift, user return
- Safety: moderation rejection trends by artifact type

## 8. Rollback Strategy
- Keep last 2 model versions hot-deployable
- If KPI drop > threshold (e.g., save rate -10%), auto rollback
