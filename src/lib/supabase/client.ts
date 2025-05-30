import { createBrowserClient } from '@supabase/ssr';

// These will be available in the browser, but only if they start with NEXT_PUBLIC_
const supabaseUrl = 'https://adkrrjokgpufehpxinsr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    throw new Error('Supabase client should only be created in the browser');
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export const supabase = createClient();
