import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/auth-helpers';

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
  
  // Log to console
  console.error('API Error:', JSON.stringify(errorInfo, null, 2));
  
  // In production, you might want to send this to an error tracking service
  // For example: trackError(errorInfo);
  
  return errorInfo;
}

export async function GET() {
  const requestId = Math.random().toString(36).substring(2, 9);
  const startTime = Date.now();
  
  try {
    console.log(`[${requestId}] Starting rewards API request`);
    
    // APPROACH 1: Try to use the existing server client implementation which is more robust
    const supabaseServer = createServerSupabaseClient();
    
    // First attempt: Use cookie-based auth with server client
    try {
      console.log(`[${requestId}] Attempting cookie-based auth...`);
      const { data: { user }, error: cookieAuthError } = await supabaseServer.auth.getUser();
      
      if (!cookieAuthError && user) {
        console.log(`[${requestId}] Cookie auth successful, user:`, user.id);
        return await getRewardsData(requestId, supabaseServer, user, startTime);
      }
      
      console.log(`[${requestId}] Cookie auth failed:`, cookieAuthError?.message || 'No user found');
    } catch (cookieError) {
      console.error(`[${requestId}] Error in cookie auth:`, cookieError);
      // Continue to token-based auth
    }
    
    // APPROACH 2: Try token-based auth as fallback
    // Get the authorization header
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No authorization token found');
      logError('Auth check failed', error, { requestId });
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized - No valid authentication method',
          requestId
        }, 
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log(`[${requestId}] Token received (${token.length} chars)`);
    
    // Check for environment variables but don't fail if they're missing
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Log environment variables (without sensitive values)
    console.log(`[${requestId}] Environment check:`, {
      hasSupabaseUrl,
      hasSupabaseKey,
      usingFallbacks: !hasSupabaseUrl || !hasSupabaseKey,
      nodeEnv: process.env.NODE_ENV,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || FALLBACK_SUPABASE_URL.length,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || FALLBACK_SUPABASE_ANON_KEY.length
    });

    // Create a direct Supabase client with the provided token
    console.log(`[${requestId}] Creating direct Supabase client with token...`);
    // Use environment variables if available, otherwise use fallbacks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
    
    // Create a direct token-based client as last resort
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: supabaseKey
          }
        }
      }
    );
    
    // Try a simpler approach: just get the user with the token
    console.log(`[${requestId}] Getting user with token...`);
    const { data: { user }, error: tokenAuthError } = await supabase.auth.getUser(token);
    
    if (tokenAuthError || !user) {
      // Log complete error info for debugging
      console.error(`[${requestId}] Token auth failed:`, {
        error: tokenAuthError,
        message: tokenAuthError?.message,
        status: tokenAuthError?.status
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication failed - Invalid token',
          details: tokenAuthError?.message || 'No user found',
          requestId
        }, 
        { status: 401 }
      );
    }
    
    console.log(`[${requestId}] Token auth successful, user:`, user.id);
    return await getRewardsData(requestId, supabase, user, startTime);
    
  } catch (mainError) {
    console.error(`[${requestId}] Fatal error in rewards API:`, mainError);
    return NextResponse.json(
      { 
        success: false,
        error: 'Server error',
        details: mainError instanceof Error ? mainError.message : 'Unknown error',
        requestId
      }, 
      { status: 500 }
    );
  }
}

// Helper function to get rewards data for a user
async function getRewardsData(requestId: string, supabase: any, user: any, requestStartTime: number) {
  const dataStartTime = Date.now();
  
  try {
    console.log(`[${requestId}] Getting user's rewards data...`);
    // Get user's rewards data with tier information
    const { data: rewardsData, error: rewardsError } = await supabase
      .from('user_rewards')
      .select(`
        *,
        reward_tiers:current_tier_id (name)
      `)
      .eq('user_id', user.id)
      .single();

    console.log(`[${requestId}] Rewards data:`, { 
      hasData: !!rewardsData,
      error: rewardsError?.message 
    });

    if (rewardsError || !rewardsData) {
      throw new Error(rewardsError?.message || 'No rewards data found');
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
    console.log(`[${requestId}] Getting redeemable rewards...`);
    const { data: redeemableRewards } = await supabase
      .from('reward_items')
      .select('*')
      .lte('points_cost', rewardsData.points_balance)
      .order('points_cost', { ascending: true });

    // Get redemption history
    console.log(`[${requestId}] Getting redemption history...`);
    const { data: redemptionHistory } = await supabase
      .from('user_reward_redemptions')
      .select(`
        *,
        reward_items:reward_item_id (name, points_cost)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get transaction history
    console.log(`[${requestId}] Getting transaction history...`);
    const { data: transactions } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Construct the response data
    const data = {
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

    // Return successful response with timing info
    console.log(`[${requestId}] Request completed successfully in ${Date.now() - requestStartTime}ms`);
    return NextResponse.json({
      success: true,
      ...data,
      timing: {
        total: Date.now() - requestStartTime,
        dataFetch: Date.now() - dataStartTime
      },
      requestId
    });
      
  } catch (error: any) {
    logError('Rewards API error', error, { 
      requestId,
      duration: Date.now() - requestStartTime 
    });
    
    // Return detailed error in development, generic in production
    const isDev = process.env.NODE_ENV === 'development';
    const errorDetails = isDev 
      ? {
          error: error.message || 'Unknown error',
          stack: error.stack,
          type: error.name
        }
      : { error: 'Internal server error' };
      
    return NextResponse.json(
      { 
        success: false,
        ...errorDetails,
        requestId,
        timing: {
          total: Date.now() - requestStartTime
        }
      },
      { status: 500 }
    );
  }
}
