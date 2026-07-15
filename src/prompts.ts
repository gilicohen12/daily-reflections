// Your daily reflection prompts.
// Edit this list to change the questions you answer each day.
// `id` must be unique and stable — it's how answers are saved, so don't
// change an existing id or you'll orphan past entries.

export interface Prompt {
  id: string;
  question: string;
  placeholder?: string;
}

export const PROMPTS: Prompt[] = [
  { id: "thankful", question: "I'm thankful for…" },
  { id: "on-my-mind", question: "What is on my mind right now?" },
  { id: "what-can-i-do", question: "What can I do about it?" },
  { id: "today-i-learned", question: "Today I learned that…" },
  {
    id: "freed-my-spirit",
    question: "What freed my spirit, my body, or my mentality today?",
  },
  {
    id: "connection",
    question:
      "What conversation or human connection am I grateful for today?",
  },
  { id: "took-for-granted", question: "What did I take for granted today?" },
  { id: "remember", question: "I have to remember that…" },
];
