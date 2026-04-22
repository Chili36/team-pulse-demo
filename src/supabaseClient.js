import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://gojgcksmhlxtuqhkylcy.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_1ciI0KDhicZvb4tbVETS8w_yEIJEr2W'
export const MOODS_TABLE = 'moods'
export const MOOD_COLUMNS = 'id, vibe, session_id, created_at'
export const ALLOWED_VIBES = ['😄', '😊', '😐', '😟', '😢']

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function insertMood({ vibe, sessionId }) {
  if (!ALLOWED_VIBES.includes(vibe)) {
    throw new Error(`Unsupported vibe: ${vibe}`)
  }

  const { data, error } = await supabase
    .from(MOODS_TABLE)
    .insert({ vibe, session_id: sessionId })
    .select(MOOD_COLUMNS)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function listMoodEvents(limit = 100) {
  const { data, error } = await supabase
    .from(MOODS_TABLE)
    .select(MOOD_COLUMNS)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw error
  }

  return data ?? []
}
