import { supabase } from '../supabase';
import { redirect } from 'next/navigation';

// Get the current user
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

// Require a user to be authenticated
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect('/account?error=unauthorized');
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
