'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRewardsData } from '@/lib/supabase/rewards';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  pointsCost: number; // Frontend uses this
  points_cost?: number; // API uses this
  description: string;
  claimed?: boolean;
}

// Helper function to get points from a reward, handling both formats
function getRewardPoints(reward: RedeemableReward): number {
  return reward.points_cost !== undefined ? reward.points_cost : reward.pointsCost;
}

interface RewardRedemption {
  id: string;
  user_id: string;
  reward_item_id: string;
  points_cost: number;
  status: string;
  created_at: string;
  reward_name: string;
}

type TierLevel = 'Gold' | 'Platinum' | 'Diamond';

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
  progressPercentage: number;
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

  // Generate mock rewards data for fallback with new tier structure
const generateMockRewardsData = (): RewardInfo => {
  // Set points to match dashboard display - 1,450 points
  const points = 1450; 
  
  // Tier thresholds based on the database values
  const platinumThreshold = 1000;
  const diamondThreshold = 2000; // Matches 550 points to Diamond from current 1450
  
  // Calculate tier based on points
  let level = 'Gold';
  let nextLevel = 'Platinum';
  let pointsToNextLevel = platinumThreshold - points;
  
  if (points >= diamondThreshold) {
    level = 'Diamond';
    nextLevel = ''; // No next level after Diamond
    pointsToNextLevel = 0;
  } else if (points >= platinumThreshold) {
    level = 'Platinum';
    nextLevel = 'Diamond';
    pointsToNextLevel = diamondThreshold - points;
  }
  
  // Calculate progress percentage - properly show Platinum tier progress (1,450 out of 2,000)
  // This should be approximately 45% through the Platinum tier (450 points out of 1000 points between tiers)
  let progressPercentage;
  
  if (level === 'Gold') {
    // Gold tier: progress to Platinum
    progressPercentage = Math.min(100, Math.max(0, (points / platinumThreshold) * 100));
  } else if (level === 'Platinum') {
    // Platinum tier: progress to Diamond (450 points out of 1000 difference = 45%)
    progressPercentage = Math.min(100, Math.max(0, ((points - platinumThreshold) / (diamondThreshold - platinumThreshold)) * 100));
    
    // For debugging
    console.log('Platinum progress calculation:', { 
      points, 
      platinumThreshold,
      diamondThreshold,
      difference: diamondThreshold - platinumThreshold,
      currentProgress: points - platinumThreshold,
      percentage: progressPercentage
    });
  } else {
    // Diamond tier: always 100%
    progressPercentage = 100;
  }
  
  return {
    points: points,
    level: level,
    nextLevel: nextLevel,
    pointsToNextLevel: pointsToNextLevel > 0 ? pointsToNextLevel : 0,
    tier: level,
    progressPercentage,
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
        name: '10% Off Next Purchase', 
        description: '10% off your next purchase', 
        pointsCost: 200, 
        claimed: false
      },
      { 
        id: 'mock-reward-3', 
        name: 'Free Gift', 
        description: 'Free gift with your next order', 
        pointsCost: 500, 
        claimed: false
      }
    ],
    redemptionHistory: [],
    tierBenefits: {
      'Gold': [
        '0-999 points',
        '5% off all purchases',
        'Free shipping on orders $75+',
        'Exclusive member content',
        'Birthday reward'
      ],
      'Platinum': [
        '1000-1999 points',
        '10% off all purchases',
        'Free shipping on all orders',
        'Early access to sales',
        'Priority customer support',
        'Birthday reward + gift'
      ],
      'Diamond': [
        '2000+ points',
        '15% off all purchases',
        'Free express shipping',
        'Exclusive products access',
        'VIP customer support',
        'Birthday month 20% off',
        'Free gift with every order'
      ]
    }
  };
};

const RewardsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [rewardsData, setRewardsData] = useState<RewardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const router = useRouter();
  // Using centralized Supabase client instead of creating new instances

  // Check authentication and fetch rewards data
  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        // Try to get the session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          console.error('No active session');
          setError('Please sign in to view your rewards');
          setLoading(false);
          return;
        }
        
        // Fetch real rewards data
        console.log('Fetching real rewards data for user:', session.user.id);
        const rewardsData = await getRewardsData(session.user.id);
        
        if (!rewardsData) {
          console.error('No rewards data returned');
          setError('No rewards data found');
          setLoading(false);
          return;
        }
        
        console.log('Successfully fetched rewards data:', rewardsData);
        setRewardsData(rewardsData);
      } catch (error) {
        console.error('Error in fetchRewardsData:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(`Failed to load rewards data: ${errorMessage}`);
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
          let errorData: any = {};
          try {
            errorData = await response.json();
            console.error('Error response:', errorData);
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            errorData = { message: 'Failed to parse error response' };
          }
          
          // Log detailed error information
          console.error('Rewards API error:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            error: errorData,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          // If unauthorized, redirect to login
          if (response.status === 401) {
            console.error('Authentication failed (401) - redirecting to login');
            router.push('/account?tab=login');
            setLoading(false); // Make sure we stop loading
            return;
          }
          
          // For server errors (500), log but don't redirect - use mock data instead
          if (response.status >= 500) {
            const errorMessage = errorData.error || 'Internal server error';
            console.error(`Server error (${response.status}) - ${errorMessage} - falling back to mock data`);
            // Use mock data instead of throwing an error
            setRewardsData(generateMockRewardsData());
            setError(`Server error: ${errorMessage}. Showing mock data.`);
            setLoading(false); // Make sure we stop loading
            return;
          }
          
          throw new Error(
            errorData.error || errorData.message || 
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
        setLoading(false); // Stop loading on success
        
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
        
        // Fall back to mock data if we can't get real data after all retries
        setRewardsData(generateMockRewardsData());
        
        // Make sure we always set loading to false in the error case
        setLoading(false);
      }
    };

    // Initialize rewards data fetch
    fetchRewards();
  }, [router, supabase.auth]);

  // Handle reward redemption
  const handleClaimReward = async (rewardId: string) => {
    try {
      setClaimingReward(rewardId);
      setClaimSuccess(false);
      setError(null);
      
      // Get the current session for the auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to redeem rewards');
      }

      // Get the reward details
      const reward = rewardsData?.redeemableRewards.find(r => r.id === rewardId);
      if (!reward) {
        throw new Error('Reward not found');
      }

      // Redirect to products page with reward parameter
      router.push(`/products?applyReward=${encodeURIComponent(rewardId)}&rewardName=${encodeURIComponent(reward.name)}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process reward';
      setError(errorMessage);
      console.error('Error processing reward:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setClaimingReward(null);
    }
  };

  // Handle apply reward at checkout (original function - keep this one)
  const handleApplyAtCheckout = (rewardId: string) => {
    try {
      const reward = rewardsData?.redeemableRewards.find(r => r.id === rewardId);
      if (!reward) {
        throw new Error('Reward not found');
      }

      // Redirect to products page with reward parameter
      router.push(`/products?applyReward=${encodeURIComponent(rewardId)}&rewardName=${encodeURIComponent(reward.name)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process reward';
      setError(errorMessage);
      console.error('Error processing reward:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setClaimingReward(null);
    }
  };

  // Alternate function for applying rewards at checkout (remove duplicate)
  const handleApplyRewardAtCheckout = (rewardId: string) => {
    try {
      const reward = rewardsData?.redeemableRewards.find(r => r.id === rewardId);
      if (!reward) {
        throw new Error('Reward not found');
      }

      // Store reward information in sessionStorage
      sessionStorage.setItem('checkoutRewardId', rewardId);
      sessionStorage.setItem('checkoutRewardName', reward.name);
      console.log('Stored reward in sessionStorage:', { id: rewardId, name: reward.name });

      // Show confirmation toast
      toast({
        title: "Reward Selected",
        description: `${reward.name} will be applied at checkout`,
        duration: 3000,
      });

      // Redirect to checkout page with reward parameter
      // Use window.location for a full page navigation to ensure parameters are passed properly
      window.location.href = `/checkout?applyReward=${encodeURIComponent(rewardId)}&rewardName=${encodeURIComponent(reward.name)}`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process reward';
      setError(errorMessage);
      console.error('Error processing reward:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setClaimingReward(null);
    }
  };

// Render loading state
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );
}

// Render error state
if (error) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
    </div>
  );
}

  // Render no data state
  if (!rewardsData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Rewards Data Found</h1>
          <p className="mt-2 text-gray-600">We couldn't find any rewards data for your account.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  // Destructure rewards data for easier access in the template
  const { 
    points, 
    level, 
    nextLevel, 
    pointsToNextLevel, 
    transactions, 
    redeemableRewards, 
    redemptionHistory, 
    tierBenefits 
  } = rewardsData;

  // Use the progress percentage from the rewards data
  const progressPercentage = rewardsData?.progressPercentage || 0;

  // Render notification if there's a success or error message
  const renderNotification = () => {
    if (claimSuccess) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-lg"
          >
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
          </motion.div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-lg"
          >
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
          </motion.div>
        </div>
      );
    }
    
    return null;
  };

  // Remove duplicate function

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {renderNotification()}
      </AnimatePresence>
      {/* Points Card - Made responsive for mobile */}
      <div className="relative p-[1px] rounded-2xl overflow-hidden w-full max-w-4xl mx-auto" style={{
        background: 'linear-gradient(135deg, rgba(202, 172, 142, 0.3), rgba(202, 172, 142, 0.1))',
      }}>
        <div className="bg-gradient-to-br from-[#2f2828] via-[#613226] to-[#b37654] rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-15"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-medium text-[#fffff0] font-cinzel tracking-wide">My Devotion Rewards</h2>
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border backdrop-blur-sm self-start sm:self-auto ${
                level === 'Diamond' 
                  ? 'bg-blue-400/20 text-blue-50 border-blue-300/30' 
                  : level === 'Platinum' 
                    ? 'bg-gray-400/20 text-gray-50 border-gray-300/30'
                    : 'bg-amber-400/20 text-amber-50 border-amber-300/30'
              }`}>
                {level} Member
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#fffff0]/90 mb-1.5 sm:mb-2">
              <span className="font-medium">{level}</span>
              <span className="font-medium">{nextLevel}</span>
            </div>
            
            <div className="relative w-full h-2 sm:h-2.5 bg-[#fffff0]/10 rounded-full overflow-hidden">
              {/* Dynamic progress bar based on calculated progressPercentage from API */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#fffff0] to-[#caac8e] transition-all duration-500 ease-out" 
                style={{
                  width: `${Math.max(5, Math.min(100, progressPercentage))}%`
                }}
              />
            </div>
            
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#fffff0]/90 flex flex-row items-center justify-between gap-1.5 sm:gap-0">
              <span className="flex items-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-[#caac8e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{points.toLocaleString()} points</span>
              </span>
              <span className="text-[#fffff0]/80 text-xs sm:text-sm">{pointsToNextLevel.toLocaleString()} points to {nextLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <nav className="-mb-px flex justify-center space-x-8">
          {['overview', 'rewards', 'history', 'tiers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-devotionBrown text-devotionBrown'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 font-sans`}
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
            {/* Rewards Grid */}
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-medium text-foreground font-cinzel tracking-wide">Available Rewards</h3>
                <div className="flex justify-center">
                  <span className="inline-flex items-center bg-amber-50/50 px-4 py-1.5 rounded-full border border-amber-100 text-sm text-amber-900">
                    <svg className="w-4 h-4 mr-1.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{points.toLocaleString()} points available</span>
                  </span>
                </div>
              </div>
              
              {redeemableRewards?.length ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  {redeemableRewards.slice(0, 3).map((reward, index) => (
                    <motion.div 
                      key={reward.id}
                      className="relative group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-devotionBrown/10 shadow-sm hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    >
                      {/* Top accent bar */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-devotionBrown/70 to-devotionBrown/30" />
                      
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col items-center text-center md:items-start md:flex-row md:justify-between gap-6">
                          <div className="w-full md:flex-1 md:pr-8">
                            <div className="flex flex-col items-center md:items-start">
                              <h3 className="text-2xl font-cinzel font-light text-foreground mb-3">{reward.name}</h3>
                              <p className="text-muted-foreground text-base leading-relaxed mb-6">{reward.description}</p>
                              
                              {/* Desktop CTA Buttons - Left aligned on desktop */}
                              <div className="hidden md:block w-full text-left space-y-3">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClaimReward(reward.id);
                                  }}
                                  disabled={reward.claimed || claimingReward === reward.id}
                                  className={`w-full inline-flex items-center justify-center py-3 px-6 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                    reward.claimed
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : claimingReward === reward.id
                                        ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-amber-900 cursor-wait'
                                        : 'bg-gradient-to-r from-devotionBrown to-devotionBrown/90 text-white shadow-md hover:shadow-lg hover:from-devotionBrown hover:to-devotionBrown/80'
                                  }`}
                                >
                                  {reward.claimed 
                                    ? (
                                      <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Reward Claimed
                                      </span>
                                    )
                                    : claimingReward === reward.id 
                                      ? (
                                        <span className="flex items-center">
                                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Processing...
                                        </span>
                                      )
                                      : 'Redeem Now'}
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleApplyAtCheckout(reward.id);
                                  }}
                                  disabled={reward.claimed || claimingReward === reward.id}
                                  className="w-full inline-flex items-center justify-center py-2.5 px-6 rounded-full text-sm font-medium text-devotionBrown bg-white border-2 border-devotionBrown/20 hover:border-devotionBrown/40 transition-all duration-200 hover:bg-amber-50/50"
                                >
                                  Apply at Checkout
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center w-full md:w-auto">
                            <div className="relative mb-6 md:mb-0">
                              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-devotionBrown/5 to-devotionBrown/20 relative flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-devotionBrown/10 to-devotionBrown/30 animate-pulse-slow" />
                                <div className="relative z-10 flex flex-col items-center">
                                  <svg 
                                    className="w-12 h-12 md:w-14 md:h-14 text-devotionBrown mb-1.5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                  </svg>
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-white/90 text-devotionBrown shadow-sm border border-devotionBrown/20">
                                    {getRewardPoints(reward)} points
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Mobile CTA Buttons - Centered on mobile */}
                            <div className="md:hidden w-full space-y-3">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleClaimReward(reward.id);
                                }}
                                disabled={reward.claimed || claimingReward === reward.id}
                                className={`w-full py-3 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                                  reward.claimed
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : claimingReward === reward.id
                                      ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-amber-900 cursor-wait'
                                      : 'bg-gradient-to-r from-devotionBrown to-devotionBrown/90 text-white shadow-md hover:shadow-lg hover:from-devotionBrown hover:to-devotionBrown/80'
                                }`}
                              >
                                {reward.claimed 
                                  ? (
                                    <span className="flex items-center justify-center">
                                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      Reward Claimed
                                    </span>
                                  )
                                  : claimingReward === reward.id 
                                    ? (
                                      <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                      </span>
                                    )
                                    : 'Redeem Now'}
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleApplyAtCheckout(reward.id);
                                }}
                                disabled={reward.claimed || claimingReward === reward.id}
                                className="w-full py-2.5 px-6 rounded-full text-sm font-medium text-devotionBrown bg-white border-2 border-devotionBrown/20 hover:border-devotionBrown/40 transition-all duration-200 hover:bg-amber-50/50"
                              >
                                Apply at Checkout
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-amber-50/50 rounded-xl border border-amber-100/50">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-amber-900 font-cinzel tracking-wide">No Rewards Available</h3>
                  <p className="mt-2 text-sm text-amber-800/70 max-w-md mx-auto">Check back soon for new wellness rewards and exclusive offers.</p>
                  <div className="mt-6">
                    <button 
                      onClick={() => setActiveTab('tiers')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-devotionBrown hover:bg-devotionBrown/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-devotionBrown/50 transition-colors"
                    >
                      View Reward Tiers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && redeemableRewards && (
          <div className="space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-devotionBrown/5 to-transparent h-64 -z-10 rounded-2xl" />
              <div className="max-w-4xl mx-auto text-center py-12 px-6">
                <h2 className="text-3xl font-cinzel font-light tracking-wide text-foreground mb-4">Exclusive Wellness Rewards</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Redeem your hard-earned points for exclusive wellness experiences and products that support your journey to optimal health.</p>
                <div className="mt-6 inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-devotionBrown/10 shadow-sm">
                  <span className="flex items-center text-amber-900">
                    <svg className="w-5 h-5 mr-2 text-devotionBrown" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{points.toLocaleString()}</span> points available
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {redeemableRewards.map((reward, index) => (
                <motion.div 
                  key={reward.id}
                  className="relative group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-devotionBrown/10 shadow-sm hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-devotionBrown/70 to-devotionBrown/30" />
                  
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center md:items-start md:flex-row md:justify-between gap-6">
                      <div className="w-full md:flex-1 md:pr-8">
                        <div className="flex flex-col items-center md:items-start">
                          <h3 className="text-2xl font-cinzel font-light text-foreground mb-3">{reward.name}</h3>
                          <p className="text-muted-foreground text-base leading-relaxed mb-6">{reward.description}</p>
                          
                          {/* Desktop CTA Button - Left aligned on desktop, hidden on mobile */}
                          <div className="hidden md:block w-full text-left">
                            <button
                              onClick={() => handleClaimReward(reward.id)}
                              disabled={reward.claimed || claimingReward === reward.id}
                              className={`inline-flex items-center justify-center py-3 px-8 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                reward.claimed
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-devotionBrown to-devotionBrown/90 text-white shadow-md hover:shadow-lg hover:from-devotionBrown hover:to-devotionBrown/80'
                              }`}
                            >
                              {reward.claimed 
                                ? '✓ Reward Claimed' 
                                : claimingReward === reward.id 
                                  ? 'Processing...' 
                                  : 'Redeem Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center w-full md:w-auto">
                        <div className="relative mb-6 md:mb-0">
                          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-devotionBrown/5 to-devotionBrown/20 relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-devotionBrown/10 to-devotionBrown/30 animate-pulse-slow" />
                            <div className="relative z-10 flex flex-col items-center">
                              <svg 
                                className="w-12 h-12 md:w-14 md:h-14 text-devotionBrown mb-1.5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                              </svg>
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-white/90 text-devotionBrown shadow-sm border border-devotionBrown/20">
                                {reward.pointsCost} points
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Mobile CTA Button - Hidden on desktop */}
                        <div className="w-full md:hidden">
                          <button
                            onClick={() => handleClaimReward(reward.id)}
                            disabled={reward.claimed || claimingReward === reward.id}
                            className={`w-full py-3 px-6 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                              reward.claimed
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-devotionBrown to-devotionBrown/90 text-white shadow-md hover:shadow-lg hover:from-devotionBrown hover:to-devotionBrown/80'
                            }`}
                          >
                            {reward.claimed 
                              ? '✓ Reward Claimed' 
                              : claimingReward === reward.id 
                                ? 'Processing...' 
                                : 'Redeem Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-devotionBrown/0 to-devotionBrown/0 group-hover:to-devotionBrown/5 transition-colors duration-300 pointer-events-none" />
                </motion.div>
              ))}
              
              {redeemableRewards.length === 0 && (
                <div className="text-center py-20 bg-gradient-to-br from-amber-50/50 to-amber-50/30 rounded-2xl border border-amber-100">
                  <div className="w-20 h-20 bg-amber-100/80 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-cinzel font-light text-amber-900 mb-2">No Rewards Available</h3>
                  <p className="text-amber-800/70 max-w-md mx-auto mb-6">Check back soon for new wellness rewards and exclusive offers.</p>
                  <button 
                    onClick={() => setActiveTab('tiers')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-devotionBrown hover:bg-devotionBrown/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-devotionBrown/50 transition-all transform hover:scale-105"
                  >
                    View Reward Tiers
                  </button>
                </div>
              )}
            </div>
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
                <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
                  {Object.entries(tierBenefits).map(([tier, benefits], index) => (
                    <motion.div 
                      key={tier}
                      className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border mx-auto w-full max-w-md ${
                        tier === level 
                          ? tier === 'Diamond' 
                              ? 'border-blue-400 shadow-lg' 
                              : tier === 'Platinum' 
                                ? 'border-gray-400 shadow-lg' 
                                : 'border-amber-400 shadow-lg'
                          : 'border-devotionBrown/10 hover:border-amber-200/70'
                      } shadow-sm hover:shadow-lg transition-[border-color,transform,box-shadow] duration-300 ease-in-out group h-full flex flex-col`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderColor: tier === 'Diamond' ? '#60a5fa' : 
                                    tier === 'Platinum' ? '#9ca3af' : 
                                    '#f59e0b',
                        transition: {
                          borderColor: { duration: 0.1 },
                          y: { duration: 0.2 },
                          boxShadow: { duration: 0.2 }
                        }
                      }}
                    >
                      {/* Top accent bar */}
                      <div className={`h-1.5 w-full ${
                        tier === 'Diamond' ? 'bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200' :
                        tier === 'Platinum' ? 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100' :
                        'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200'
                      }`} />
                      
                      {/* Your Tier Badge */}
                      {tier === level && (
                        <div className={`absolute top-4 right-4 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md z-10 ${
                          tier === 'Diamond' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                            : tier === 'Platinum' 
                              ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600'
                        }`}>
                          Your Tier
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8 flex-grow flex flex-col">
                        <div className="flex-grow">
                          <h3 className={`text-2xl font-cinzel font-light text-center mb-6 ${
                            tier === 'Diamond' ? 'text-blue-600' : 
                            tier === 'Platinum' ? 'text-gray-600' : 'text-amber-600'
                          }`}>
                            {tier} Tier
                          </h3>
                          
                          <ul className="space-y-3">
                            {benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start">
                                <svg 
                                  className={`h-5 w-5 flex-shrink-0 mt-0.5 mr-3 ${
                                    tier === 'Diamond' ? 'text-blue-400' : 
                                    tier === 'Platinum' ? 'text-gray-400' : 'text-amber-500'
                                  }`} 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-foreground/90 text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
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
