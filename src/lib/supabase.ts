import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// Subscription management
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, products(*)')
    .eq('user_id', userId)
    .single();
  
  return { subscription: data, error };
};

export const createCustomerPortalSession = async (customerId: string) => {
  const { data, error } = await supabase.functions.invoke('create-customer-portal-session', {
    body: { customerId },
  });
  
  return { url: data?.url, error };
};
