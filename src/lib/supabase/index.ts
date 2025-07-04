// Export the main Supabase client and helpers
export { 
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getUserSubscription,
  createCustomerPortalSession
} from './client';

// For backward compatibility, export the same client as serverSupabase
export { supabase as serverSupabase } from './client';

// Export types if needed
export type { User, Session } from '@supabase/supabase-js';
