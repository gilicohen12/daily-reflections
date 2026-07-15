# Daily Reflections

A private daily-reflection journal, built as an installable web app (PWA). Each
day you answer a set of prompts; you can browse past days, trace how a single
question evolves over time, and distill a day's reflection into short phrases for
teaching yoga. Everything you write stays **on your device** — there is no
backend and no account.

- **Live site:** https://gilicohen12.github.io/daily-reflections/
- **Repo:** https://github.com/gilicohen12/daily-reflections

---

## Table of contents

- [What it does](#what-it-does)
- [Running it locally](#running-it-locally)
- [Where to change things](#where-to-change-things)
- [The AI feature (Gemini)](#the-ai-feature-gemini)
- [Deploying & updating the site](#deploying--updating-the-site)
- [Installing on your iPhone](#installing-on-your-iphone)
- [Your data & privacy](#your-data--privacy)
- [Troubleshooting](#troubleshooting)

---

## What it does

- **Today** (home): the day and date, a daily quote (italic, top of page), and
  your prompts with auto-saving text areas.
- **Past** (top-left button): browse **Days**, view a single question across all
  **Questions** (oldest → newest, to see how your answers evolve), and your
  starred **Favorites**.
- **Class ideas**: a button on today's page sends the reflection to Google
  Gemini and returns 5 short phrases. Tap any phrase to ⭐ save it to Favorites.

## Running it locally

Requires [Node.js](https://nodejs.org/) 20+.

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the dev server → http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Where to change things

Almost everything you'd want to tweak lives in a single file:

| To change…                         | Edit                          |
| ---------------------------------- | ----------------------------- |
| Your daily prompts (add/reorder)   | `src/prompts.ts`              |
| The rotating quotes                | `src/quotes.ts`               |
| Which Gemini model is used         | `src/gemini.ts` (`MODELS`)    |
| Colors / fonts / layout            | `src/index.css`               |
| App name, icon, theme color        | `vite.config.ts` (manifest)   |

**Prompts:** each prompt has a stable `id`. Changing the `id` of an existing
prompt orphans its saved answers, so only change the `question` text, not the
`id`, once you've started journaling.

**Icons:** generated from `meditation.jpeg` into `public/`. To change the icon,
replace that file and regenerate (macOS):

```bash
sips -s format png -z 512 512 meditation.jpeg --out public/pwa-512x512.png
sips -s format png -z 192 192 meditation.jpeg --out public/pwa-192x192.png
sips -s format png -z 180 180 meditation.jpeg --out public/apple-touch-icon.png
sips -s format png -z 48 48  meditation.jpeg --out public/favicon.png
```

## The AI feature (Gemini)

The "class ideas" button calls Google Gemini's free tier directly from the
browser. The first time you use it, the app asks for a **free API key**:

1. Get one at https://aistudio.google.com/apikey
2. Paste it into the app when prompted.

The key is stored only in your browser's local storage on that device and is
sent only to Google — never to this repo or anyone else. Use **Change API key**
under the button to update it.

If Google retires a model, the app automatically tries the next one in the
`MODELS` list in `src/gemini.ts`. `gemini-flash-latest` is a rolling alias that
always points at the current Flash model, so it should keep working; edit that
list if you ever need a different model.

## Deploying & updating the site

Hosting is **GitHub Pages**, published automatically by GitHub Actions
(`.github/workflows/deploy.yml`).

### Updating the live site

Just push to `main`:

```bash
git add -A
git commit -m "Describe your change"
git push
```

That triggers the workflow, which builds the app and publishes `dist/` to Pages.
It takes ~1 minute. Watch it at
https://github.com/gilicohen12/daily-reflections/actions — or, with the GitHub
CLI:

```bash
gh run watch --repo gilicohen12/daily-reflections
```

### How it was set up (for reference / rebuilding elsewhere)

- **Pages source** is set to **GitHub Actions** (not a branch). This was enabled
  once via the API; in the GitHub UI it's under **Settings → Pages → Build and
  deployment → Source: GitHub Actions**.
- The site is served from a sub-path (`/daily-reflections/`), so `vite.config.ts`
  sets `base: "/daily-reflections/"`. **If you rename the repo**, update `base`
  to match the new name (or set it to `"/"` if you move to a custom domain or a
  `<username>.github.io` root repo), then commit and push.
- The workflow needs `pages: write` and `id-token: write` permissions — already
  declared in the workflow file.

### First-time Pages setup on a fresh repo

If you ever recreate the repo from scratch, the very first Actions run can fail
at "Configure Pages" because the default token can't create the Pages site yet.
Enable Pages once, then re-run:

```bash
gh api --method POST /repos/<user>/<repo>/pages -f build_type=workflow
gh run rerun <run-id> --repo <user>/<repo>
```

## Installing on your iPhone

1. Open the live site in **Safari**:
   https://gilicohen12.github.io/daily-reflections/
2. Tap the **Share** button → **Add to Home Screen** → **Add**.
3. Launch it from the home-screen icon. It opens full-screen like a native app
   and works offline (a service worker caches it after the first load).

When you push an update, the app updates itself in the background the next time
you open it (it may take one extra launch to show the newest version — see
Troubleshooting).

## Your data & privacy

- All reflections, favorites, and your Gemini key live in the browser's
  `localStorage` **on that one device**. Nothing is uploaded or synced.
- Because it's per-device, entries on your phone and on a laptop are separate,
  and clearing Safari's website data (or deleting the home-screen app) erases
  them. There is no backup built in yet.
- The only outbound network call is to Google Gemini, and only when you tap the
  class-ideas button.

## Troubleshooting

- **The site didn't update after I pushed.** Check the Actions run finished
  successfully. If it did, the PWA may still be showing a cached version — close
  and reopen the app, or pull-to-refresh; the service worker updates in the
  background and applies on the next launch.
- **"Gemini error: … no longer available."** The model was retired. The app
  falls back automatically, but you can also set a current model name in the
  `MODELS` list in `src/gemini.ts`.
- **"That API key was rejected."** Re-check the key at
  https://aistudio.google.com/apikey and re-enter it via **Change API key**.
- **Blank page / 404 on assets after renaming the repo.** The `base` in
  `vite.config.ts` no longer matches the repo name — fix it and push.
- **Actions run fails at "Configure Pages" on a new repo.** See
  [First-time Pages setup](#first-time-pages-setup-on-a-fresh-repo).
