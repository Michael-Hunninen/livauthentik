'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set the initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setIsSignIn(false);
    } else if (tab === 'login') {
      setIsSignIn(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignIn) {
        // Sign in with email and password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || 'Invalid login credentials');
          setIsLoading(false);
          return;
        }

        setSuccess('Sign in successful! Redirecting...');
        router.push('/account/dashboard');
      } else {
        // Handle registration
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          setError(signUpError.message || 'Error creating account');
          setIsLoading(false);
          return;
        }


        setSuccess('Account created successfully! Please check your email to confirm your account.');
        setIsSignIn(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 } 
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background/90"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
      </div>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-6"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Your <span className="text-accent">Account</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {isSignIn 
              ? "Sign in to access your account and manage your orders." 
              : "Create an account to start your wellness journey with us."}
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-white/10 shadow-lg p-8"
        >
          <div className="flex mb-6 border-b border-border/10">
            <button 
              onClick={() => setIsSignIn(true)} 
              className={`flex-1 pb-3 font-medium text-sm ${isSignIn ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsSignIn(false)} 
              className={`flex-1 pb-3 font-medium text-sm ${!isSignIn ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'}`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-500">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                  required={!isSignIn}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                required
                placeholder={isSignIn ? "try: test@example.com" : ""}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                required
                placeholder={isSignIn ? "try: password" : ""}
              />
            </div>
            
            {isSignIn && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="#" className="text-accent hover:text-accent/80 transition-colors duration-300">
                    Forgot password?
                  </Link>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 bg-accent text-white rounded-lg shadow-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isSignIn ? "Sign In" : "Create Account"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsSignIn(!isSignIn)} 
                className="text-accent hover:text-accent/80 transition-colors duration-300"
              >
                {isSignIn ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
          
          {isSignIn && (
            <div className="mt-8 pt-6 border-t border-border/10">
              <p className="text-xs text-center text-muted-foreground mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center py-3 px-4 bg-background border border-border/20 rounded-lg hover:bg-accent/5 transition-all duration-300">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center py-3 px-4 bg-background border border-border/20 rounded-lg hover:bg-accent/5 transition-all duration-300">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
