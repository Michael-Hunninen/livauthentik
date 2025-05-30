import { createBrowserClient } from '@supabase/ssr';

// These values are hardcoded for both development and production
const supabaseUrl = 'https://adkrrjokgpufehpxinsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';

export function createClient() {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    throw new Error('Supabase client should only be created in the browser');
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export const supabase = createClient();
