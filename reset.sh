#!/bin/bash

SUPABASE_URL="https://gojgcksmhlxtuqhkylcy.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_1ciI0KDhicZvb4tbVETS8w_yEIJEr2W"

echo "Killing tmux sessions..."
tmux kill-session -t team-pulse 2>/dev/null

echo "Killing stray vite processes..."
pkill -f "vite" 2>/dev/null

echo "Removing old GitHub repo..."
gh repo delete team-pulse-demo --yes 2>/dev/null

echo "Wiping database data..."
curl -s -X DELETE "${SUPABASE_URL}/rest/v1/moods?id=gt.0" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
echo "✅ Database wiped"

echo "Cleaning local workspace..."
find . -maxdepth 1 ! -name '.claude' ! -name 'reset.sh' ! -name '.' -exec rm -rf {} +

echo "------------------------------------------------"
echo "✅ READY FOR SHOWTIME"