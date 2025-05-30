import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = 'https://adkrrjokgpufehpxinsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';

// Create a simple server client with direct configuration
export function createServerClient() {
  const cookieStore = cookies();
  
  try {
    // Create the client with minimal configuration
    return createServerComponentClient(
      { cookies: () => cookieStore },
      {
        supabaseUrl,
        supabaseKey,
        options: {
          global: {
            headers: { 'x-custom-header': 'livauthentik' }
          }
        }
      }
    );
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw error;
  }
}

export const supabase = createServerClient();
