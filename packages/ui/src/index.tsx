import React from "react";

export function ImageCard({ url, onLike, onDislike, onSave }: { url: string; onLike: () => void; onDislike: () => void; onSave: () => void }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <img src={url} alt="inspiration" style={{ width: "100%", borderRadius: 8 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={onLike}>Like</button>
        <button onClick={onDislike}>Dislike</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}
