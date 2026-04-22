# Team Pulse

Team Pulse is a live-demo mood tracker for a tech audience. Tap one of five vibes, write the check-in to Supabase, and show the running all-time totals on a live chart.

Live URL: `https://Chili36.github.io/team-pulse-demo/`

## Product contract

- Verified table: `moods`
- Verified columns used by the app: `id`, `vibe`, `session_id`, `created_at`
- Allowed `vibe` values only: `😄`, `😊`, `😐`, `😟`, `😢`
- One tap creates one mood record.
- The chart shows all-time counts per vibe across every session.

## Acceptance criteria

- A user can submit exactly one of the five canonical vibes.
- The app writes only the verified schema fields needed for the insert.
- Product copy stays concise and live-demo friendly.
- The chart language describes all-time counts, not a single room or session.
- A push to `main` deploys the Vite build to GitHub Pages.

## Local run

```sh
npm install
npm run dev
npm run build
```

## Deploy

- Repo: `Chili36/team-pulse-demo`
- GitHub Pages base path: `/team-pulse-demo/`
- Workflow: `.github/workflows/deploy.yml`

## Published contract

Lucy published the verified Supabase contract in `src/supabaseClient.js`.
