import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * True when valid Supabase credentials exist in the environment.
 * When false, the app runs in DEMO MODE: the data layer
 * (src/services/api.js) uses a local persisted store instead of
 * the database, so the website is fully browsable/demoable.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-ref')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Storage bucket names (must match supabase/schema.sql)
export const STORAGE_BUCKETS = {
  gallery: 'gallery',
  rooms: 'room-images',
}
