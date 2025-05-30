import { createServerClient } from './server';
import { redirect } from 'next/navigation';

export async function getUser() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect('/account?error=unauthorized');
  }
  return user;
}

export async function getSession() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect('/account?error=unauthorized');
  }
  return session;
}
