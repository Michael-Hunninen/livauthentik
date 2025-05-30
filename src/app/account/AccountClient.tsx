'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, signIn, signUp } from '@/lib/supabase';

export default function AccountClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state for client-side check
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Show loading state until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set the initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams?.get('tab');
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
        // Sign in with email and password using our custom function
        const { data, error: signInError } = await signIn(email, password);

        if (signInError) {
          setError(signInError.message || 'Invalid login credentials');
          setIsLoading(false);
          return;
        }

        setSuccess('Sign in successful! Redirecting...');
        router.push('/account/dashboard');
      } else {
        // Sign up with email and password using our custom function
        const { data, error: signUpError } = await signUp(email, password);

        if (signUpError) {
          setError(signUpError.message || 'Error creating account');
          setIsLoading(false);
          return;
        }
        
        // If we have a name, update the user's profile
        if (name) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: name })
            .eq('id', data.user?.id);
            
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
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
                placeholder={isSignIn ? "your@email.com" : ""}
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
                minLength={6}
                placeholder={isSignIn ? "••••••••" : "At least 6 characters"}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignIn ? 'Signing in...' : 'Creating account...'}
                </>
              ) : isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {isSignIn && (
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Forgot password?
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError('');
                  setSuccess('');
                }} 
                className="text-accent hover:underline font-medium"
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
