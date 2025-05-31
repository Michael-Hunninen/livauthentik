import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase client with your project's URL and service role key
const supabaseUrl = 'https://adkrrjokgpufehpxinsr.supabase.co';
// This is a service role key - in production, this should be kept secure and not committed to version control
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MjU1MDQxMywiZXhwIjoxOTk4MTI2NDEzfQ.9o8tQ-9tXw5rXxwXQkXQXfXxXQxXQxXQxXQxXQxXQxXQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    user_metadata: {
      name: 'Test User',
      first_name: 'Test',
      last_name: 'User',
    },
    email_confirm: true, // Auto-confirm the email
  };

  try {
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          first_name: testUser.user_metadata.first_name,
          last_name: testUser.user_metadata.last_name,
        },
        emailRedirectTo: 'http://localhost:3000/account',
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists, signing in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password,
        });

        if (signInError) {
          throw signInError;
        }

        console.log('Successfully signed in existing user:', signInData.user.email);
        return signInData.user;
      }
      throw authError;
    }

    console.log('Successfully created test user:', authData.user?.email);
    return authData.user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

// Run the function
createTestUser()
  .then((user) => {
    console.log('Test user created/signed in successfully!');
    console.log('Email:', user?.email);
    console.log('Password: password123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create test user:', error);
    process.exit(1);
  });
