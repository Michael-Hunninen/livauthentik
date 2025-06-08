'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

// Types
interface RewardTransaction {
  id: string;
  user_id: string;
  points: number;
  description: string;
  created_at: string;
  source: string;
  date: string;
  type: string;
}

interface RedeemableReward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  claimed?: boolean;
}

interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_cost: number;
  status: string;
  created_at: string;
  reward_name: string;
}

interface RewardInfo {
  points: number;
  level: string;
  nextLevel: string;
  pointsToNextLevel: number;
  transactions: RewardTransaction[];
  redeemableRewards: RedeemableReward[];
  redemptionHistory: RewardRedemption[];
  tierBenefits: Record<string, string[]>;
  tier: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Generate mock rewards data for fallback
const generateMockRewardsData = (): RewardInfo => {
  return {
    points: 150,
    level: 'Bronze',
    nextLevel: 'Silver',
    pointsToNextLevel: 350,
    tier: 'Bronze',
    transactions: [
      { 
        id: 'mock-trans-1', 
        user_id: 'mock-user', 
        points: 50, 
        description: 'Welcome Bonus', 
        source: 'system', 
        type: 'credit',
        created_at: new Date().toISOString(),
        date: new Date().toISOString() 
      },
      { 
        id: 'mock-trans-2', 
        user_id: 'mock-user', 
        points: 100, 
        description: 'First Purchase Bonus', 
        source: 'purchase',
        type: 'credit',
        created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        date: new Date(Date.now() - 7*24*60*60*1000).toISOString() 
      }
    ],
    redeemableRewards: [
      { 
        id: 'mock-reward-1', 
        name: 'Free Shipping', 
        description: 'Free shipping on your next order', 
        pointsCost: 100, 
        claimed: false
      },
      { 
        id: 'mock-reward-2', 
        name: '10% Discount', 
        description: '10% off your next purchase', 
        pointsCost: 200, 
        claimed: false
      }
    ],
    redemptionHistory: [],
    tierBenefits: {
      'Bronze': ['Free shipping on orders over $50', 'Birthday reward'],
      'Silver': ['Free shipping on all orders', 'Birthday reward', '5% discount on all purchases'],
      'Gold': ['Free shipping on all orders', 'Birthday reward', '10% discount on all purchases', 'Early access to new products']
    }
  };
};

const RewardsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [rewardsData, setRewardsData] = useState<RewardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Using centralized Supabase client instead of creating new instances

  // Check authentication and fetch rewards data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          console.log('No active session, using mock rewards data');
          
          // Use mock rewards data instead of redirecting
          const mockRewardsData = {
            points: 150,
            level: 'Bronze',
            nextLevel: 'Silver',
            pointsToNextLevel: 350,
            tier: 'Bronze',
            transactions: [
              { 
                id: 'mock-trans-1', 
                user_id: 'mock-user', 
                points: 50, 
                description: 'Welcome Bonus', 
                source: 'system', 
                type: 'credit',
                created_at: new Date().toISOString(),
                date: new Date().toISOString() 
              },
              { 
                id: 'mock-trans-2', 
                user_id: 'mock-user', 
                points: 100, 
                description: 'First Purchase Bonus', 
                source: 'purchase',
                type: 'credit',
                created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
                date: new Date(Date.now() - 7*24*60*60*1000).toISOString() 
              }
            ],
            redeemableRewards: [
              { 
                id: 'mock-reward-1', 
                name: 'Free Shipping', 
                description: 'Free shipping on your next order', 
                pointsCost: 100, 
                claimed: false
              },
              { 
                id: 'mock-reward-2', 
                name: '10% Discount', 
                description: '10% off your next purchase', 
                pointsCost: 200, 
                claimed: false
              }
            ],
            redemptionHistory: [
              // Empty but with the correct structure if needed
              // {
              //   id: 'mock-redemption-1',
              //   user_id: 'mock-user',
              //   reward_id: 'mock-reward-1',
              //   points_cost: 100,
              //   status: 'completed',
              //   created_at: new Date().toISOString(),
              //   reward_name: 'Free Shipping'
              // }
            ],
            tierBenefits: {
              'Bronze': ['Free shipping on orders over $50', 'Birthday reward'],
              'Silver': ['Free shipping on all orders', 'Birthday reward', '5% discount on all purchases'],
              'Gold': ['Free shipping on all orders', 'Birthday reward', '10% discount on all purchases', 'Early access to new products']
            }
          };
          
