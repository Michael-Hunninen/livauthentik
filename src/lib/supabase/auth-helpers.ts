import { supabase } from './client';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Create a server-side Supabase client for API routes
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adkrrjokgpufehpxinsr.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk',
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// Get the current user - works in both client and server components
export async function getUser(headers?: { get(name: string): string | null }) {
  try {
    // For server components/API routes
    if (typeof window === 'undefined') {
      // If custom headers were provided (like from an API request)
      if (headers) {
        const authHeader = headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const supabaseServer = createServerSupabaseClient();
          const { data: { user }, error } = await supabaseServer.auth.getUser(token);
          if (error) throw error;
          return user;
        }
      }
      
      // Default server-side auth using cookies
      const supabaseServer = createServerSupabaseClient();
      const { data: { user }, error } = await supabaseServer.auth.getUser();
      if (error) throw error;
      return user;
    } 
    
    // For client components
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Require a user to be authenticated
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect('/account?tab=login&error=unauthorized');
  }
  return user;
}

// Get the current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}

// Require an active session
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect('/account?error=unauthorized');
  }
  return session;
}
