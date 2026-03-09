export type ArtifactType =
  | "poster"
  | "tattoo"
  | "logo"
  | "painting"
  | "storyboard"
  | "ui_design"
  | "album_cover"
  | "game_concept_art"
  | "illustration"
  | "brand_identity";

export type InteractionAction =
  | "like"
  | "dislike"
  | "save"
  | "more_like_this"
  | "less_like_this"
  | "this_or_that";

export interface SessionStartRequest {
  artifact_type: ArtifactType;
  vibe_chips?: string[];
  constraints?: Record<string, unknown>;
}

export interface Session {
  id: string;
  user_id: string;
  artifact_type: ArtifactType;
  vibe_chips: string[];
  started_at: string;
}

export interface FeedItem {
  image_id: string;
  url: string;
  score: number;
  explanation: Record<string, unknown>;
  attributes: Record<string, unknown>;
}

export interface FeedResponse {
  session_id: string;
  items: FeedItem[];
}

export interface InteractionRequest {
  session_id: string;
  image_id: string;
  action_type: InteractionAction;
  comparison_image_id?: string;
  value?: number;
  attribute_feedback?: Array<{ attribute: string; sentiment: "positive" | "negative"; value: number }>;
}
