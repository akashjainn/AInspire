# Data Collection Schema

## 1. Event Principles
- Every client event must include: `event_id`, `tenant_id`, `user_id`, `session_id`, `timestamp`, `app_version`, `platform`.
- Use idempotency key to prevent duplicate interaction ingestion.
- Emit events in near real-time to warehouse + feature store pipeline.

## 2. Canonical Events

## session_started
```json
{
  "event_name": "session_started",
  "event_id": "uuid",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "session_id": "uuid",
  "artifact_type": "poster",
  "vibe_chips": ["cinematic", "retro"],
  "constraints": {"more_color": true},
  "timestamp": "2026-03-09T12:00:00Z"
}
```

## feed_served
```json
{
  "event_name": "feed_served",
  "session_id": "uuid",
  "candidate_count": 500,
  "served_image_ids": ["uuid1", "uuid2"],
  "ranking_model_version": "ranker_v1_2",
  "timestamp": "2026-03-09T12:00:03Z"
}
```

## interaction_recorded
```json
{
  "event_name": "interaction_recorded",
  "session_id": "uuid",
  "image_id": "uuid",
  "action_type": "save",
  "attribute_feedback": [
    {"attribute": "palette", "sentiment": "positive", "value": 0.9}
  ],
  "dwell_ms": 4200,
  "position_in_feed": 3,
  "timestamp": "2026-03-09T12:00:08Z"
}
```

## pairwise_vote
```json
{
  "event_name": "pairwise_vote",
  "session_id": "uuid",
  "left_image_id": "uuid",
  "right_image_id": "uuid",
  "winner_image_id": "uuid",
  "artifact_type": "poster",
  "timestamp": "2026-03-09T12:00:10Z"
}
```

## generation_requested
```json
{
  "event_name": "generation_requested",
  "session_id": "uuid",
  "mode": "final_pack",
  "signals_count": 27,
  "saved_count": 6,
  "timestamp": "2026-03-09T12:03:00Z"
}
```

## generation_completed
```json
{
  "event_name": "generation_completed",
  "session_id": "uuid",
  "job_id": "uuid",
  "output_count": 8,
  "cost_usd": 0.92,
  "moderation_status": "pass",
  "latency_ms": 13000,
  "timestamp": "2026-03-09T12:03:16Z"
}
```

## style_pack_created
```json
{
  "event_name": "style_pack_created",
  "session_id": "uuid",
  "style_id": "sty_01H...",
  "top_reference_count": 12,
  "timestamp": "2026-03-09T12:03:20Z"
}
```

## 3. Feature Store Fields
- `save_rate_5min`
- `negative_feedback_rate`
- `attribute_affinity_palette`
- `attribute_affinity_composition`
- `artifact_preference_distribution`
- `novelty_tolerance_score`

## 4. Data Quality Checks
- Null checks on IDs and timestamps
- Event ordering checks per session
- Deduplication by `event_id`
- Drift checks on action type distribution

## 5. Privacy Controls
- PII minimized in behavioral events
- Tenant-level retention windows
- Right-to-delete pipeline for user-associated events
