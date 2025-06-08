import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/auth-helpers';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { rewardId } = await request.json();
    
    if (!rewardId) {
      return NextResponse.json({ error: 'Reward ID is required' }, { status: 400 });
    }

    // Get the reward details
    const { data: reward, error: rewardError } = await supabase
      .from('reward_items')
      .select('*')
      .eq('id', rewardId)
      .eq('is_active', true)
      .single();

    if (rewardError || !reward) {
      console.error('Error fetching reward:', rewardError);
      return NextResponse.json({ error: 'Reward not found or inactive' }, { status: 404 });
    }

    // Get user's current points
    const { data: userRewards, error: rewardsError } = await supabase
      .from('user_rewards')
      .select('points_balance')
      .eq('user_id', user.id)
      .single();

    if (rewardsError || !userRewards) {
      console.error('Error fetching user rewards:', rewardsError);
      return NextResponse.json({ error: 'Failed to fetch user rewards' }, { status: 500 });
    }

    // Check if user has enough points
    if (userRewards.points_balance < reward.points_cost) {
      return NextResponse.json({ error: 'Not enough points to claim this reward' }, { status: 400 });
    }

    // Start a transaction
    const { data: redemption, error: redemptionError } = await supabase.rpc('redeem_reward', {
      p_user_id: user.id,
      p_reward_id: reward.id,
      p_points_cost: reward.points_cost
    });

    if (redemptionError) {
      console.error('Error redeeming reward:', redemptionError);
      return NextResponse.json({ error: 'Failed to redeem reward' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reward claimed successfully',
      redemptionId: redemption.id
    });

  } catch (error) {
    console.error('Error in claim reward API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
