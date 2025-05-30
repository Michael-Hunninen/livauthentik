import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Use environment variables in development, hardcoded values in production
const getSupabaseUrl = () => {
  // In production, use hardcoded value
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://adkrrjokgpufehpxinsr.supabase.co';
  }
  // In development, use environment variable or fallback
  return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adkrrjokgpufehpxinsr.supabase.co';
};

const getSupabaseKey = () => {
  // In production, use hardcoded value
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';
  }
  // In development, use environment variable or fallback
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';
};

// Create a single supabase client for client-side use
export const supabase = typeof window !== 'undefined' 
  ? createSupabaseClient(getSupabaseUrl(), getSupabaseKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
