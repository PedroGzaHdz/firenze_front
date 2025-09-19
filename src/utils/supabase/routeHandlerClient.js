import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cliente para route handlers (sin cookies, solo anon key)
export function createRouteHandlerSupabaseClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
