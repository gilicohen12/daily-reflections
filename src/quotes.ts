// A curated set of reflection / philosophy quotes. Kept local so the daily
// quote works offline and loads instantly — no API, no CORS, no key.
// Add or remove freely; the daily rotation adapts to the list length.

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "The quieter you become, the more you are able to hear.", author: "Rumi" },
  { text: "Wherever you are, be there totally.", author: "Eckhart Tolle" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "Yoga is the journey of the self, through the self, to the self.", author: "The Bhagavad Gita" },
  { text: "When you realize nothing is lacking, the whole world belongs to you.", author: "Lao Tzu" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Breath is the bridge which connects life to consciousness.", author: "Thich Nhat Hanh" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "Do not seek to have events happen as you wish, but wish them to happen as they do.", author: "Epictetus" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "Silence is not empty; it is full of answers.", author: "Unknown" },
  { text: "As you think, so you become.", author: "The Buddha" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The body benefits from movement, and the mind benefits from stillness.", author: "Sakyong Mipham" },
  { text: "Let yourself be silently drawn by the strange pull of what you really love.", author: "Rumi" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "Peace comes from within. Do not seek it without.", author: "The Buddha" },
  { text: "Smile, breathe, and go slowly.", author: "Thich Nhat Hanh" },
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "Waste no more time arguing about what a good person should be. Be one.", author: "Marcus Aurelius" },
  { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön" },
  { text: "The mind is everything. What you think you become.", author: "The Buddha" },
  { text: "To a mind that is still, the whole universe surrenders.", author: "Zhuangzi" },
  { text: "Set peace of mind as your highest goal, and organize your life around it.", author: "Brian Tracy" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "The wound is the place where the light enters you.", author: "Rumi" },
  { text: "Flow with whatever may happen, and let your mind be free.", author: "Zhuangzi" },
  { text: "When you arise in the morning, think of what a privilege it is to be alive, to breathe, to think, to enjoy, to love.", author: "Marcus Aurelius" },
  { text: "Tension is who you think you should be. Relaxation is who you are.", author: "Chinese Proverb" },
  { text: "Gratitude turns what we have into enough.", author: "Aesop" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Do every act of your life as though it were the very last act of your life.", author: "Marcus Aurelius" },
  { text: "The way is not in the sky. The way is in the heart.", author: "The Buddha" },
];

// Deterministic quote of the day: the same date always yields the same quote,
// and it advances by one each day. `dateKey` is a YYYY-MM-DD string.
export function quoteForDate(dateKey: string): Quote {
  const days = Math.floor(new Date(`${dateKey}T00:00`).getTime() / 86_400_000);
  const index = ((days % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[index];
}
