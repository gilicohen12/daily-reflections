import { useState } from "react";
import type { DayEntry } from "../storage";
import {
  distillClassIdeas,
  getApiKey,
  hasContent,
  setApiKey,
} from "../gemini";

type Status = "idle" | "need-key" | "loading" | "done" | "error";

// A button on today's page that distills the reflection into 5 short,
// class-ready philosophy phrases via Gemini.
export function ClassIdeas({ entry }: { entry: DayEntry }) {
  const [status, setStatus] = useState<Status>("idle");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [keyInput, setKeyInput] = useState("");

  const canRun = hasContent(entry);

  async function generate() {
    const key = getApiKey();
    if (!key) {
      setStatus("need-key");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      setIdeas(await distillClassIdeas(entry, key));
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function saveKeyAndRun() {
    if (!keyInput.trim()) return;
    setApiKey(keyInput);
    setKeyInput("");
    generate();
  }

  const hasKey = getApiKey().length > 0;

  return (
    <section className="ideas">
      {status === "need-key" ? (
        <div className="key-panel">
          <p className="key-help">
            One-time setup: paste a free Google Gemini API key. It's stored only
            on this device.
          </p>
          <a
            className="key-link"
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
          >
            Get a free key →
          </a>
          <input
            className="key-input"
            type="password"
            placeholder="Paste API key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            autoComplete="off"
          />
          <div className="ideas-actions">
            <button
              className="btn-primary"
              onClick={saveKeyAndRun}
              disabled={!keyInput.trim()}
            >
              Save & distill
            </button>
            <button className="btn-ghost" onClick={() => setStatus("idle")}>
              Cancel
            </button>
          </div>
        </div>
      ) : status === "done" ? (
        <>
          <h2 className="ideas-title">For your class</h2>
          <ul className="ideas-list">
            {ideas.map((idea, i) => (
              <li key={i} className="idea">
                {idea}
              </li>
            ))}
          </ul>
          <div className="ideas-actions">
            <button className="btn-ghost" onClick={generate}>
              Regenerate
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            className="btn-primary btn-distill"
            onClick={generate}
            disabled={!canRun || status === "loading"}
          >
            {status === "loading"
              ? "Distilling…"
              : "✦ Distill into class ideas"}
          </button>
          {!canRun && (
            <p className="ideas-hint">Write something above first.</p>
          )}
          {status === "error" && <p className="ideas-error">{error}</p>}
          {hasKey && (
            <button
              className="link-btn"
              onClick={() => {
                setKeyInput("");
                setStatus("need-key");
              }}
            >
              Change API key
            </button>
          )}
        </>
      )}
    </section>
  );
}
