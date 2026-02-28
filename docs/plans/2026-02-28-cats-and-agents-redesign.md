# Cats & Agents — Redesign

## Summary

Rename the app from "Team Pulse" to "Cats & Agents" and overhaul the visual design from generic dark-mode AI aesthetic to a warm, playful "Cat Cafe Bulletin Board" style.

## Design Direction

Playful & quirky. The app should feel like a cozy cat cafe's community board — warm cream backgrounds, pinned-note style cards, hand-crafted feeling. The biggest departure from typical AI-generated design is the warmth and slight imperfection.

## Color Palette

| Role | Value | Description |
|------|-------|-------------|
| Page background | `#faf7f2` | Warm cream |
| Card background | `#ffffff` | White |
| Card shadow | `rgba(120, 80, 40, 0.08)` | Warm soft shadow |
| Primary accent | `#e06050` | Warm coral (buttons, highlights) |
| Secondary accent | `#6b9e7a` | Sage green (success states) |
| Text primary | `#3d2e1f` | Dark warm brown |
| Text muted | `#8b7355` | Warm gray-brown |
| Borders | `#e8ddd0` | Soft warm beige |

## Component Changes

### Background (App.jsx)
- Replace `bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950` with warm cream
- Add subtle CSS dot/grid texture pattern (no image assets)
- Remove all `blur-3xl` radial glow divs

### Header
- Title: "Cats & Agents" in bold warm brown — no gradient text
- Replace `💓` bounce emoji with `🐾`
- Subtitle stays, restyled in muted brown
- Remove glowing pulse ring
- Divider: dashed line or paw prints instead of gradient bar

### MoodSelector
- Card: white background, visible beige border, soft warm shadow
- Optional slight CSS rotation for pinned-note feel
- Cat emojis stay (`😻 😺 🐱 🙀 😿`)
- Hover: warm highlight instead of `bg-white/10`
- Submit button: warm coral, solid, rounded
- Comment input: cream background, beige border

### MoodChart
- Bar colors: warm palette (keep existing per-vibe colors, they're already warm)
- Card: white with beige border
- Tooltip: cream background, brown text
- Axis text: warm brown
- Swap `📊` icon for `📋` or `🐾`

### VibeFeed
- Entries: white/cream background, soft shadow, warm borders
- AI agent entries: keep colored left border, warm backgrounds
- Swap `⚡` header icon for `📌` or `✨`

### Footer
- Warm muted brown text
- Replace gradient line with simple divider
- Update copy to match new branding

### Typography
- System font stack with `ui-rounded` preference
- All text colors: warm browns instead of grays
- Dark text on light backgrounds throughout

## What Stays the Same

- Component structure and layout (grid, flex patterns)
- Recharts library and chart type
- Data flow, hooks, Supabase integration
- Cat emojis and AI agent personas
- All functionality: voting, comments, polling

## Files to Modify

1. `index.html` — title to "Cats & Agents"
2. `src/index.css` — add texture pattern, global warm styles
3. `src/App.jsx` — background, layout chrome, footer
4. `src/components/Header.jsx` — new branding, remove glow effects
5. `src/components/MoodSelector.jsx` — warm card styling, button colors
6. `src/components/MoodChart.jsx` — warm chart theme, card styling
7. `src/components/VibeFeed.jsx` — warm feed entry styling
