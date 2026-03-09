export type AnalyticsEventName =
  | "session_started"
  | "feed_loaded"
  | "image_impression"
  | "image_liked"
  | "image_disliked"
  | "image_saved"
  | "pairwise_choice_made"
  | "attribute_feedback_submitted"
  | "generation_requested"
  | "generation_completed"
  | "style_pack_viewed"
  | "board_exported";

export interface AnalyticsEvent {
  event_name: AnalyticsEventName;
  event_id: string;
  tenant_id: string;
  user_id?: string;
  session_id?: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

export function buildEvent(input: Omit<AnalyticsEvent, "timestamp">): AnalyticsEvent {
  return {
    ...input,
    timestamp: new Date().toISOString()
  };
}