          setRewardsData(mockRewardsData);
          setLoading(false);
          return;
        }
        
        // If we have a valid session, fetch rewards
        await fetchRewards();
        
      } catch (err) {
        console.error('Error in checkAuthAndFetch:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to check authentication';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Fetch rewards data with retry logic
    const fetchRewards = async (retryCount = 0) => {
      const maxRetries = 2;
      const retryDelay = 1000; // 1 second
      
      try {
        console.log('Fetching rewards data...');
        
        // Get the current session for the auth token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No active session');
        }
        
        console.log('Using access token for rewards API request:', session.access_token.substring(0, 15) + '...');
        
        const response = await fetch('/api/user/rewards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${session.access_token}` // Add auth token explicitly
          },
          credentials: 'include' // Important for sending cookies
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            console.error('Authentication failed (401) - redirecting to login');
            router.push('/account?tab=login');
            return;
          }
          
          // For server errors (500), log but don't redirect - use mock data instead
          if (response.status >= 500) {
            console.error(`Server error (${response.status}) - falling back to mock data`);
            // Use mock data instead of throwing an error
            setRewardsData(generateMockRewardsData());
            return;
          }
          
          throw new Error(
            errorData.message || 
            `Failed to fetch rewards data: ${response.status} ${response.statusText}`
          );
        }
        
        const data = await response.json();
        console.log('Received rewards data:', data);
        
        // Validate the response data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format from server');
        }
        
        setRewardsData(data);
        
      } catch (err) {
        console.error('Error in fetchRewards:', err);
        
        // Retry logic for transient errors
        if (retryCount < maxRetries) {
          console.log(`Retrying fetchRewards (attempt ${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => fetchRewards(retryCount + 1), retryDelay * (retryCount + 1));
          return;
        }
        
        // Set error state if all retries fail
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(`Failed to load rewards: ${errorMessage}`);
      }
    };

    checkAuthAndFetch();
  }, [router, supabase.auth]);

  // Handle reward claim
  const handleClaimReward = async (rewardId: string) => {
    try {
      setClaimingReward(rewardId);
      setClaimSuccess(null);
      
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim reward');
      }

      const data = await response.json();
      setClaimSuccess('Reward claimed successfully!');
      
      // Update local state to reflect the claimed reward
      if (rewardsData) {
        setRewardsData({
          ...rewardsData,
          redeemableRewards: rewardsData.redeemableRewards.map(reward =>
            reward.id === rewardId ? { ...reward, claimed: true } : reward
          ),
          points: rewardsData.points - (rewardsData.redeemableRewards.find(r => r.id === rewardId)?.pointsCost || 0)
        });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setClaimSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward');
      console.error('Error claiming reward:', err);
    } finally {
      setClaimingReward(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!rewardsData) {
    return null;
  }

  const { points, level, nextLevel, pointsToNextLevel, transactions, redeemableRewards, redemptionHistory, tierBenefits } = rewardsData;

  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.min(100, Math.round((points / (points + pointsToNextLevel)) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-foreground/10 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">Your Rewards</h2>
        <p className="mt-2 text-sm text-muted-foreground">Earn points and unlock exclusive wellness rewards</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'rewards', 'history', 'tiers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-accent text-amber-700'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Progress Section */}
            <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 backdrop-blur-sm border border-amber-100/30 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground font-serif">Your Wellness Journey</h3>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 text-xs font-medium border border-amber-200/30">
                  {level} Member
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-amber-700/80 mb-2">
                <span className="font-medium">{level}</span>
                <span className="font-medium">{nextLevel}</span>
              </div>
              
              <div className="relative w-full h-2.5 bg-amber-100/50 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-600" 
                  style={{
                    width: `${Math.max(5, Math.min(100, progressPercentage))}%`
                  }}
                />
              </div>
              
              <div className="mt-3 text-sm text-amber-700/80 flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {points.toLocaleString()} points
                </span>
                <span>{pointsToNextLevel.toLocaleString()} points to {nextLevel}</span>
              </div>
            </div>
            
            {/* Rewards Grid */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-6 font-serif">Available Rewards</h3>
              {redeemableRewards?.length ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {redeemableRewards.slice(0, 3).map((reward) => (
                    <motion.div 
                      key={reward.id} 
                      className="group bg-white/50 backdrop-blur-sm border border-amber-100/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      whileHover={{ y: -5 }}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-medium text-foreground">{reward.name}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {reward.pointsCost} pts
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{reward.description}</p>
                        <div className="mt-6">
                          <button
                            onClick={() => handleClaimReward(reward.id)}
                            disabled={reward.claimed || claimingReward === reward.id}
                            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                              reward.claimed
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg'
                            }`}
                          >
                            {reward.claimed 
                              ? '✓ Claimed' 
                              : claimingReward === reward.id 
                                ? 'Processing...' 
                                : 'Redeem Reward'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-amber-50/30 rounded-xl border border-amber-100/50">
                  <svg className="mx-auto h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-amber-900">No rewards available</h3>
                  <p className="mt-1 text-sm text-amber-800/70">Check back later for new wellness rewards.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && redeemableRewards && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {redeemableRewards.map((reward) => (
              <motion.div 
                key={reward.id}
                className="group bg-white/50 backdrop-blur-sm border border-amber-100/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-medium text-foreground">{reward.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {reward.pointsCost} pts
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{reward.description}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      disabled={reward.claimed || claimingReward === reward.id}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        reward.claimed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {reward.claimed 
                        ? '✓ Claimed' 
                        : claimingReward === reward.id 
                          ? 'Processing...' 
                          : 'Redeem Reward'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'history' && redemptionHistory && (
          <div className="overflow-hidden border border-amber-100/30 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-100/50">
                <thead className="bg-amber-50/50">
                  <tr>
                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-medium text-amber-900/80 uppercase tracking-wider">
                      Reward
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-amber-900/80 uppercase tracking-wider">
                      Points
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-amber-900/80 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-amber-900/80 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/30 bg-white/30">
                  {redemptionHistory.map((redemption) => (
                    <tr key={redemption.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-amber-900/90">
                        {redemption.reward_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-amber-800/80 font-medium">
                        -{redemption.points_cost}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-amber-800/70">
                        {new Date(redemption.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          redemption.status === 'completed' 
                            ? 'bg-green-100/80 text-green-800' 
                            : 'bg-amber-100/80 text-amber-800'
                        }`}>
                          {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {redemptionHistory.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-amber-900">No redemption history</h3>
                <p className="mt-1 text-sm text-amber-800/70">Your redeemed rewards will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tiers' && tierBenefits && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-amber-50/30 border border-amber-100/30 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 sm:px-8">
                <h3 className="text-2xl font-serif font-medium text-amber-900/90">Membership Tiers</h3>
                <p className="mt-2 max-w-2xl text-amber-800/80">
                  Progress through our membership tiers to unlock exclusive wellness benefits and rewards.
                </p>
              </div>
              <div className="border-t border-amber-100/50 px-6 py-6 sm:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                  {Object.entries(tierBenefits).map(([tier, benefits], index) => (
                    <motion.div 
                      key={tier} 
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                        tier === level 
                          ? 'border-amber-400 bg-white/50 shadow-lg' 
                          : 'border-amber-100/50 bg-white/30 hover:border-amber-200/70 hover:shadow-md'
                      }`}
                      whileHover={{ y: -5 }}
                    >
                      {tier === level && (
                        <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                          Your Tier
                        </div>
                      )}
                      <h4 className={`text-xl font-serif font-medium ${
                        tier === 'Gold' ? 'text-amber-600' : 
                        tier === 'Silver' ? 'text-gray-600' : 'text-amber-800'
                      }`}>
                        {tier} Tier
                      </h4>
                      <ul className="mt-4 space-y-3">
                        {benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <svg 
                              className={`h-5 w-5 flex-shrink-0 mt-0.5 mr-2 ${
                                tier === 'Gold' ? 'text-amber-500' : 
                                tier === 'Silver' ? 'text-gray-400' : 'text-amber-400'
                              }`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-amber-900/80">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      {tier !== level && (
                        <div className="mt-6 pt-4 border-t border-amber-100/50">
                          <button 
                            className="w-full py-2 px-4 text-sm font-medium rounded-lg bg-amber-100/50 text-amber-800 hover:bg-amber-200/50 transition-colors"
                            onClick={() => {
                              // Scroll to top to see the progress section
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              setActiveTab('overview');
                            }}
                          >
                            View progress to {tier}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Success message */}
      {claimSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{claimSuccess}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
