'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import ActivityTrendsChart from '@/components/dashboard/ActivityTrendsChart';

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
  progressPercentage?: number;
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
          tier: rewardsData.tier || rewardsData.level || 'Bronze',
          progressPercentage: typeof rewardsData.progressPercentage === 'number' ? 
            rewardsData.progressPercentage : 0
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
        className="mb-8 p-[1px] rounded-2xl relative"
        style={{
          background: 'linear-gradient(135deg, rgba(202, 172, 142, 0.3), rgba(202, 172, 142, 0.1))',
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/10 to-transparent opacity-15 -z-10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#fffff0]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#fffff0]/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/3 blur-xl -z-10"></div>
        
        <div className="bg-gradient-to-br from-[#2f2828] via-[#613226] to-[#b37654] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-15"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#fffff0] to-[#caac8e] flex items-center justify-center text-gray-800 text-xl font-medium shadow-sm">
                    {loading.user ? '?' : user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#fffff0]">
                      Welcome back, <span className="text-[#caac8e]">{loading.user ? 'Member' : (user?.name?.split(' ')[0] || 'Member')}</span>
                    </h1>
                    <p className="text-[#fffff0]/90">{user?.email || 'Loading...'}</p>
                  </div>
                </div>
                <p className="text-[#fffff0]/80 mt-2 max-w-2xl">
                  Here's an overview of your account activity, orders, and rewards.
                </p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href="/products"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-devotionBrown/90 to-devotionBrown text-white hover:from-devotionBrown hover:to-devotionBrown/90 transition-all shadow-sm text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Shop Now
                </Link>
                <Link 
                  href="/account/dashboard/rewards"
                  className="px-4 py-2.5 rounded-lg bg-white/80 border border-devotionBrown/30 hover:bg-white transition-colors shadow-sm text-sm font-medium flex items-center gap-2 text-devotionBrown"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  View Rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Points Card */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-gradient-to-br from-white to-devotionBrown/5 rounded-xl p-6 border border-devotionBrown/10 relative overflow-hidden shadow-sm"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-1">Your Points</h3>
          
          {loading.rewards && (
            <div className="animate-pulse flex flex-col">
              <div className="h-8 w-24 bg-devotionBrown/20 rounded mb-2"></div>
              <div className="h-4 w-16 bg-devotionBrown/10 rounded"></div>
            </div>
          )}
          
          {!loading.rewards && rewardsInfo && (
            <div className="mt-2">
              <div className="text-3xl font-bold text-devotionBrown mb-1">{rewardsInfo.points.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{rewardsInfo.level} Level</div>
              <div className="mt-3 bg-devotionBrown/10 h-2 rounded-full w-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-devotionBrown/80 to-devotionBrown rounded-full"
                  style={{ width: `${rewardsInfo.progressPercentage !== undefined ? rewardsInfo.progressPercentage : 0}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-600 mb-4">
                <span>{rewardsInfo.level}</span>
                <span>{rewardsInfo.pointsToNextLevel} points to {rewardsInfo.nextLevel}</span>
              </div>
              
              {/* Rewards Section */}
              <div className="border-t border-devotionBrown/20 pt-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-devotionBrown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Next Reward
                </h4>
                
                <div className="relative overflow-hidden rounded-xl p-0.5 bg-gradient-to-r from-devotionBrown/30 via-devotionBrown/10 to-devotionBrown/30">
                  <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Free Shipping</h3>
                        <p className="text-sm text-gray-600">On your next order</p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-devotionBrown/10 text-devotionBrown">
                            {5000 - rewardsInfo.points} pts to unlock
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-devotionBrown/5 to-devotionBrown/20 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-devotionBrown/20 to-devotionBrown/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-devotionBrown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Link 
                    href="/account/dashboard/rewards" 
                    className="inline-flex items-center text-sm font-medium text-devotionBrown hover:text-devotionBrown/80 transition-colors"
                  >
                    View all rewards
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {!loading.rewards && error.rewards && (
            <div className="flex flex-col items-center py-4">
              <div className="text-gray-600 mb-2 text-center">
                Failed to load points
              </div>
              <button
                onClick={() => fetchRewards(false)}
                className="px-4 py-2 bg-gradient-to-r from-devotionBrown/80 to-devotionBrown text-white text-sm font-medium rounded-lg hover:from-devotionBrown hover:to-devotionBrown/90 transition-all duration-300 shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Activity Trends Chart */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white to-devotionBrown/5 rounded-xl p-6 border border-devotionBrown/10 shadow-sm relative overflow-hidden flex flex-col"
        >
          <div className="flex-1 min-h-[300px] h-full">
            <ActivityTrendsChart className="h-full" />
          </div>
        </motion.div>
      </div>

      {/* Devotion Experience Tracking */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Devotion Experience</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fitness Card */}
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100/30 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-teal-100/50 transition-all duration-300"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
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
                    <div className="text-2xl font-bold text-teal-700">12</div>
                    <div className="text-xs text-teal-800/70">Workouts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-700">68%</div>
                    <div className="text-xs text-teal-800/70">Completion</div>
                  </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-teal-800 mb-1">
                    <span>Overall Progress</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Link 
                    href="/account/dashboard/devotion/fitness/strength-fundamentals"
                    className="text-sm text-teal-700 hover:text-teal-800 flex items-center gap-2 mb-1.5 group-hover:translate-x-1 transition-transform"
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
          <div className="bg-gradient-to-br from-amber-50/80 to-white rounded-xl p-6 border border-amber-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/30 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-amber-100/50 transition-all duration-300"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-700">
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
                    <div className="text-2xl font-bold text-amber-700">9</div>
                    <div className="text-xs text-amber-800/70">Meals Logged</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700">86%</div>
                    <div className="text-xs text-amber-800/70">Daily Goals</div>
                  </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-amber-800 mb-1">
                    <span>Weekly Consistency</span>
                    <span>86%</span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Link 
                    href="/account/dashboard/devotion/nutrition/meal-plans"
                    className="text-sm text-amber-700 hover:text-amber-800 flex items-center gap-2 mb-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Meal Plans</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mindfulness Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100/30 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-gray-100/50 transition-all duration-300"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100/80 flex items-center justify-center text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Mindfulness</h3>
                <p className="text-gray-600 text-sm mb-3">Meditation, breathing exercises, and stress management</p>
                
                {/* Mindfulness Stats */}
                <div className="mb-4 flex justify-between gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">14</div>
                    <div className="text-xs text-gray-700/70">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">5</div>
                    <div className="text-xs text-gray-700/70">Day Streak</div>
                  </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>Monthly Goal</span>
                    <span>47%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-400 to-gray-300 rounded-full" style={{ width: '47%' }}></div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Link 
                    href="/account/dashboard/devotion/mindfulness/meditation"
                    className="text-sm text-gray-700 hover:text-gray-800 flex items-center gap-2 mb-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Start Meditation</span>
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
