import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * `supabase` is null until you add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * to your .env. The admin portal detects this and shows a setup notice instead
 * of crashing, so the public storefront always runs.
 */
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

export const isSupabaseReady = Boolean(supabase);

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env."
    );
  }
  return supabase;
}
