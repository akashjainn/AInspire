import type { FeedResponse, InteractionRequest, Session, SessionStartRequest } from "@ainspire/types";

export class ApiClient {
  constructor(private baseUrl: string) {}

  async startSession(payload: SessionStartRequest): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/sessions/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return response.json();
  }

  async getFeed(sessionId: string, limit = 10): Promise<FeedResponse> {
    const response = await fetch(`${this.baseUrl}/feed?session_id=${encodeURIComponent(sessionId)}&limit=${limit}`);
    return response.json();
  }

  async recordInteraction(payload: InteractionRequest): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return response.json();
  }

  async createBoard(userId: string, title: string): Promise<{ id: string; title: string }> {
    const response = await fetch(`${this.baseUrl}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, title })
    });
    return response.json();
  }

  async saveBoardItem(boardId: string, imageId: string, savedReason?: string): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/boards/${boardId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_id: imageId, saved_reason: savedReason })
    });
    return response.json();
  }

  async generateFinalPack(sessionId: string): Promise<{ job_id: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/generate/final-pack`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, mode: "final_pack" })
    });
    return response.json();
  }
}
