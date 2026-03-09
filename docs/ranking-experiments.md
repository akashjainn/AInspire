# Ranking Experiments Plan

## 1. Experiment Framework
- A/B testing at session level, tenant-aware.
- Randomization unit: `session_id`.
- Guardrail metrics monitored in real time.

## 2. Baseline
- Baseline model: weighted heuristic score:
  - 0.40 session similarity
  - 0.20 saved centroid similarity
  - 0.15 artifact match
  - 0.10 novelty
  - -0.10 disliked similarity
  - -0.05 repetition penalty

## 3. Experiment Roadmap
### Exp-01: Pairwise Model vs Heuristic
- Hypothesis: pairwise reranker improves save rate.
- Primary metric: saves/session.
- Guardrails: latency, dislike rate.

### Exp-02: Attribute-aware Reranking
- Hypothesis: attribute model improves first-20-images satisfaction.
- Primary metric: positive interactions in first 20 impressions.
- Guardrails: diversity entropy.

### Exp-03: Diversity Penalty Tuning
- Hypothesis: tuned diversity improves completion rates without reducing relevance.
- Primary metric: session completion rate.

### Exp-04: Generation Gate Threshold
- Compare:
  - Gate A: saved>=5 & interactions>=20
  - Gate B: saved>=4 & interactions>=16
- Primary metric: final output satisfaction and retention.

## 4. Metrics Definitions
- `save_rate = saves / impressions`
- `completion_rate = sessions_with_final_pack / sessions_started`
- `tffs = time_to_first_save_seconds`
- `reranker_lift = (variant_save_rate - baseline_save_rate) / baseline_save_rate`

## 5. Significance Rules
- Minimum sample size by power analysis per experiment.
- Target confidence 95%, power 80%.
- Stop conditions: significance reached OR max runtime elapsed.

## 6. Experiment Event Logging
- Emit `experiment_assigned`, `feed_served`, `interaction_recorded`, `generation_completed` with `experiment_id`, `variant_id`, and model versions.

## 7. Decision Policy
- Promote variant if:
  - primary metric improves significantly
  - guardrails are within thresholds
  - no severe moderation/cost regressions
