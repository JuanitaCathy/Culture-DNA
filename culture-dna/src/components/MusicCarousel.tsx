// MusicCarousel.tsx
import React from "react";

type Props = {
  items: { name: string; spotify_id?: string; entity_id: string }[];
};

export default function MusicCarousel({ items }: Props) {
  return (
    <div style={{ display: "flex", overflowX: "auto", gap: "1rem", paddingBottom: "1rem" }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            minWidth: "300px",
            padding: "1rem",
            background: "#222",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <h4>{item.name}</h4>
          {item.spotify_id ? (
            <iframe
              src={`https://open.spotify.com/embed/artist/${item.spotify_id}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
            ></iframe>
          ) : (
            <p>No preview available</p>
          )}
          <small>{item.entity_id}</small>
        </div>
      ))}
    </div>
  );
}
