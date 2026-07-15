import { useEffect, useRef, useState } from "react";
import { PROMPTS } from "../prompts";
import { dateKey, loadEntry, saveEntry, type DayEntry } from "../storage";
import { formatLongDate, formatWeekday } from "../format";
import { quoteForDate } from "../quotes";
import { AutoTextarea } from "./AutoTextarea";
import { ClassIdeas } from "./ClassIdeas";

// Editable view of a single day's reflections. Auto-saves on-device.
// `date` is a YYYY-MM-DD key; the same component serves today and past days.
export function EntryEditor({ date }: { date: string }) {
  const [entry, setEntry] = useState<DayEntry>(() => loadEntry(date));
  const [saved, setSaved] = useState(true);
  const saveTimer = useRef<number | undefined>(undefined);

  // Re-load when switching to a different day.
  useEffect(() => {
    setEntry(loadEntry(date));
    setSaved(true);
  }, [date]);

  // Debounced auto-save whenever an answer changes.
  useEffect(() => {
    setSaved(false);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveEntry(date, entry);
      setSaved(true);
    }, 500);
    return () => window.clearTimeout(saveTimer.current);
  }, [entry, date]);

  function update(id: string, value: string) {
    setEntry((prev) => ({ ...prev, [id]: value }));
  }

  const quote = quoteForDate(date);

  return (
    <>
      <figure className="quote">
        <blockquote className="quote-text">{quote.text}</blockquote>
        <figcaption className="quote-author">— {quote.author}</figcaption>
      </figure>

      <header className="header">
        <h1 className="day">{formatWeekday(date)}</h1>
        <p className="date">{formatLongDate(date)}</p>
      </header>

      <main className="prompts">
        {PROMPTS.map((p) => (
          <section key={p.id} className="prompt">
            <label className="question" htmlFor={p.id}>
              {p.question}
            </label>
            <AutoTextarea
              id={p.id}
              value={entry[p.id] ?? ""}
              placeholder={p.placeholder}
              onChange={(value) => update(p.id, value)}
            />
          </section>
        ))}
      </main>

      {date === dateKey() && <ClassIdeas entry={entry} />}

      <footer className="footer">
        <span className={`save-state ${saved ? "is-saved" : ""}`}>
          {saved ? "Saved" : "Saving…"}
        </span>
      </footer>
    </>
  );
}
