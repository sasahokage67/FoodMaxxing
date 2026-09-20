import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const rawUrl = metaEnv.VITE_SUPABASE_URL || 'https://dclapqbgnynjxuwzkxgc.supabase.co';
const supabaseUrl: string = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey: string = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_18OkDI8SZk98lsvKDYMqvA_QHQwKvS0';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
