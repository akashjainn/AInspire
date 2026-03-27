"use client";

import { useMemo, useState } from "react";
import { ApiClient } from "@ainspire/api-client";
import type { ArtifactType, FeedItem, InteractionAction } from "@ainspire/types";
import DesignEliminationView from "./components/DesignEliminationView";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import Card from "./components/Card";
import styles from "./page.module.css";

const api = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000");

const artifacts: Array<{ value: ArtifactType; label: string }> = [
  { value: "poster", label: "Poster" },
  { value: "tattoo", label: "Tattoo" },
  { value: "logo", label: "Logo" },
  { value: "painting", label: "Painting" },
  { value: "storyboard", label: "Storyboard" },
  { value: "ui_design", label: "UI Design" },
  { value: "album_cover", label: "Album Cover" },
  { value: "game_concept_art", label: "Game Concept Art" },
  { value: "illustration", label: "Illustration" },
  { value: "brand_identity", label: "Brand Identity" },
];

const chips = ["minimal", "surreal", "retro", "editorial", "cinematic", "anime", "brutalist", "luxury", "gothic", "psychedelic"];

export default function HomePage() {
  const [artifact, setArtifact] = useState<ArtifactType>("poster");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [interactions, setInteractions] = useState(0);
  const [jobStatus, setJobStatus] = useState<string>("");
  const [useEliminationView, setUseEliminationView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"creation" | "elimination" | "inspiration">("creation");

  const canGenerate = saved.length >= 5 && interactions >= 20;
  const progressText = useMemo(() => `${interactions}/20 interactions • ${saved.length}/5 saves`, [interactions, saved.length]);

  async function startSession() {
    const session = await api.startSession({ artifact_type: artifact, vibe_chips: selectedChips });
    setSessionId(session.id);
    const response = await api.getFeed(session.id, 10);
    setFeed(response.items);
    setCurrentScreen("elimination");
  }

  async function react(imageId: string, action: InteractionAction, comparisonImageId?: string) {
    if (!sessionId) return;

    await api.recordInteraction({
      session_id: sessionId,
      image_id: imageId,
      action_type: action,
      comparison_image_id: comparisonImageId
    });
    setInteractions((value) => value + 1);

    if (action === "save") {
      setSaved((current) => (current.includes(imageId) ? current : [...current, imageId]));
    }

    const response = await api.getFeed(sessionId, 10);
    setFeed(response.items);
  }

  async function generateFinalPack() {
    if (!sessionId) return;
    const response = await api.generateFinalPack(sessionId);
    setJobStatus(`Final pack queued: ${response.job_id}`);
    setCurrentScreen("inspiration");
  }

  const sidebarItems = [
    { label: "View Saved", icon: "bookmark" as const },
    { label: "Account", icon: "user" as const },
    { label: "Archive", icon: "archive" as const },
  ];

  return (
    <div className={styles.root}>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} items={sidebarItems} />

      {currentScreen === "creation" && (
        <div className={styles.container}>
          <div className={styles.centerContent}>
            <div className={styles.card}>
              <h2>What are you creating today?</h2>
              
              <div className={styles.formGroup}>
                <Dropdown
                  value={artifact}
                  onChange={(val) => setArtifact(val as ArtifactType)}
                  options={artifacts}
                  label="Select artifact"
                />
              </div>

              <div className={styles.section}>
                <h3>Select your vibe</h3>
                <div className={styles.chips}>
                  {chips.map((chip) => (
                    <button
                      key={chip}
                      className={`${styles.chip} ${selectedChips.includes(chip) ? styles.chipActive : ""}`}
                      onClick={() =>
                        setSelectedChips((current) =>
                          current.includes(chip)
                            ? current.filter((c) => c !== chip)
                            : [...current, chip]
                        )
                      }
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <Button size="lg" fullWidth onClick={startSession}>
                  Start Creating
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === "elimination" && (
        <div className={styles.container}>
          <div className={styles.eliminationSection}>
            <div className={styles.sectionHeader}>
              <h2>Eliminate styles you don't like</h2>
              <p>Click or tap to remove styles, refine your taste</p>
            </div>

            {useEliminationView && sessionId ? (
              <DesignEliminationView
                sessionId={sessionId}
                onInteraction={(action, imageId, comparisonImageId) =>
                  react(imageId, action, comparisonImageId)
                }
              />
            ) : (
              <div className={styles.cardGrid}>
                {feed.map((item) => (
                  <Card
                    key={item.image_id}
                    image={item.url}
                    selected={saved.includes(item.image_id)}
                  >
                    <div className={styles.cardActions}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => react(item.image_id, "like")}
                      >
                        ✓
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => react(item.image_id, "dislike")}
                      >
                        ✕
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => react(item.image_id, "save")}
                      >
                        Save
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className={styles.progressBar}>
              <div className={styles.progressText}>{progressText}</div>
            </div>

            {canGenerate && (
              <div className={styles.ctaButton}>
                <Button size="lg" fullWidth onClick={generateFinalPack}>
                  Generate Artwork from Inspiration →
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentScreen === "inspiration" && (
        <div className={styles.container}>
          <div className={styles.centerContent}>
            <h2 className={styles.inspirationTitle}>Your Inspiration</h2>
            <div className={styles.savedGrid}>
              {saved.slice(0, 3).map((id) => {
                const item = feed.find((f) => f.image_id === id);
                return item ? (
                  <Card key={id} image={item.url} title={`Inspiration #${saved.indexOf(id) + 1}`} />
                ) : null;
              })}
            </div>
            <div className={styles.ctaButton}>
              <Button size="lg" fullWidth>
                Generate Artwork from Inspiration →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
