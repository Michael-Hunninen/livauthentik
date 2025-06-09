'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

// Types
interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  rewardsPoints: number;
}

interface RewardInfo {
  points: number;
  level: string;
  nextLevel: string;
  pointsToNextLevel: number;
  tier: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

interface Subscription {
  id: string;
  product: string;
  frequency: string;
  nextDelivery: string;
  price: number;
  status: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rewardsInfo, setRewardsInfo] = useState<RewardInfo | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  const [loading, setLoading] = useState({
    user: true,
    rewards: true,
    orders: false,
    subscriptions: false
  });
  
  const [error, setError] = useState({
    user: null as string | null,
    rewards: null as string | null,
    orders: null as string | null,
    subscriptions: null as string | null
  });

  const router = useRouter();
  // Using centralized Supabase client instead of creating new instances
  
  // Check authentication and fetch user data
  const fetchUser = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, user: true }));
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('No active session, using mock user data');
        
        // Use mock user data instead of redirecting
        setUser({
          name: 'Guest User',
          email: 'guest@livauthentik.com',
          memberSince: new Date().toLocaleDateString(),
          rewardsPoints: 150
        });
        
        // Set up mock rewards data too
        setRewardsInfo({
          points: 150,
          level: 'Bronze',
          nextLevel: 'Silver',
          pointsToNextLevel: 350,
          tier: 'Bronze'
        });
        
        // Still load other dashboard components
        return;
      }

      console.log('Session found:', session.user.email);
      
      // Just use session data directly since we don't have profile tables
      const username = session.user.email?.split('@')[0] || 'Member';
      const email = session.user.email || '';
      const createdAt = session.user.created_at || Date.now();
      
      console.log('Setting user data from session:', {
        username,
        email,
        createdAt: new Date(createdAt).toLocaleDateString()
      });
      
      setUser({
        name: username,
        email: email,
        memberSince: new Date(createdAt).toLocaleDateString(),
        rewardsPoints: 0 // Will be updated from rewards data
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(prev => ({ 
        ...prev, 
        user: err instanceof Error ? err.message : 'Failed to load user data'
      }));
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  }, [router, supabase]);
  
  // Fetch rewards data with proper authentication and error handling
  const fetchRewards = useCallback(async (skipLoadingState = false, retryCount = 0) => {
    if (!skipLoadingState) {
      setLoading(prev => ({ ...prev, rewards: true }));
    }
    setError(prev => ({ ...prev, rewards: null }));
    
    try {
      console.log(`Fetching rewards data... (attempt ${retryCount + 1})`);
      
      // Check authentication first
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error when checking session:', authError);
        if (retryCount < 2) {
          console.log(`Retrying auth check (${retryCount + 1}/2)...`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchRewards(skipLoadingState, retryCount + 1);
        } else {
          console.log('Auth check failed after retries, redirecting to login');
          router.push('/account?tab=login');
          return;
        }
      }
      
      if (!session) {
        console.log('No active session for rewards, using mock data');
        
        // Use mock rewards data instead of redirecting
        const mockRewardsData = {
          points: 150,
          level: 'Bronze',
          nextLevel: 'Silver',
          pointsToNextLevel: 350,
          tier: 'Bronze',
        };
        
        setRewardsInfo({
          points: mockRewardsData.points,
          level: mockRewardsData.level,
          nextLevel: mockRewardsData.nextLevel,
          pointsToNextLevel: mockRewardsData.pointsToNextLevel,
          tier: mockRewardsData.tier
        });
        
        // Update user's mock rewards points
        setUser(prev => prev ? {...prev, rewardsPoints: mockRewardsData.points} : {
          name: 'Guest User',
          email: 'guest@livauthentik.com',
          memberSince: new Date().toLocaleDateString(),
          rewardsPoints: mockRewardsData.points
        });
        
        return;
      }
      
      console.log('Auth session confirmed, fetching rewards data...');
      
      try {
        // Make sure we have the access token
        console.log('Using access token for API request:', session.access_token.substring(0, 15) + '...');
        
        const response = await fetch('/api/user/rewards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${session.access_token}` // Add auth token explicitly
          },
          credentials: 'include' // Important for sending cookies
        });
        
        console.log('Rewards API response status:', response.status);
        
        if (!response.ok) {
          let errorMessage = `HTTP error ${response.status}`;
          
          try {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Could not parse error response:', parseError);
          }
          
          if (response.status === 401) {
            if (retryCount < 2) {
              console.log(`Auth token may be stale, retrying (${retryCount + 1}/2)...`);
              // Force refresh the session
              await supabase.auth.refreshSession();
              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
              return fetchRewards(skipLoadingState, retryCount + 1);
            } else {
              console.log('Auth failed after retries - using mock data');
              // Use mock data instead of redirecting
              const mockRewardsData = {
                points: 150,
                level: 'Bronze',
                nextLevel: 'Silver',
                pointsToNextLevel: 350,
                tier: 'Bronze',
                transactions: [],
                redeemableRewards: [],
                redemptionHistory: []
              };
              
              setRewardsInfo({
                points: mockRewardsData.points,
                level: mockRewardsData.level,
                nextLevel: mockRewardsData.nextLevel,
                pointsToNextLevel: mockRewardsData.pointsToNextLevel,
                tier: mockRewardsData.tier
              });
              
              setUser(prev => prev ? {...prev, rewardsPoints: mockRewardsData.points} : null);
              return;
            }
          }
          
          throw new Error(errorMessage);
        }
        
        const rewardsData = await response.json();
        console.log('Received rewards data:', rewardsData);
        
        if (!rewardsData || typeof rewardsData !== 'object') {
          throw new Error('Invalid response format from server');
        }
        
        // Set rewards info with fallbacks for each property
        setRewardsInfo({
          points: typeof rewardsData.points === 'number' ? rewardsData.points : 0,
          level: rewardsData.level || rewardsData.tier || 'Bronze',
          nextLevel: rewardsData.nextLevel || 'Silver',
          pointsToNextLevel: typeof rewardsData.pointsToNextLevel === 'number' ? 
            rewardsData.pointsToNextLevel : 500,
          tier: rewardsData.tier || rewardsData.level || 'Bronze'
        });
        
        // Update user's rewards points if we have a user object
        if (rewardsData.points !== undefined) {
          setUser(prev => prev ? {...prev, rewardsPoints: rewardsData.points} : null);
        }
        
      } catch (fetchError) {
        console.error('Error in reward data fetch:', fetchError);
        
        if (retryCount < 2) {
          console.log(`Retrying rewards fetch (${retryCount + 1}/2)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchRewards(skipLoadingState, retryCount + 1);
        }
        
        throw fetchError; // Re-throw after retries are exhausted
      }
      
    } catch (err) {
      console.error('Error fetching rewards:', err);
      setError(prev => ({ 
        ...prev, 
        rewards: err instanceof Error ? err.message : 'Failed to load rewards data'
      }));
      
      // Set default rewards info even on error
      if (!rewardsInfo) {
        setRewardsInfo({
          points: 0,
          level: 'Bronze',
          nextLevel: 'Silver',
          pointsToNextLevel: 500,
          tier: 'Bronze'
        });
      }
    } finally {
      setLoading(prev => ({ ...prev, rewards: false }));
    }
  }, [router, supabase.auth]);

  // Initialize user data and rewards
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  // Fetch rewards only once after user is authenticated
  useEffect(() => {
    if (user && !rewardsInfo) {
      fetchRewards();
    }
  }, [user, fetchRewards]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto"
    >
      {/* Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-100/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-amber-300/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/20 to-amber-300/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                {loading.user ? '?' : user?.name?.charAt(0) || '?'}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
                  Welcome back, <span className="text-amber-600">{loading.user ? 'Member' : (user?.name?.split(' ')[0] || 'Member')}</span>
                </h1>
                <p className="text-amber-800/70">{user?.email || 'Loading...'}</p>
              </div>
            </div>
            <p className="text-amber-800/80 mt-2 max-w-2xl">
              Here's an overview of your account activity, orders, and rewards.
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/products"
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Shop Now
            </Link>
            <Link 
              href="/account/dashboard/rewards"
              className="px-4 py-2.5 rounded-lg bg-white/80 border border-amber-200 hover:bg-white transition-colors shadow-sm text-sm font-medium flex items-center gap-2 text-amber-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              View Rewards
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Points Card */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-gradient-to-br from-white to-amber-50/30 rounded-xl p-6 border border-amber-100/30 relative overflow-hidden shadow-sm"
        >
          <h3 className="text-lg font-medium text-amber-900 mb-1">Your Points</h3>
          
          {loading.rewards && (
            <div className="animate-pulse flex flex-col">
              <div className="h-8 w-24 bg-amber-100/50 rounded mb-2"></div>
              <div className="h-4 w-16 bg-amber-50/80 rounded"></div>
            </div>
          )}
          
          {!loading.rewards && rewardsInfo && (
            <div className="mt-2">
              <div className="text-3xl font-bold text-amber-600 mb-1">{rewardsInfo.points.toLocaleString()}</div>
              <div className="text-sm text-amber-800/70">{rewardsInfo.level} Level</div>
              <div className="mt-3 bg-amber-50/50 h-2 rounded-full w-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (rewardsInfo.points / (rewardsInfo.points + rewardsInfo.pointsToNextLevel)) * 100)}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-amber-700/70">
                <span>{rewardsInfo.level}</span>
                <span>{rewardsInfo.pointsToNextLevel} points to {rewardsInfo.nextLevel}</span>
              </div>
            </div>
          )}
          
          {!loading.rewards && error.rewards && (
            <div className="flex flex-col items-center py-4">
              <div className="text-amber-800/80 mb-2 text-center">
                Failed to load points
              </div>
              <button
                onClick={() => fetchRewards(false)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Link 
              href="/account/dashboard/rewards" 
              className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 hover:bg-amber-50/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">View Rewards</p>
                <p className="text-xs text-gray-500">Check points and benefits</p>
              </div>
            </Link>
            
            <Link 
              href="/account/orders" 
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Order History</p>
                <p className="text-xs text-gray-500">View past orders</p>
              </div>
            </Link>
            
            <Link 
              href="/account/profile" 
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Profile Settings</p>
                <p className="text-xs text-gray-500">Update your information</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Devotion Experience Tracking */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Wellness Journey</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fitness Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 border border-emerald-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/30 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-emerald-100/50 transition-all duration-300"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Fitness</h3>
                <p className="text-gray-600 text-sm mb-3">Track your strength, cardio, and flexibility progress</p>
                
                {/* Fitness Stats */}
                <div className="mb-4 flex justify-between gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">12</div>
                    <div className="text-xs text-emerald-700/70">Workouts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">68%</div>
                    <div className="text-xs text-emerald-700/70">Completion</div>
                  </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-emerald-800 mb-1">
                    <span>Overall Progress</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Link 
                    href="/account/dashboard/devotion/fitness/strength-fundamentals"
                    className="text-sm text-emerald-700 hover:text-emerald-800 flex items-center gap-2 mb-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Strength Fundamentals</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Card */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/30 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-amber-100/50 transition-all duration-300"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 17V9" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17V5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17v-3" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Nutrition</h3>
                <p className="text-gray-600 text-sm mb-3">Explore meal plans and track your dietary progress</p>
                
                {/* Nutrition Stats */}
                <div className="mb-4 flex justify-between gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">9</div>
                    <div className="text-xs text-amber-700/70">Meal Plans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">54%</div>
                    <div className="text-xs text-amber-700/70">Adherence</div>
                  </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-amber-800 mb-1">
                    <span>Weekly Completion</span>
                    <span>5/7</span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Link 
                    href="/account/dashboard/devotion/meals/clean-eating"
                    className="text-sm text-amber-700 hover:text-amber-800 flex items-center gap-2 mb-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Clean Eating Plan</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mind Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100/30 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-indigo-100/50 transition-all duration-300"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Mind</h3>
                <p className="text-gray-600 text-sm mb-3">Mindfulness practices and mental wellness tracking</p>
                
                {/* Mind Stats */}
                <div className="mb-4 flex justify-between gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">15</div>
                    <div className="text-xs text-indigo-700/70">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">78%</div>
                    <div className="text-xs text-indigo-700/70">Consistency</div>
                  </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-indigo-800 mb-1">
                    <span>Focus Minutes</span>
                    <span>82/120</span>
                  </div>
                  <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Link 
                    href="/account/dashboard/devotion/coaching/mindful-mornings"
                    className="text-sm text-indigo-700 hover:text-indigo-800 flex items-center gap-2 mb-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Mindful Mornings</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {(loading.user || !user) ? (
            <div className="p-8 text-center">
              <div className="animate-pulse mx-auto h-12 w-12 rounded-full bg-gray-100"></div>
              <p className="mt-4 text-gray-500">Loading your activity...</p>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-600 text-center">
                Welcome to your dashboard! Here you can manage your account, 
                view rewards, and track your wellness journey.
              </p>
              <div className="flex justify-center mt-4">
                <Link
                  href="/products"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
