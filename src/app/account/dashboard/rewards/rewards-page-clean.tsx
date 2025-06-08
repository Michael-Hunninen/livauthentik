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
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const RewardsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewardsData, setRewardsData] = useState<RewardInfo | null>(null);

  // Fetch rewards data
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/rewards');
        if (!response.ok) throw new Error('Failed to fetch rewards data');
        const data = await response.json();
        setRewardsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching rewards data');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Handle claiming a reward
  const handleClaimReward = async (rewardId: string) => {
    setClaimingReward(rewardId);
    
    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim reward');
      }

      const data = await response.json();
      setClaimSuccess(data.message || 'Reward claimed successfully!');
      
      // Update local state optimistically
      if (rewardsData) {
        setRewardsData({
          ...rewardsData,
          redeemableRewards: rewardsData.redeemableRewards.map(reward =>
            reward.id === rewardId ? { ...reward, claimed: true } : reward
          ),
          points: rewardsData.points - (rewardsData.redeemableRewards.find(r => r.id === rewardId)?.pointsCost || 0),
        });
      }

      // Clear success message after 3 seconds
      setTimeout(() => setClaimSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while claiming the reward');
    } finally {
      setClaimingReward(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
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

  // Render main content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
        <p className="mt-2 text-sm text-gray-600">
          Earn points and unlock exclusive rewards
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'redeem', 'history', 'tiers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-amber-500 text-amber-600'
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
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mt-8"
      >
        {activeTab === 'overview' && rewardsData && (
          <div className="space-y-8">
            {/* Points Balance */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Points</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">
                  {rewardsData.points.toLocaleString()}
                </span>
                <span className="ml-2 text-sm font-medium text-gray-500">points</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (rewardsData.points / (rewardsData.points + rewardsData.pointsToNextLevel)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {rewardsData.pointsToNextLevel} points to {rewardsData.nextLevel}
                </p>
              </div>
            </motion.div>

            {/* Available Rewards */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Available Rewards</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rewardsData.redeemableRewards.slice(0, 3).map((reward) => (
                    <div
                      key={reward.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium text-gray-900">{reward.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{reward.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-amber-600">
                          {reward.pointsCost} points
                        </span>
                        <button
                          onClick={() => handleClaimReward(reward.id)}
                          disabled={reward.claimed || claimingReward === reward.id}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            reward.claimed
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {reward.claimed
                            ? 'Claimed'
                            : claimingReward === reward.id
                            ? 'Claiming...'
                            : 'Claim'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'redeem' && rewardsData && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rewardsData.redeemableRewards.map((reward) => (
              <motion.div
                key={reward.id}
                variants={itemVariants}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{reward.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{reward.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-600">
                      {reward.pointsCost} points
                    </span>
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      disabled={reward.claimed || claimingReward === reward.id || rewardsData.points < reward.pointsCost}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        reward.claimed || rewardsData.points < reward.pointsCost
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                    >
                      {reward.claimed
                        ? 'Claimed'
                        : rewardsData.points < reward.pointsCost
                        ? 'Not enough points'
                        : claimingReward === reward.id
                        ? 'Claiming...'
                        : 'Redeem Now'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'history' && rewardsData && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Redemption History</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {rewardsData.redemptionHistory.map((redemption) => (
                  <li key={redemption.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-amber-600 truncate">
                        {redemption.reward_name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          -{redemption.points_cost} pts
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {new Date(redemption.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="capitalize">{redemption.status}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'tiers' && rewardsData && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Your Tier</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Current status and benefits
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Current Tier</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                      {rewardsData.tier}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Benefits</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="list-disc pl-5 space-y-2">
                        {rewardsData.tierBenefits[rewardsData.tier]?.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        )) || <li>No benefits listed for this tier</li>}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Tiers & Benefits</h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="bg-white overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tier
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Benefits
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(rewardsData.tierBenefits).map(([tier, benefits]) => (
                        <tr key={tier} className={tier === rewardsData.tier ? 'bg-amber-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {tier}
                            {tier === rewardsData.tier && (
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                Current
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <ul className="list-disc pl-5 space-y-1">
                              {benefits.map((benefit, i) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Success Notification */}
      {claimSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r shadow-lg z-50">
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
