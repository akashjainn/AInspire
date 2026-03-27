"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ApiClient } from "@ainspire/api-client";
import type { ArtifactType, FeedItem, InteractionAction } from "@ainspire/types";
import DesignEliminationView from "./components/DesignEliminationView";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import styles from "./page.module.css";

const api = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000");

// Test images for demo
const TEST_IMAGES = [
  "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1561337404-35e76e6c9e0f?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1561337404-35e76e6c9e0f?w=400&h=300&fit=crop",
];

const TEST_GENERATED_IMAGES = [
  "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1561337404-35e76e6c9e0f?w=600&h=400&fit=crop",
];

const artifacts: Array<{ value: ArtifactType; label: string }> = [
  { value: "painting", label: "Painting" },
  { value: "illustration", label: "Cartoon" },
  { value: "storyboard", label: "Animation" },
  { value: "ui_design", label: "UI Interface" },
  { value: "game_concept_art", label: "3D Model" },
  { value: "poster", label: "Poster" },
  { value: "logo", label: "Logo" },
  { value: "tattoo", label: "Tattoo" },
  { value: "album_cover", label: "Album Cover" },
  { value: "brand_identity", label: "Brand Identity" },
];

const vibeChips = [
  "minimal", "surreal", "retro", "editorial", "cinematic",
  "anime", "brutalist", "luxury", "gothic", "psychedelic",
];

const previewGradients = [
  "linear-gradient(135deg, #FFD6CC 0%, #FFAB99 100%)",
  "linear-gradient(135deg, #E8D5FF 0%, #C4B5FD 100%)",
  "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)",
  "linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)",
];

type Screen = "creation" | "elimination" | "inspiration" | "choosestyles";

// ─── Swipe Card ──────────────────────────────────────────────────────────────

interface SwipeCardProps {
  item: FeedItem;
  onAction: (imageId: string, action: InteractionAction) => void;
  isSaved: boolean;
}

function SwipeCard({ item, onAction, isSaved }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-120, 0, 120], [-16, 0, 16]);
  const saveOpacity = useTransform(x, [20, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, -20], [1, 0]);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return <div className={styles.swipeCardGhost} />;
  }

  return (
    <motion.div
      className={styles.swipeCard}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) {
          setDismissed(true);
          onAction(item.image_id, "save");
        } else if (info.offset.x < -80) {
          setDismissed(true);
          onAction(item.image_id, "dislike");
        }
      }}
      whileTap={{ scale: 0.97 }}
    >
      {item.url ? (
        <img
          src={item.url}
          alt="style"
          className={styles.swipeCardImage}
          draggable={false}
        />
      ) : (
        <div className={styles.swipeCardFallback} />
      )}
      <motion.div className={styles.saveOverlay} style={{ opacity: saveOpacity }}>
        <span>SAVE</span>
      </motion.div>
      <motion.div className={styles.skipOverlay} style={{ opacity: skipOpacity }}>
        <span>SKIP</span>
      </motion.div>
      {isSaved && (
        <div className={styles.savedBadge}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Saved
        </div>
      )}
    </motion.div>
  );
}

// ─── Breadcrumb Navigation ────────────────────────────────────────────────────

interface BreadcrumbProps {
  currentScreen: Screen;
}

