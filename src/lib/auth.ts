import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const sb: SupabaseClient | null =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

export async function getSession(): Promise<Session | null> {
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function signInGoogle(): Promise<void> {
  if (!sb) return;
  const origin = window.location.origin;
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (!sb) return;
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}
