import { createBrowserClient } from '@supabase/ssr';

// These values are hardcoded for both development and production
const supabaseUrl = 'https://adkrrjokgpufehpxinsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';

// Create a single supabase client for client-side use
export function createClient() {
  // Only create the client if we're in the browser
  if (typeof window !== 'undefined') {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return null;
    }
    
    return createBrowserClient(supabaseUrl, supabaseKey);
  }
  return null;
}

// Create the client instance
export const supabase = createClient();
