import { useState } from "react";
import { dateKey } from "./storage";
import { EntryEditor } from "./components/EntryEditor";
import { BrowseScreen } from "./components/BrowseScreen";
import { QuestionHistory } from "./components/QuestionHistory";

// A screen in the navigation stack. Today's entry is always the root.
type View =
  | { name: "entry"; date: string }
  | { name: "browse" }
  | { name: "question"; promptId: string };

export default function App() {
  const today = dateKey();
  const [stack, setStack] = useState<View[]>([{ name: "entry", date: today }]);

  const view = stack[stack.length - 1];
  const atRoot = stack.length === 1;

  const push = (v: View) => setStack((s) => [...s, v]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  return (
    <div className="app">
      <nav className="topbar">
        {atRoot ? (
          <button
            className="nav-btn"
            aria-label="Browse past days"
            onClick={() => push({ name: "browse" })}
          >
            <HistoryIcon />
          </button>
        ) : (
          <button className="nav-btn" aria-label="Back" onClick={back}>
            <BackIcon />
          </button>
        )}
        {view.name === "browse" && <span className="topbar-title">Past</span>}
      </nav>

      {view.name === "entry" && <EntryEditor key={view.date} date={view.date} />}

      {view.name === "browse" && (
        <BrowseScreen
          onOpenDay={(date) => push({ name: "entry", date })}
          onOpenQuestion={(promptId) => push({ name: "question", promptId })}
        />
      )}

      {view.name === "question" && (
        <QuestionHistory
          promptId={view.promptId}
          onOpenDay={(date) => push({ name: "entry", date })}
        />
      )}
    </div>
  );
}

function HistoryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8v4l3 2M3.05 11a9 9 0 1 1 .5 4M3 15v-4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