function Breadcrumb({ currentScreen }: BreadcrumbProps) {
  const breadcrumbs: Record<Screen, string> = {
    creation: "Home",
    elimination: "Elimination",
    inspiration: "Inspiration",
    choosestyles: "Results",
  };

  return (
    <div className={styles.breadcrumb}>
      <span className={styles.breadcrumbItem}>{breadcrumbs[currentScreen]}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [artifact, setArtifact] = useState<ArtifactType>("painting");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [interactions, setInteractions] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("creation");
  const [useEliminationView, setUseEliminationView] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [artworkSaved, setArtworkSaved] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = saved.length >= 5 && interactions >= 20;
  const progressPercent = Math.min(100, Math.round((interactions / 20) * 100));
  const savedItems = feed.filter((f) => saved.includes(f.image_id));
  const selectedArtwork = feed.find((f) => f.image_id === selectedArtworkId) ?? null;

  // Generate test feed items
  function generateTestFeed() {
    return TEST_IMAGES.map((url, i) => ({
      image_id: `test-${i}`,
      url,
      rank: i,
    }));
  }

  // Generate test generated items
  function generateTestGeneratedItems() {
    return TEST_GENERATED_IMAGES.map((url, i) => ({
      image_id: `generated-${i}`,
      url,
      rank: i,
    }));
  }

  async function startSession() {
    try {
      const session = await api.startSession({ artifact_type: artifact, vibe_chips: selectedChips });
      setSessionId(session.id);
      // Use test feed for demo
      const testFeed = generateTestFeed();
      setFeed(testFeed as any);
    } catch {
      // Demo mode — use test feed
      const testFeed = generateTestFeed();
      setFeed(testFeed as any);
    }
    setCurrentScreen("elimination");
  }

  async function recordInteraction(imageId: string, action: InteractionAction, comparisonId?: string) {
    setInteractions((v) => v + 1);
    if (action === "save") {
      setSaved((c) => (c.includes(imageId) ? c : [...c, imageId]));
    }
    if (!sessionId) return;
    try {
      await api.recordInteraction({
        session_id: sessionId,
        image_id: imageId,
        action_type: action,
        comparison_image_id: comparisonId,
      });
      // Use test feed for demo
      const testFeed = generateTestFeed();
      setFeed(testFeed as any);
    } catch {
      // Demo mode — use test feed
      const testFeed = generateTestFeed();
      setFeed(testFeed as any);
    }
  }

  async function generateFinalPack() {
    setIsGenerating(true);
    if (sessionId) {
      try {
        await api.generateFinalPack(sessionId);
      } catch {
        // continue
      }
    }
    // Simulate generation delay
    setTimeout(() => {
      const testGenerated = generateTestGeneratedItems();
      setFeed(testGenerated as any);
      setIsGenerating(false);
      setCurrentScreen("choosestyles");
    }, 1500);
  }

  function toggleSaveArtwork(id: string) {
    setArtworkSaved((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goHome() {
    setCurrentScreen("creation");
    setArtifact("painting");
    setSelectedChips([]);
    setSessionId("");
    setFeed([]);
    setSaved([]);
    setInteractions(0);
    setSelectedArtworkId(null);
    setArtworkSaved(new Set());
    setSidebarOpen(false);
  }

  const sidebarItems = [
    {
      label: "View Saved",
      icon: "bookmark" as const,
      onClick: () => setCurrentScreen("inspiration"),
    },
    { label: "Account", icon: "user" as const },
    { label: "Archive", icon: "archive" as const },
  ];

  const screenVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease: "easeOut" } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: "easeIn" } },
  };

  return (
    <div className={styles.root}>
      <div className={styles.app}>
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onHomeClick={goHome}
          isHome={currentScreen !== "creation"}
        />
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          items={sidebarItems}
        />

        <Breadcrumb currentScreen={currentScreen} />

        <main className={styles.main}>
          <AnimatePresence mode="wait">

            {/* ═══════════════════════════════════════════════
                CREATION SCREEN
            ═══════════════════════════════════════════════ */}
            {currentScreen === "creation" && (
              <motion.div
                key="creation"
                className={styles.screen}
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className={styles.creationScreen}>
                  {/* Visual preview area */}
                  <div className={styles.previewArea}>
                    <div className={styles.previewGrid}>
                      {previewGradients.map((bg, i) => (
                        <motion.div
                          key={i}
                          className={styles.previewCard}
                          style={{ background: bg }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                    <p className={styles.previewLabel}>
                      AI learns your aesthetic through visual choices
                    </p>
                  </div>

                  {/* Form */}
                  <div className={styles.formSection}>
                    <h2 className={styles.formTitle}>What are you creating today?</h2>

                    <div className={styles.formGroup}>
                      <Dropdown
                        value={artifact}
                        onChange={(val) => setArtifact(val as ArtifactType)}
                        options={artifacts}
                        placeholder="Select artifact"
                      />
                    </div>

                    <div className={styles.vibeSection}>
                      <p className={styles.vibeLabel}>Select your vibe</p>
                      <div className={styles.chips}>
                        {vibeChips.map((chip) => (
                          <button
                            key={chip}
                            className={`${styles.chip} ${
                              selectedChips.includes(chip) ? styles.chipActive : ""
                            }`}
                            onClick={() =>
                              setSelectedChips((c) =>
                                c.includes(chip)
                                  ? c.filter((x) => x !== chip)
                                  : [...c, chip]
                              )
                            }
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button size="lg" fullWidth onClick={startSession}>
                      Start Creating
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════
                ELIMINATION SCREEN
            ═══════════════════════════════════════════════ */}
            {currentScreen === "elimination" && (
              <motion.div
                key="elimination"
                className={styles.screen}
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className={styles.eliminationScreen}>
                  <h2 className={styles.screenTitle}>Eliminate styles you don't like</h2>
                  <p className={styles.swipeHint}>← Swipe to skip &nbsp;·&nbsp; Swipe to save →</p>

                  {/* View mode toggle */}
                  <div className={styles.viewToggle}>
                    <button
                      className={`${styles.toggleBtn} ${
                        !useEliminationView ? styles.toggleBtnActive : ""
                      }`}
                      onClick={() => setUseEliminationView(false)}
                    >
                      Grid
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${
                        useEliminationView ? styles.toggleBtnActive : ""
                      }`}
                      onClick={() => setUseEliminationView(true)}
                    >
                      Compare
                    </button>
                  </div>

                  {useEliminationView && sessionId ? (
                    <DesignEliminationView
                      sessionId={sessionId}
                      onInteraction={(action, imageId, comparisonImageId) =>
                        recordInteraction(imageId, action, comparisonImageId)
                      }
                    />
                  ) : (
                    <div className={styles.cardGrid}>
                      {feed.length === 0 ? (
                        <p className={styles.emptyState}>
                          No styles loaded yet. Start a session to see designs.
                        </p>
                      ) : (
                        feed.map((item) => (
                          <SwipeCard
                            key={item.image_id}
                            item={item}
                            onAction={recordInteraction}
                            isSaved={saved.includes(item.image_id)}
                          />
                        ))
                      )}
                    </div>
                  )}

                  {/* Progress */}
                  <div className={styles.progressRow}>
                    <span className={styles.progressText}>{interactions}/20</span>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>{saved.length}/5 saved</span>
                  </div>

                  <div className={styles.ctaGroup}>
                    {canGenerate ? (
                      <Button size="lg" fullWidth onClick={generateFinalPack} disabled={isGenerating}>
                        {isGenerating ? "Generating..." : "Generate Artwork from Inspiration →"}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        fullWidth
                        variant="outline"
                        onClick={() => setCurrentScreen("inspiration")}
                      >
                        View Saved Inspiration
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════
                INSPIRATION SCREEN — "Your inspiration"
            ═══════════════════════════════════════════════ */}
            {currentScreen === "inspiration" && (
              <motion.div
                key="inspiration"
                className={styles.screen}
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className={styles.inspirationScreen}>
                  <button
                    className={styles.backBtn}
                    onClick={() => setCurrentScreen("elimination")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </button>

                  <h2 className={styles.sectionTitle}>Your inspiration</h2>

                  <div className={styles.inspirationList}>
                    {savedItems.length === 0 ? (
                      <div className={styles.emptyInspiration}>
                        <p>Nothing saved yet.</p>
                        <p>Swipe right on styles you love.</p>
                      </div>
                    ) : (
                      savedItems.map((item, i) => (
                        <motion.div
                          key={item.image_id}
                          className={styles.inspirationCard}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          {item.url ? (
                            <img
                              src={item.url}
                              alt="saved inspiration"
                              className={styles.inspirationCardImage}
                            />
                          ) : (
                            <div
                              className={styles.inspirationCardImage}
                              style={{ background: previewGradients[i % previewGradients.length] }}
                            />
                          )}
                          <div className={styles.inspirationCardBody}>
                            <p className={styles.inspirationCardTitle}>
                              Saved Style #{i + 1}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className={styles.ctaGroup}>
                    <Button
                      size="lg"
                      fullWidth
                      onClick={generateFinalPack}
                      disabled={savedItems.length < 1}
                    >
                      Generate Artwork from Inspiration →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════
                CHOOSE STYLES SCREEN
            ═══════════════════════════════════════════════ */}
            {currentScreen === "choosestyles" && (
              <motion.div
                key="choosestyles"
                className={styles.screen}
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {selectedArtworkId && selectedArtwork ? (
                  /* ─── Detail view ─── */
                  <div className={styles.detailScreen}>
                    <button
                      className={styles.backBtn}
                      onClick={() => setSelectedArtworkId(null)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Back
                    </button>

                    <h2 className={styles.sectionTitle}>Choose styles from generated artwork</h2>

                    <div className={styles.detailCard}>
                      {selectedArtwork.url ? (
                        <img
                          src={selectedArtwork.url}
                          alt="artwork detail"
                          className={styles.detailCardImage}
                        />
                      ) : (
                        <div
                          className={styles.detailCardImage}
                          style={{ background: "linear-gradient(135deg, #E8D5FF 0%, #C4B5FD 100%)" }}
                        />
                      )}
                      <div className={styles.detailActions}>
                        <button
                          className={styles.detailActionBtn}
                          onClick={() => toggleSaveArtwork(selectedArtwork.image_id)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={artworkSaved.has(selectedArtwork.image_id) ? "#2D2A26" : "none"}
                            stroke="#2D2A26"
                            strokeWidth="2"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                          <span className={styles.detailActionLabel}>
                            {artworkSaved.has(selectedArtwork.image_id) ? "Saved" : "Save"}
                          </span>
                        </button>
                        <button className={styles.detailActionBtn}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2D2A26"
                            strokeWidth="2"
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                          </svg>
                          <span className={styles.detailActionLabel}>Share</span>
                        </button>
                        <button
                          className={styles.detailActionBtn}
                          onClick={() => recordInteraction(selectedArtwork.image_id, "like")}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2D2A26"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          <span className={styles.detailActionLabel}>Like</span>
                        </button>
                      </div>
                    </div>

                    {savedItems.length > 0 && (
                      <div className={styles.savedInspirationSection}>
                        <p className={styles.savedInspirationTitle}>Saved Inspiration</p>
                        <div className={styles.savedThumbs}>
                          {savedItems.slice(0, 3).map((item, i) => (
                            <div key={item.image_id} className={styles.savedThumb}>
                              {item.url ? (
                                <img src={item.url} alt="saved" />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    background: previewGradients[i % previewGradients.length],
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ─── Grid view ─── */
                  <div className={styles.chooseScreen}>
                    <h2 className={styles.sectionTitle}>
                      Choose styles from generated artwork
                    </h2>

                    <div className={styles.chooseGrid}>
                      {feed.length === 0 ? (
                        <p className={styles.emptyState}>
                          Generating artwork from your inspiration…
                        </p>
                      ) : (
                        feed.map((item) => (
                          <motion.button
                            key={item.image_id}
                            className={styles.artworkCard}
                            onClick={() => setSelectedArtworkId(item.image_id)}
                            whileTap={{ scale: 0.95 }}
                          >
                            {item.url ? (
                              <img
                                src={item.url}
                                alt="artwork"
                                className={styles.artworkCardImage}
                                draggable={false}
                              />
                            ) : (
                              <div className={styles.artworkCardFallback} />
                            )}
                            {artworkSaved.has(item.image_id) && (
                              <div className={styles.artworkSavedBadge}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                              </div>
                            )}
                          </motion.button>
                        ))
                      )}
                    </div>

                    {savedItems.length > 0 && (
                      <div className={styles.savedInspirationSection}>
                        <p className={styles.savedInspirationTitle}>Saved Inspiration</p>
                        <div className={styles.savedThumbs}>
                          {savedItems.slice(0, 3).map((item, i) => (
                            <div key={item.image_id} className={styles.savedThumb}>
                              {item.url ? (
                                <img src={item.url} alt="saved" />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    background: previewGradients[i % previewGradients.length],
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
