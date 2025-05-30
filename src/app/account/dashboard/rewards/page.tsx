'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RewardsPage() {
  // Mock rewards data - in a real app, this would come from your user/rewards database
  const rewardsData = {
    points: 750,
    tier: 'Silver',
    nextTier: 'Gold',
    pointsToNextTier: 250,
    history: [
      { id: 1, date: 'May 25, 2025', type: 'Purchase', description: 'Order #ORD-2025-4289', points: 150 },
      { id: 2, date: 'May 15, 2025', type: 'Subscription', description: 'Monthly Subscription Bonus', points: 50 },
      { id: 3, date: 'May 10, 2025', type: 'Purchase', description: 'Order #ORD-2025-4156', points: 50 },
      { id: 4, date: 'April 22, 2025', type: 'Purchase', description: 'Order #ORD-2025-3892', points: 100 },
      { id: 5, date: 'April 15, 2025', type: 'Subscription', description: 'Monthly Subscription Bonus', points: 50 },
      { id: 6, date: 'April 10, 2025', type: 'Referral', description: 'Friend Referral: Emily Johnson', points: 200 },
      { id: 7, date: 'March 15, 2025', type: 'Purchase', description: 'Order #ORD-2025-3562', points: 150 }
    ],
    availableRewards: [
      { id: 'REW-1', name: '10% Off Next Order', points: 500, description: 'Get 10% off your next order', claimed: false },
      { id: 'REW-2', name: 'Free Product Sample', points: 300, description: 'Get a free product sample with your next order', claimed: true },
      { id: 'REW-3', name: 'Free Shipping', points: 200, description: 'Free shipping on your next order', claimed: false },
      { id: 'REW-4', name: '25% Off Subscription', points: 1000, description: 'Get 25% off a monthly subscription for 3 months', claimed: false },
      { id: 'REW-5', name: 'Limited Edition Product', points: 1500, description: 'Exclusive access to limited edition products', claimed: false }
    ],
    tierBenefits: {
      Bronze: [
        'Earn 1 point per $1 spent',
        'Birthday bonus points',
        'Access to exclusive content'
      ],
      Silver: [
        'Earn 1.25 points per $1 spent',
        'All Bronze benefits',
        'Early access to new products',
        'Exclusive monthly offers'
      ],
      Gold: [
        'Earn 1.5 points per $1 spent',
        'All Silver benefits',
        'Free shipping on all orders',
        'VIP customer support',
        'Quarterly free gifts'
      ],
      Platinum: [
        'Earn 2 points per $1 spent',
        'All Gold benefits',
        'Annual product bundle gift',
        'Dedicated account manager',
        'Exclusive invites to product launches'
      ]
    }
  };

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'rewards', 'history', 'tiers'
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  const handleClaimReward = (rewardId: string) => {
    setClaimingReward(rewardId);
    
    // Simulate API call
    setTimeout(() => {
      setClaimingReward(null);
      setClaimSuccess(rewardId);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setClaimSuccess(null);
      }, 3000);
    }, 1000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-8"
    >
      <div className="mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Rewards Program
          </h1>
          <span className="ml-4 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
            {rewardsData.tier} Tier
          </span>
        </div>
        <p className="text-muted-foreground">
          Earn points with every purchase and unlock exclusive rewards
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-border/10">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'overview' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/20'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'rewards' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/20'
            }`}
          >
            Available Rewards
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'history' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/20'
            }`}
          >
            Points History
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'tiers' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/20'
            }`}
          >
            Rewards Tiers
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div variants={itemVariants}>
          {/* Points Summary Card */}
          <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-muted-foreground text-sm">Available Points</p>
                <h2 className="text-4xl md:text-5xl font-bold text-accent mt-1">{rewardsData.points}</h2>
              </div>
              
              <div className="flex-1">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{rewardsData.tier}</span>
                  <span>{rewardsData.nextTier}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent"
                    style={{ width: `${(rewardsData.points / (rewardsData.points + rewardsData.pointsToNextTier)) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  {rewardsData.pointsToNextTier} more points to reach {rewardsData.nextTier} tier
                </p>
              </div>
            </div>
          </div>
          
          {/* Ways to Earn */}
          <div className="mb-8">
            <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Ways to Earn Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">Shop</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Earn 1.25 points for every $1 spent on all purchases.
                </p>
                <Link 
                  href="/products"
                  className="text-sm text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  Shop Products →
                </Link>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">Subscribe</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Earn 50 bonus points every month with an active subscription.
                </p>
                <Link 
                  href="/account/dashboard/orders"
                  className="text-sm text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  Manage Subscriptions →
                </Link>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">Refer Friends</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Earn 200 points for each friend who makes their first purchase.
                </p>
                <button 
                  className="text-sm text-accent hover:text-accent/80 transition-colors duration-200"
                  onClick={() => alert('In a real app, this would open a referral sharing modal')}
                >
                  Share Your Referral Link →
                </button>
              </div>
            </div>
          </div>
          
          {/* Featured Rewards */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif font-semibold text-foreground">Featured Rewards</h3>
              <button 
                onClick={() => setActiveTab('rewards')}
                className="text-sm text-accent hover:text-accent/80 transition-colors duration-200"
              >
                View All Rewards →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewardsData.availableRewards.slice(0, 2).map(reward => (
                <div key={reward.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-1">{reward.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                    </div>
                    <div className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                      {reward.points} points
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleClaimReward(reward.id)}
                    disabled={reward.claimed || rewardsData.points < reward.points || claimingReward === reward.id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      reward.claimed
                        ? 'bg-green-500/10 text-green-500 cursor-default'
                        : rewardsData.points < reward.points
                          ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                          : 'bg-accent text-white hover:bg-accent/90'
                    }`}
                  >
                    {claimingReward === reward.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : reward.claimed ? (
                      'Claimed'
                    ) : rewardsData.points < reward.points ? (
                      'Not Enough Points'
                    ) : claimSuccess === reward.id ? (
                      'Successfully Claimed!'
                    ) : (
                      'Claim Reward'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Rewards Tab */}
      {activeTab === 'rewards' && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewardsData.availableRewards.map(reward => (
              <div key={reward.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-foreground mb-1">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  </div>
                  <div className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                    {reward.points} points
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleClaimReward(reward.id)}
                    disabled={reward.claimed || rewardsData.points < reward.points || claimingReward === reward.id}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      reward.claimed
                        ? 'bg-green-500/10 text-green-500 cursor-default'
                        : rewardsData.points < reward.points
                          ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                          : 'bg-accent text-white hover:bg-accent/90'
                    }`}
                  >
                    {claimingReward === reward.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : reward.claimed ? (
                      'Claimed'
                    ) : rewardsData.points < reward.points ? (
                      'Not Enough Points'
                    ) : claimSuccess === reward.id ? (
                      'Successfully Claimed!'
                    ) : (
                      'Claim Reward'
                    )}
                  </button>
                  <button 
                    className="py-2 px-3 rounded-lg text-sm font-medium border border-border/20 text-foreground hover:bg-white/5 transition-colors duration-200"
                    onClick={() => alert(`In a real app, this would show details for ${reward.name}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Points History Tab */}
      {activeTab === 'history' && (
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/10">
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardsData.history.map((item) => (
                    <tr key={item.id} className="border-b border-border/5 hover:bg-white/5 transition-colors duration-150">
                      <td className="px-4 py-4 text-sm text-muted-foreground">{item.date}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'Purchase' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : item.type === 'Subscription'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">{item.description}</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-accent">+{item.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reward Tiers Tab */}
      {activeTab === 'tiers' && (
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Membership Tiers & Benefits</h3>
            <p className="text-muted-foreground mb-4">
              Unlock additional benefits as you earn more points and advance through our membership tiers.
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(rewardsData.tierBenefits).map(([tier, benefits], index) => {
              const isCurrentTier = tier === rewardsData.tier;
              return (
                <div 
                  key={tier}
                  className={`bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden ${
                    isCurrentTier ? 'border-accent/50' : 'border-white/10'
                  }`}
                >
                  <div className={`p-4 flex justify-between items-center ${
                    isCurrentTier ? 'bg-accent/10' : ''
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        isCurrentTier ? 'bg-accent/20' : 'bg-white/10'
                      }`}>
                        <span className={`text-lg font-bold ${
                          isCurrentTier ? 'text-accent' : 'text-foreground'
                        }`}>{index + 1}</span>
                      </div>
                      <h4 className="text-lg font-medium text-foreground">{tier}</h4>
                    </div>
                    {isCurrentTier && (
                      <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                        Current Tier
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <ul className="space-y-2">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-accent mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {tier !== 'Bronze' && (
                      <div className="mt-4 pt-4 border-t border-border/10">
                        <p className="text-sm text-muted-foreground">
                          {tier === 'Silver' ? (
                            <span>Reach <strong>1,000 points</strong> to unlock Silver tier</span>
                          ) : tier === 'Gold' ? (
                            <span>Reach <strong>2,500 points</strong> to unlock Gold tier</span>
                          ) : (
                            <span>Reach <strong>5,000 points</strong> to unlock Platinum tier</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
