import { useEffect, useState } from "react";
import { ApiClient } from "@ainspire/api-client";
import type { FeedItem, InteractionAction } from "@ainspire/types";
import ShootableCard from "./ShootableCard";

interface DesignEliminationViewProps {
  sessionId: string;
  onInteraction: (action: InteractionAction, imageId: string, comparisonImageId?: string) => void;
  disabled?: boolean;
}

const api = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000");

const DesignEliminationView: React.FC<DesignEliminationViewProps> = ({ sessionId, onInteraction, disabled = false }) => {
  const [pair, setPair] = useState<[FeedItem, FeedItem] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNewPair = async () => {
    setIsLoading(true);
    try {
      const response = await api.getFeed(sessionId, 2);
      if (response.items.length >= 2) {
        setPair([response.items[0], response.items[1]]);
      }
    } catch (error) {
      console.error("Failed to load pair:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadNewPair();
    }
  }, [sessionId]);

  const handleCardShot = (shotImageId: string, otherImageId: string) => {
    // Record the interaction: user eliminated (shot) the shotImageId
    // This means they preferred the otherImageId
    onInteraction("this_or_that", otherImageId, shotImageId);
    loadNewPair();
  };

  if (isLoading || !pair) {
    return (
      <div className="elimination-loading">
        <p>Loading designs to compare...</p>
      </div>
    );
  }

  return (
    <div className="elimination-view">
      <div className="elimination-header">
        <h2>Shoot to Eliminate</h2>
        <p>Click on a design to eliminate it. The other design wins!</p>
      </div>

      <div className="elimination-container">
        <ShootableCard
          imageUrl={pair[0].url}
          imageId={pair[0].image_id}
          onShot={() => handleCardShot(pair[0].image_id, pair[1].image_id)}
        />
        <ShootableCard
          imageUrl={pair[1].url}
          imageId={pair[1].image_id}
          onShot={() => handleCardShot(pair[1].image_id, pair[0].image_id)}
        />
      </div>
    </div>
  );
};

export default DesignEliminationView;
