import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Hardcoded fallback values - same as in src/lib/supabase/client.ts
const FALLBACK_SUPABASE_URL = 'https://adkrrjokgpufehpxinsr.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';

// Helper function to create Supabase client
function createSupabaseClient(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseKey
      }
    }
  });
}

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(2, 9);
  const startTime = Date.now();
  
  try {
    // Get the authorization header
    const authHeader = headers().get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { rewardId } = await request.json();
    
    if (!rewardId) {
      return NextResponse.json(
        { error: 'Missing rewardId in request body' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createSupabaseClient(token);
    
    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    // Start a transaction to redeem the reward
    const { data: result, error: redeemError } = await supabase.rpc('redeem_reward', {
      p_user_id: user.id,
      p_reward_id: rewardId
    });
    
    if (redeemError) {
      console.error('Reward redemption error:', redeemError);
      return NextResponse.json(
        { error: redeemError.message || 'Failed to redeem reward' },
        { status: 400 }
      );
    }
    
    // Get updated user rewards data
    const rewardsData = await getRewardsData(supabase, user.id);
    
    return NextResponse.json({
      success: true,
      message: 'Reward redeemed successfully',
      data: rewardsData
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error in redeem reward:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get rewards data (similar to the GET route)
async function getRewardsData(supabase: any, userId: string) {
  const { data: rewardsData, error: rewardsError } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (rewardsError || !rewardsData) {
    throw new Error(rewardsError?.message || 'No rewards data found');
  }

  // Calculate tier based on points
  const points = rewardsData.points_balance || 0;
  let currentTier = 'Bronze';
  let nextTier = 'Silver';
  let pointsToNextLevel = 1000 - points;
  
  if (points >= 1000 && points < 3000) {
    currentTier = 'Silver';
    nextTier = 'Gold';
    pointsToNextLevel = 3000 - points;
  } else if (points >= 3000) {
    currentTier = 'Gold';
    nextTier = 'Max';
    pointsToNextLevel = 0;
  }
  
  // Get redeemable rewards
  const { data: redeemableRewards } = await supabase
    .from('reward_items')
    .select('*')
    .lte('points_cost', points)
    .order('points_cost', { ascending: true });
  
  // Get redemption history (limit to 10 most recent)
  const { data: redemptionHistory } = await supabase
    .from('user_reward_redemptions')
    .select('*, reward_items:reward_item_id (name, points_cost)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  return {
    points,
    tier: currentTier,
    level: currentTier,
    nextLevel: nextTier,
    pointsToNextLevel,
    redeemableRewards: redeemableRewards || [],
    redemptionHistory: redemptionHistory || [],
    tierBenefits: {
      Bronze: ['Free shipping on orders over $50', 'Birthday reward', 'Exclusive member content'],
      Silver: ['Free shipping on all orders', 'Birthday reward', '5% discount on all purchases', 'Priority customer support'],
      Gold: ['Free shipping on all orders', 'Birthday reward', '10% discount on all purchases', 'Early access to new products', 'Priority customer support', 'Free gift with every order']
    }
  };
}
