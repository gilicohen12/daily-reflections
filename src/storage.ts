// On-device persistence. Each day's answers are stored under its own key,
// so the whole history stays on this phone and never leaves it.

const KEY_PREFIX = "reflection:";

// A day's answers: { [promptId]: text }
export type DayEntry = Record<string, string>;

// Local calendar date as YYYY-MM-DD (not UTC — we want the user's own day).
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadEntry(date: string): DayEntry {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + date);
    return raw ? (JSON.parse(raw) as DayEntry) : {};
  } catch {
    return {};
  }
}

export function saveEntry(date: string, entry: DayEntry): void {
  localStorage.setItem(KEY_PREFIX + date, JSON.stringify(entry));
}

// All dates that have a saved entry, newest first — for the browse view.
export function allDates(): string[] {
  const dates: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(KEY_PREFIX)) dates.push(key.slice(KEY_PREFIX.length));
  }
  return dates.sort().reverse();
}

// Every non-empty answer to a single prompt, across all days.
// Ordered oldest → newest so scrolling down tracks its evolution over time.
export interface PromptAnswer {
  date: string;
  text: string;
}

export function answersForPrompt(promptId: string): PromptAnswer[] {
  return allDates()
    .reverse()
    .map((date) => ({ date, text: loadEntry(date)[promptId] ?? "" }))
    .filter((a) => a.text.trim().length > 0);
}
