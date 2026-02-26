import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gojgcksmhlxtuqhkylcy.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_1ciI0KDhicZvb4tbVETS8w_yEIJEr2W'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
