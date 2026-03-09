/* Generated starter types from docs/openapi.yaml */
export interface paths {
  "/sessions/start": {
    post: {
      requestBody: {
        content: {
          "application/json": {
            artifact_type: string;
            vibe_chips?: string[];
            constraints?: Record<string, unknown>;
          };
        };
      };
      responses: {
        201: {
          content: {
            "application/json": {
              id: string;
              user_id: string;
              artifact_type: string;
              vibe_chips: string[];
              started_at: string;
            };
          };
        };
      };
    };
  };
  "/feed": {
    get: {
      responses: {
        200: {
          content: {
            "application/json": {
              session_id: string;
              items: Array<{
                image_id: string;
                url: string;
                score: number;
              }>;
            };
          };
        };
      };
    };
  };
}
