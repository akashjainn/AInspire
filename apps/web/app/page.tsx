"use client";

import { useMemo, useState } from "react";
import { ApiClient } from "@ainspire/api-client";
import type { ArtifactType, FeedItem, InteractionAction } from "@ainspire/types";

const api = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000");

const artifacts: ArtifactType[] = [
  "poster",
  "tattoo",
  "logo",
  "painting",
  "storyboard",
  "ui_design",
  "album_cover",
  "game_concept_art",
  "illustration",
  "brand_identity"
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

  const canGenerate = saved.length >= 5 && interactions >= 20;

  const progressText = useMemo(() => `${interactions}/20 interactions • ${saved.length}/5 saves`, [interactions, saved.length]);

  async function startSession() {
    const session = await api.startSession({ artifact_type: artifact, vibe_chips: selectedChips });
    setSessionId(session.id);
    const response = await api.getFeed(session.id, 10);
    setFeed(response.items);
  }

  async function react(imageId: string, action: InteractionAction) {
    if (!sessionId) return;

    await api.recordInteraction({ session_id: sessionId, image_id: imageId, action_type: action });
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
  }

  return (
    <div className="container">
      <h1>AInspire MVP Loop</h1>
      <p>Milestone: react to 20+ images, save at least 5, then generate final inspiration pack.</p>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Artifact Selection</h3>
        <select value={artifact} onChange={(e) => setArtifact(e.target.value as ArtifactType)}>
          {artifacts.map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>

        <h3>Vibe Chips</h3>
        <div className="chips">
          {chips.map((chip) => (
            <button
              key={chip}
              className="chip"
              style={{ background: selectedChips.includes(chip) ? "#dbeafe" : "#fff" }}
              onClick={() => setSelectedChips((current) => current.includes(chip) ? current.filter((c) => c !== chip) : [...current, chip])}
            >
              {chip}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={startSession}>Start Session</button>
        </div>
      </div>

      <div className="layout">
        <div>
          <h3>Image Card Stack</h3>
          <div className="grid">
            {feed.map((item) => (
              <div className="card" key={item.image_id}>
                <img src={item.url} alt="candidate" style={{ width: "100%", borderRadius: 8 }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={() => react(item.image_id, "like")}>Like</button>
                  <button onClick={() => react(item.image_id, "dislike")}>Dislike</button>
                  <button onClick={() => react(item.image_id, "save")}>Save</button>
                  <button onClick={() => react(item.image_id, "this_or_that")}>This/That</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <h3>Session Progress</h3>
          <p>{progressText}</p>
          <h3>Board Sidebar</h3>
          <p>Saved items: {saved.length}</p>
          <ul>
            {saved.slice(0, 8).map((id) => (
              <li key={id}>{id.slice(0, 8)}</li>
            ))}
          </ul>
          <button disabled={!canGenerate} onClick={generateFinalPack}>Generate Final Pack</button>
          <p>{jobStatus}</p>
        </aside>
      </div>
    </div>
  );
}
