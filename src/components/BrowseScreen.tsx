import { useState } from "react";
import { PROMPTS } from "../prompts";
import { allDates, answersForPrompt } from "../storage";
import { formatShortDate } from "../format";

type Tab = "days" | "questions";

// Browse hub: switch between a list of past days and a list of prompts.
export function BrowseScreen(props: {
  onOpenDay: (date: string) => void;
  onOpenQuestion: (promptId: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("days");
  const dates = allDates();

  return (
    <>
      <div className="segmented" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "days"}
          className={`seg ${tab === "days" ? "is-active" : ""}`}
          onClick={() => setTab("days")}
        >
          By day
        </button>
        <button
          role="tab"
          aria-selected={tab === "questions"}
          className={`seg ${tab === "questions" ? "is-active" : ""}`}
          onClick={() => setTab("questions")}
        >
          By question
        </button>
      </div>

      {tab === "days" ? (
        <ul className="browse-list">
          {dates.length === 0 && (
            <li className="empty">No entries yet.</li>
          )}
          {dates.map((date) => (
            <li key={date}>
              <button className="row" onClick={() => props.onOpenDay(date)}>
                <span className="row-title">{formatShortDate(date)}</span>
                <span className="row-chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
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
                  <span className="row-meta">
                    {count > 0 ? `${count}` : "—"}
                  </span>
                  <span className="row-chevron">›</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
