import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

export async function GET() {
  try {
    // Get the authorization header
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization token found');
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create a Supabase client with the provided token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: {
          persistSession: false
        }
      }
    );
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('Invalid token or user not found:', userError?.message);
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    console.log('Authenticated user ID:', user.id);

    // Get user's rewards data with tier information
    const { data: rewardsData, error: rewardsError } = await supabase
      .from('user_rewards')
      .select(`
        *,
        reward_tiers:current_tier_id (name)
      `)
      .eq('user_id', user.id)
      .single();

    console.log('Database query results:', { data: rewardsData, error: rewardsError });

    if (rewardsError || !rewardsData) {
      console.error('Error fetching rewards data:', rewardsError);
      return NextResponse.json(
        { 
          error: 'Failed to load rewards data',
          details: rewardsError?.message || 'No data found'
        },
        { status: rewardsError ? 500 : 404 }
      );
    }

    // Get the current tier name or default to 'Bronze'
    const currentTier = Array.isArray(rewardsData.reward_tiers) 
      ? rewardsData.reward_tiers[0]?.name 
      : rewardsData.reward_tiers?.name || 'Bronze';

    // Determine next tier and points needed
    let nextTier = 'Gold';
    let pointsToNextLevel = 2000;
    
    if (currentTier === 'Bronze') {
      nextTier = 'Silver';
      pointsToNextLevel = 1000;
    } else if (currentTier === 'Silver') {
      nextTier = 'Gold';
      pointsToNextLevel = 2000;
    } else if (currentTier === 'Gold') {
      nextTier = 'Platinum';
      pointsToNextLevel = 3000;
    }

    // Get redeemable rewards
    const { data: redeemableRewards } = await supabase
      .from('reward_items')
      .select('*')
      .lte('points_cost', rewardsData.points_balance)
      .order('points_cost', { ascending: true });

    // Get redemption history
    const { data: redemptionHistory } = await supabase
      .from('user_reward_redemptions')
      .select(`
        *,
        reward_items:reward_item_id (name, points_cost)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get transaction history
    const { data: transactions } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Construct the response
    const response = {
      success: true,
      points: rewardsData.points_balance,
      tier: currentTier,
      level: currentTier,
      nextLevel: nextTier,
      pointsToNextLevel,
      lastUpdated: new Date().toISOString(),
      redeemableRewards: redeemableRewards || [],
      redemptionHistory: redemptionHistory || [],
      transactions: transactions || [],
      tierBenefits: {
        Bronze: ['5% off all purchases', 'Exclusive Bronze member content'],
        Silver: ['10% off all purchases', 'Free shipping', 'Early access to sales'],
        Gold: ['15% off all purchases', 'Free shipping', 'Exclusive products', 'Birthday reward'],
        Platinum: ['20% off all purchases', 'Free express shipping', 'VIP customer support', 'Exclusive events', 'Personal shopper']
      }
    };

    console.log('Returning rewards data:', response);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error in rewards API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}
