import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

// Only initialize Supabase if we have the required environment variables
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
} else {
  // Create a mock client with no-op methods for build time
  console.warn('Supabase environment variables are not set. Using mock client.');
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      get user() { return null; },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: null, error: new Error('Supabase not initialized') }),
      insert: () => ({ data: null, error: new Error('Supabase not initialized') }),
      update: () => ({ data: null, error: new Error('Supabase not initialized') }),
      delete: () => ({ data: null, error: new Error('Supabase not initialized') }),
    }),
  } as unknown as SupabaseClient;
}

export { supabase };

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
