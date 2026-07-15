// Date formatting helpers. All parse the YYYY-MM-DD key as a *local* date
// (appending T00:00 avoids the UTC-midnight-shifts-back-a-day trap).

function parseLocal(dateKey: string): Date {
  return new Date(`${dateKey}T00:00`);
}

export function formatWeekday(dateKey: string): string {
  return parseLocal(dateKey).toLocaleDateString(undefined, { weekday: "long" });
}

export function formatLongDate(dateKey: string): string {
  return parseLocal(dateKey).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Compact form for list rows, e.g. "Tue, Jul 14".
export function formatShortDate(dateKey: string): string {
  return parseLocal(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
