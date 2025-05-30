// Export the main Supabase client
export { supabase } from './client';

// For backward compatibility, export the same client as serverSupabase
export { supabase as serverSupabase } from './client';

// Export types if needed
export type { User, Session } from '@supabase/supabase-js';
