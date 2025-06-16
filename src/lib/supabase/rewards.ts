import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';

type RewardTransaction = {
  id: string;
  user_id: string;
  points: number;
  description: string;
  source: string;
  type: string;
  created_at: string;
  date: string;
};

type RedeemableReward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  claimed: boolean;
};

type RewardRedemption = {
  id: string;
  user_id: string;
  reward_item_id: string;
  points_cost: number;
  status: string;
  created_at: string;
  reward_name: string;
};

export type RewardInfo = {
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
};

export const getRewardsData = async (userId: string): Promise<RewardInfo | null> => {
  try {
    const supabase = createClientComponentClient<Database>();
    
    // Fetch user rewards data
    const { data: userRewards, error: rewardsError } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (rewardsError) throw rewardsError;
    if (!userRewards) return null;
    
    // Fetch reward transactions
    const { data: transactions = [], error: transError } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (transError) console.error('Error fetching transactions:', transError);
    
    // Fetch redeemable rewards
    const { data: rewards = [], error: rewardsListError } = await supabase
      .from('reward_items')
      .select('*')
      .eq('is_active', true);
    
    if (rewardsListError) console.error('Error fetching rewards:', rewardsListError);
    
    // Fetch redemption history
    const { data: redemptions = [], error: redemptionsError } = await supabase
      .from('user_reward_redemptions')
      .select('*, reward_items(name as reward_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (redemptionsError) console.error('Error fetching redemptions:', redemptionsError);
    
    // Get current tier info
    const { data: currentTier } = await supabase
      .from('reward_tiers')
      .select('*')
      .eq('id', userRewards.current_tier_id)
      .single();
    
    // Get next tier info
    const { data: nextTier } = await supabase
      .from('reward_tiers')
      .select('*')
      .gt('min_points', currentTier?.min_points || 0)
      .order('min_points', { ascending: true })
      .limit(1)
      .single();
    
    // Prepare tier benefits
    const { data: allTiers } = await supabase
      .from('reward_tiers')
      .select('*')
      .order('min_points', { ascending: true });
    
    const tierBenefits: Record<string, string[]> = {};
    if (allTiers) {
      allTiers.forEach(tier => {
        tierBenefits[tier.name] = [
          `${tier.min_points}${tier.max_points ? `-${tier.max_points}` : '+'} points`,
          ...(tier.benefits || [])
        ];
      });
    }
    
    // Calculate points to next level
    const pointsToNextLevel = nextTier 
      ? nextTier.min_points - userRewards.points_balance
      : 0;
    
    // Calculate progress percentage
    const progressPercentage = nextTier
      ? Math.min(100, Math.max(0, 
          ((userRewards.points_balance - (currentTier?.min_points || 0)) / 
          (nextTier.min_points - (currentTier?.min_points || 0))) * 100
        ))
      : 100;
    
    return {
      points: userRewards.points_balance,
      level: currentTier?.name || 'Gold',
      nextLevel: nextTier?.name || '',
      pointsToNextLevel,
      tier: currentTier?.name || 'Gold',
      progressPercentage,
      transactions: transactions?.map(t => ({
        ...t,
        date: t.created_at
      })) || [],
      redeemableRewards: rewards?.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        pointsCost: r.points_cost,
        claimed: false // This would need to be determined based on user's redemptions
      })) || [],
      redemptionHistory: (redemptions || []).map(redemption => {
        try {
          // Safely access properties with type checking
          const redemptionObj = redemption as {
            id?: string;
            user_id?: string;
            reward_item_id?: string;
            points_cost?: number;
            status?: string;
            created_at?: string;
            reward_items?: { reward_name?: string };
          };
          
          return {
            id: redemptionObj.id || '',
            user_id: redemptionObj.user_id || '',
            reward_item_id: redemptionObj.reward_item_id || '',
            points_cost: redemptionObj.points_cost || 0,
            status: redemptionObj.status || 'completed',
            created_at: redemptionObj.created_at || new Date().toISOString(),
            reward_name: redemptionObj.reward_items?.reward_name || 'Unknown Reward'
          };
        } catch (error) {
          console.error('Error processing redemption:', error);
          return null;
        }
      }).filter(Boolean) as RewardRedemption[],
      tierBenefits
    };
    
  } catch (error) {
    console.error('Error in getRewardsData:', error);
    return null;
  }
};
