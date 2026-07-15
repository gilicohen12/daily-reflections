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

// Favorite phrases the user has starred from generated class ideas.
const FAVORITES_KEY = "favorites";

export interface Favorite {
  text: string;
  savedAt: number; // epoch ms, for newest-first ordering
}

export function getFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(text: string): boolean {
  return getFavorites().some((f) => f.text === text);
}

// Adds or removes a phrase; returns the resulting favorited state.
export function toggleFavorite(text: string): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex((f) => f.text === text);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false;
  }
  favorites.unshift({ text, savedAt: Date.now() });
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return true;
}
