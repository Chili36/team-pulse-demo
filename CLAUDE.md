# Team Pulse -- Architectural Decisions

## Project Stack
- **Vite** (React template) with base path `/team-pulse-demo/`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no tailwind.config.js or postcss.config.js needed)
- **Supabase** for backend (REST only, no websockets)
- **Recharts** for data visualization

## File Structure
```
src/
  main.jsx          -- entry point (imports index.css, renders App)
  index.css         -- Tailwind v4 directive only (@import "tailwindcss")
  supabaseClient.js -- configured Supabase client (exported as `supabase`)
  App.jsx           -- main app component (owned by UX agent)
  hooks/
    useMoods.js     -- data hook for mood CRUD + polling
```

## Data Layer: useMoods Hook

### Import
```js
import { useMoods } from './hooks/useMoods'
```

### Interface
```js
const { moods, submitMood, loading } = useMoods()
```

- **moods** -- `Array<Mood>`, most recent first (max 50 entries)
- **submitMood(vibe)** -- inserts a mood then re-fetches; vibe is an emoji string
- **loading** -- `boolean`, true until the first fetch completes

### Mood Object Shape
```js
{
  id: number,           // auto-generated primary key
  vibe: string,         // emoji: one of "😄" "😊" "😐" "😟" "😢"
  session_id: string,   // uuid v4, unique per browser session
  created_at: string    // ISO 8601 timestamp from Supabase
}
```

### Valid Vibe Values
`"😄"` `"😊"` `"😐"` `"😟"` `"😢"`

## Session ID Approach
- Generated once per browser session via `crypto.randomUUID()`
- Stored in `sessionStorage` under key `pulse_session_id`
- Persists across page refreshes within the same tab, resets when tab closes
- Passed with every mood insert to identify the submitter without auth

## Realtime Strategy
- Polling every 5 seconds via `setInterval` calling `fetchMoods()`
- No Supabase Realtime/WebSocket channels used -- REST only
- Poll auto-starts on mount, auto-cleans on unmount

## Supabase Configuration
- Client exported from `src/supabaseClient.js` as named export `supabase`
- Uses the publishable anon key (safe for client-side)
- Table: `moods` (columns: id, vibe, session_id, created_at)

## Tailwind CSS v4 Notes
- Using the Vite plugin (`@tailwindcss/vite`), NOT PostCSS
- No `tailwind.config.js` or `postcss.config.js` files exist
- All Tailwind configuration is done via CSS (in `src/index.css` or component styles)
- Just `@import "tailwindcss"` in index.css is sufficient
