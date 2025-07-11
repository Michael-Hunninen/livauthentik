import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Hardcoded fallback values - same as in src/lib/supabase/client.ts
const FALLBACK_SUPABASE_URL = 'https://adkrrjokgpufehpxinsr.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';

// Helper function to log errors consistently
function logError(context: string, error: any, additionalInfo: Record<string, any> = {}) {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      name: error?.name,
      message: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      isServer: typeof window === 'undefined',
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length,
    },
    ...additionalInfo,
  };
  
  console.error('API Error:', JSON.stringify(errorInfo, null, 2));
  return errorInfo;
}

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

// Helper function to get rewards data
async function getRewardsData(supabase: any, userId: string) {
  // Get all reward tiers from the database to properly calculate tier levels
  const { data: rewardTiers, error: tiersError } = await supabase
    .from('reward_tiers')
    .select('*')
    .order('min_points', { ascending: true });

  if (tiersError || !rewardTiers || rewardTiers.length === 0) {
    throw new Error(tiersError?.message || 'No reward tiers found');
  }

  console.log('Fetched reward tiers:', rewardTiers);

  // Get user's rewards data
  const { data: rewardsData, error: rewardsError } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (rewardsError || !rewardsData) {
    throw new Error(rewardsError?.message || 'No rewards data found');
  }

  // Calculate tier based on points using database values
  const points = rewardsData.points_balance || 0;
  
  // Find current tier based on points
  let currentTierObj = rewardTiers[0]; // Default to first tier (Gold)
  let nextTierObj = rewardTiers.length > 1 ? rewardTiers[1] : null;
  
  for (let i = rewardTiers.length - 1; i >= 0; i--) {
    if (points >= rewardTiers[i].min_points) {
      currentTierObj = rewardTiers[i];
      nextTierObj = i < rewardTiers.length - 1 ? rewardTiers[i + 1] : null;
      break;
    }
  }
  
  const currentTier = currentTierObj.name;
  const nextTier = nextTierObj?.name || 'Max';
  const pointsToNextLevel = nextTierObj ? Math.max(0, nextTierObj.min_points - points) : 0;
  
  // Calculate progress percentage between current and next tier
  let progressPercentage = 0;
  if (nextTierObj) {
    const totalPointsInCurrentTier = nextTierObj.min_points - currentTierObj.min_points;
    const pointsEarnedInCurrentTier = points - currentTierObj.min_points;
    progressPercentage = Math.min(100, Math.max(0, (pointsEarnedInCurrentTier / totalPointsInCurrentTier) * 100));
  } else {
    // At max tier
    progressPercentage = 100;
  }
  
  // Log tier calculation for debugging
  console.log('Tier calculation:', {
    points,
    currentTier,
    currentTierMinPoints: currentTierObj.min_points,
    nextTier,
    nextTierMinPoints: nextTierObj?.min_points,
    pointsToNextLevel
  });

  // Run all queries in parallel
  const [
    { data: redeemableRewards },
    { data: redemptionHistory },
    { data: transactions }
  ] = await Promise.all([
    // Get redeemable rewards
    supabase
      .from('reward_items')
      .select('*')
      .lte('points_cost', rewardsData.points_balance)
      .order('points_cost', { ascending: true }),
    
    // Get redemption history (limit to 10 most recent)
    supabase
      .from('user_reward_redemptions')
      .select('*, reward_items:reward_item_id (name, points_cost)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10),
    
    // Get transaction history (limit to 10 most recent)
    supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  return {
    points: rewardsData.points_balance,
    tier: currentTier,
    level: currentTier,
    nextLevel: nextTier,
    pointsToNextLevel,
    progressPercentage,
    lastUpdated: new Date().toISOString(),
    redeemableRewards: redeemableRewards || [],
    redemptionHistory: redemptionHistory || [],
    transactions: transactions || [],
    tierBenefits: {
      Gold: ['$90 bag', '1.2x points multiplier', 'Free shipping on orders over $50', 'Exclusive member content'],
      Platinum: ['$80 bag', '1.5x points multiplier', 'Free shipping', 'Early access to sales', '5% discount on all purchases'],
      Diamond: ['$72 bag', '2x points multiplier', 'Free shipping', 'Exclusive products', '10% discount on all purchases', 'Birthday reward']
    }
  };
}

// Mock data for when Supabase is not available
const MOCK_DATA = {
  success: true,
  points: 250,
  tier: 'Bronze',
  level: 'Bronze',
  nextLevel: 'Silver',
  pointsToNextLevel: 750,
  lastUpdated: new Date().toISOString(),
  transactions: [
    { 
      id: 'mock-trans-1', 
      user_id: 'mock-user', 
      points: 100, 
      description: 'Welcome Bonus', 
      source: 'system', 
      type: 'credit',
      created_at: new Date().toISOString(),
      date: new Date().toISOString() 
    }
  ],
  redeemableRewards: [
    { 
      id: 'mock-reward-1', 
      name: 'Free Shipping', 
      description: 'Free shipping on your next order', 
      points_cost: 100,
      pointsCost: 100
    }
  ],
  redemptionHistory: [],
  tierBenefits: {
    Bronze: ['5% off all purchases', 'Exclusive Bronze member content'],
    Silver: ['10% off all purchases', 'Free shipping', 'Early access to sales'],
    Gold: ['15% off all purchases', 'Free shipping', 'Exclusive products', 'Birthday reward']
  },
  isMockData: true
};

export async function GET() {
  const requestId = Math.random().toString(36).substring(2, 9);
  const startTime = Date.now();
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request for CORS preflight
  if (headers().get('access-control-request-method')) {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  
  try {
    console.log(`[${requestId}] Starting rewards API request`);
    
    // Get the authorization header
    const authHeader = headers().get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`[${requestId}] No auth token provided`);
      // Return mock data if no token is provided (for demo purposes)
      return NextResponse.json(
        { ...MOCK_DATA, requestId, timestamp: new Date().toISOString() },
        { status: 200, headers: corsHeaders }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log(`[${requestId}] Token received`);
    
    // Create Supabase client
    const supabase = createSupabaseClient(token);
    
    // Set a timeout for the entire operation (8 seconds to be safe)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 8000)
    );
    
    // Get user info with timeout
    const userPromise = supabase.auth.getUser(token);
    const userResult = await Promise.race([userPromise, timeoutPromise]) as any;
    
    if (userResult.error || !userResult.data?.user) {
      console.log(`[${requestId}] Invalid token, returning mock data`);
      return NextResponse.json(
        { ...MOCK_DATA, requestId, timestamp: new Date().toISOString() },
        { status: 200, headers: corsHeaders }
      );
    }
    
    const user = userResult.data.user;
    console.log(`[${requestId}] Authenticated as user:`, user.id);
    
    // Get rewards data with timeout
    const rewardsData = await Promise.race([
      getRewardsData(supabase, user.id),
      timeoutPromise
    ]) as any;
    
    const response = {
      success: true,
      ...rewardsData,
      requestId,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    };
    
    console.log(`[${requestId}] Request completed in ${Date.now() - startTime}ms`);
    return NextResponse.json(response, { headers: corsHeaders });
    
  } catch (error: any) {
    console.error(`[${requestId}] Error:`, error);
    
    // Return mock data on error
    return NextResponse.json(
      { 
        ...MOCK_DATA, 
        success: false,
        error: error.message || 'Internal server error',
        isMockData: true,
        requestId,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      },
      { 
        status: error.status || 500,
        headers: corsHeaders 
      }
    );
  }
}
