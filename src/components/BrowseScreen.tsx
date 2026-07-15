import { useState } from "react";
import { PROMPTS } from "../prompts";
import {
  allDates,
  answersForPrompt,
  getFavorites,
  toggleFavorite,
} from "../storage";
import { formatShortDate } from "../format";

type Tab = "days" | "questions" | "favorites";

// Browse hub: past days, prompts across days, and starred phrases.
export function BrowseScreen(props: {
  onOpenDay: (date: string) => void;
  onOpenQuestion: (promptId: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("days");
  const [, bump] = useState(0); // re-render after removing a favorite
  const dates = allDates();
  const favorites = getFavorites();

  const seg = (id: Tab, label: string) => (
    <button
      role="tab"
      aria-selected={tab === id}
      className={`seg ${tab === id ? "is-active" : ""}`}
      onClick={() => setTab(id)}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="segmented" role="tablist">
        {seg("days", "Days")}
        {seg("questions", "Questions")}
        {seg("favorites", "Favorites")}
      </div>

      {tab === "days" && (
        <ul className="browse-list">
          {dates.length === 0 && <li className="empty">No entries yet.</li>}
          {dates.map((date) => (
            <li key={date}>
              <button className="row" onClick={() => props.onOpenDay(date)}>
                <span className="row-title">{formatShortDate(date)}</span>
                <span className="row-chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === "questions" && (
        <ul className="browse-list">
          {PROMPTS.map((p) => {
            const count = answersForPrompt(p.id).length;
            return (
              <li key={p.id}>
                <button
                  className="row"
                  onClick={() => props.onOpenQuestion(p.id)}
                >
                  <span className="row-title">{p.question}</span>
                  <span className="row-meta">{count > 0 ? `${count}` : "—"}</span>
                  <span className="row-chevron">›</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "favorites" && (
        <ul className="fav-list">
          {favorites.length === 0 && (
            <li className="empty">
              No favorites yet. Star a phrase from your class ideas to keep it
              here.
            </li>
          )}
          {favorites.map((f) => (
            <li key={f.text} className="fav">
              <span className="fav-text">{f.text}</span>
              <button
                className="fav-star"
                aria-label="Remove from favorites"
                onClick={() => {
                  toggleFavorite(f.text);
                  bump((n) => n + 1);
                }}
              >
                ★
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
