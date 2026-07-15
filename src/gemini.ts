// Calls Google Gemini directly from the browser (free tier). The API key is
// stored only in this device's localStorage and sent solely to Google.
import { PROMPTS } from "./prompts";
import type { DayEntry } from "./storage";

// Tried in order; the first the key can use wins. "gemini-flash-latest" is a
// rolling alias Google keeps pointed at the current Flash model, so it won't
// break when a specific version is retired. The pinned model is a fallback.
const MODELS = ["gemini-flash-latest", "gemini-2.0-flash"];
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
  "each a single line under about 20 words — that they can speak or weave " +
  "into a class as a philosophy, theme, or intention. Stay close to the " +
  "teacher's own voice: reuse their vocabulary, phrasing, and imagery, and " +
  "echo their exact words where they land well, so the phrases sound like the " +
  "teacher wrote them. Keep them warm, grounded, and evocative. Avoid clichés " +
  "and generic spiritual filler.";

// Sends the day's reflection to Gemini and returns 5 short class-ready phrases.
// Throws with a readable message on any failure.
export async function distillClassIdeas(
  entry: DayEntry,
  apiKey: string,
): Promise<string[]> {
  const text = entryToText(entry);
  if (!text) throw new Error("Nothing written yet today.");

  const body = JSON.stringify({
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
  });

  let lastError = "";
  for (let i = 0; i < MODELS.length; i++) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS[i]}:generateContent?key=${encodeURIComponent(
      apiKey,
    )}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!res.ok) {
      let detail = `${res.status}`;
      try {
        detail = (await res.json())?.error?.message ?? detail;
      } catch {
        /* keep status */
      }
      if (res.status === 400 && /api key/i.test(detail)) {
        throw new Error("That API key was rejected. Check it and try again.");
      }
      // If this model is gone/unusable, fall through to the next candidate.
      const modelGone =
        res.status === 404 ||
        /not available|not found|not supported|no longer/i.test(detail);
      lastError = detail;
      if (modelGone && i < MODELS.length - 1) continue;
      throw new Error(`Gemini error: ${detail}`);
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

    return ideas.map((idea) => String(idea).trim()).filter(Boolean);
  }

  throw new Error(`Gemini error: ${lastError || "no usable model."}`);
}
