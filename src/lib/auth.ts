import { createClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnon = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const sb = createClient(supabaseUrl, supabaseAnon);

export async function getSession(): Promise<Session | null> {
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function signInGoogle(): Promise<void> {
  const origin = window.location.origin;
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}
