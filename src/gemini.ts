// Calls Google Gemini directly from the browser (free tier). The API key is
// stored only in this device's localStorage and sent solely to Google.
import { PROMPTS } from "./prompts";
import type { DayEntry } from "./storage";

const MODEL = "gemini-2.5-flash";
const KEY_STORAGE = "gemini-api-key";

export function getApiKey(): string {
  return localStorage.getItem(KEY_STORAGE) ?? "";
}

export function setApiKey(key: string): void {
  localStorage.setItem(KEY_STORAGE, key.trim());
}

// Fold the day's answered prompts into a single block of text.
function entryToText(entry: DayEntry): string {
  return PROMPTS.filter((p) => (entry[p.id] ?? "").trim().length > 0)
    .map((p) => `${p.question}\n${entry[p.id].trim()}`)
    .join("\n\n");
}

export function hasContent(entry: DayEntry): boolean {
  return entryToText(entry).length > 0;
}

const SYSTEM_INSTRUCTION =
  "You help a yoga teacher turn their private daily reflection into teaching " +
  "material. From the reflection, craft exactly 5 short ideas or phrases — " +
  "each a single line under about 12 words — that they can speak or weave " +
  "into a class as a philosophy, theme, or intention. Make them warm, " +
  "grounded, and evocative, inspired by the reflection but never quoting the " +
  "person's raw words verbatim. Avoid clichés where you can.";

// Sends the day's reflection to Gemini and returns 5 short class-ready phrases.
// Throws with a readable message on any failure.
export async function distillClassIdeas(
  entry: DayEntry,
  apiKey: string,
): Promise<string[]> {
  const text = entryToText(entry);
  if (!text) throw new Error("Nothing written yet today.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
    apiKey,
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ parts: [{ text: `Today's reflection:\n\n${text}` }] }],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" },
          minItems: 5,
          maxItems: 5,
        },
      },
    }),
  });

  if (!res.ok) {
    let detail = `${res.status}`;
    try {
      const err = await res.json();
      detail = err?.error?.message ?? detail;
    } catch {
      /* keep status */
    }
    throw new Error(
      res.status === 400 && /api key/i.test(detail)
        ? "That API key was rejected. Check it and try again."
        : `Gemini error: ${detail}`,
    );
  }

  const data = await res.json();
  const raw: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned an empty response.");

  let ideas: unknown;
  try {
    ideas = JSON.parse(raw);
  } catch {
    throw new Error("Could not parse Gemini's response.");
  }
  if (!Array.isArray(ideas)) throw new Error("Unexpected response format.");

  return ideas.map((i) => String(i).trim()).filter(Boolean);
}
