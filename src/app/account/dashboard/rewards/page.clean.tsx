'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const RewardsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [rewardsData, setRewardsData] = useState<RewardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rewards data
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/rewards');
        if (!response.ok) {
          throw new Error('Failed to fetch rewards data');
        }
        const data = await response.json();
        setRewardsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching rewards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

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
      setClaimSuccess(data.message || 'Reward claimed successfully!');
      
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
      const timer = setTimeout(() => {
        setClaimSuccess(null);
      }, 3000);
      
      return () => clearTimeout(timer);
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

  const { points, level, nextLevel, pointsToNextLevel, redeemableRewards, redemptionHistory, tierBenefits } = rewardsData;

  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.min(100, Math.round((points / (points + pointsToNextLevel)) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Rewards</h2>
        <p className="mt-2 text-sm text-gray-600">Earn points and unlock exclusive rewards</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'rewards', 'history', 'tiers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
            <div className="bg-foreground/5 backdrop-blur-sm border border-foreground/5 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Tier Progress</h3>
                <div className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {level} Member
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>{level}</span>
                <span>{nextLevel}</span>
              </div>
              
              <div className="relative w-full h-3 bg-foreground/10 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-amber-300" 
                  style={{
                    width: `${Math.max(5, Math.min(100, progressPercentage))}%`
                  }}
                />
              </div>
              
              <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
                <span>{points.toLocaleString()} points</span>
                <span>{pointsToNextLevel.toLocaleString()} points to {nextLevel}</span>
              </div>
            </div>
            
            {/* Rewards Grid */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Rewards</h3>
              {redeemableRewards?.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {redeemableRewards.slice(0, 3).map((reward) => (
                    <div key={reward.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                      <div className="p-6">
                        <h4 className="text-lg font-medium text-gray-900">{reward.name}</h4>
                        <p className="mt-2 text-sm text-gray-600">{reward.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{reward.pointsCost} points</span>
                          <button
                            onClick={() => handleClaimReward(reward.id)}
                            disabled={reward.claimed || claimingReward === reward.id}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${reward.claimed
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-accent-600 text-white hover:bg-accent-700'
                            }`}
                          >
                            {reward.claimed ? 'Claimed' : claimingReward === reward.id ? 'Claiming...' : 'Claim'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No rewards available at the moment.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && redeemableRewards && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {redeemableRewards.map((reward) => (
              <div key={reward.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900">{reward.name}</h4>
                  <p className="mt-2 text-sm text-gray-600">{reward.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{reward.pointsCost} points</span>
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      disabled={reward.claimed || claimingReward === reward.id}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${reward.claimed
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-accent-600 text-white hover:bg-accent-700'
                      }`}
                    >
                      {reward.claimed ? 'Claimed' : claimingReward === reward.id ? 'Claiming...' : 'Claim'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && redemptionHistory && (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Reward
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Points
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {redemptionHistory.map((redemption) => (
                  <tr key={redemption.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {redemption.reward_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      -{redemption.points_cost}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(redemption.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        redemption.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {redemption.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tiers' && tierBenefits && (
          <div className="space-y-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Membership Tiers</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Progress through our membership tiers to unlock exclusive benefits and rewards.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  {Object.entries(tierBenefits).map(([tier, benefits]) => (
                    <div key={tier} className="border-l-4 border-gray-200 pl-4 py-2">
                      <h4 className="text-lg font-medium text-gray-900">{tier} Tier</h4>
                      <ul className="mt-2 space-y-2">
                        {benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
