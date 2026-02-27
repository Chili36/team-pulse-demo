# Team Pulse Demo

Real-time team vibe tracker — measure how your team feels about agentic coding!

## Vibes

| Emoji | Meaning |
|-------|---------|
| 😄 | Very Excited |
| 😊 | Feeling Good |
| 😐 | Neutral |
| 😟 | Concerned |
| 😢 | Oh No, Losing My Job |

## Stack

- Vite + React + Tailwind CSS
- Recharts for visualization
- Supabase for real-time data

## Setup

1. Create a [Supabase](https://supabase.com) project
2. Create a `moods` table with columns: `id` (int8), `vibe` (text), `session_id` (uuid), `created_at` (timestamptz)
3. Copy `.env.example` to `.env` and fill in your Supabase URL and anon key

```bash
cp .env.example .env
npm install
npm run dev
```

Visit: http://localhost:5173/team-pulse-demo/

## Deployment

Deployed via GitHub Pages at: https://Chili36.github.io/team-pulse-demo/

The GitHub Actions workflow reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from repository secrets.
