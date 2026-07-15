import { PROMPTS } from "../prompts";
import { answersForPrompt } from "../storage";
import { formatShortDate } from "../format";

// One prompt, every day's answer stacked oldest → newest, so reading down the
// page traces how your reflections on this question have evolved.
export function QuestionHistory(props: {
  promptId: string;
  onOpenDay: (date: string) => void;
}) {
  const prompt = PROMPTS.find((p) => p.id === props.promptId);
  const answers = answersForPrompt(props.promptId);

  return (
    <>
      <header className="header">
        <h1 className="q-title">{prompt?.question ?? "Question"}</h1>
      </header>

      {answers.length === 0 ? (
        <p className="empty">No answers to this one yet.</p>
      ) : (
        <div className="timeline">
          {answers.map((a) => (
            <article key={a.date} className="timeline-entry">
              <button
                className="timeline-date"
                onClick={() => props.onOpenDay(a.date)}
              >
                {formatShortDate(a.date)}
              </button>
              <p className="timeline-text">{a.text}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
