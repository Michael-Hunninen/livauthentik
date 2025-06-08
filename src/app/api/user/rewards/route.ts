import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

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
    
    // Get the authorization header
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No authorization token found');
      logError('Auth check failed', error, { requestId });
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized - No token',
          requestId
        }, 
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log(`[${requestId}] Token received (${token.length} chars)`);
    
    // Log environment variables (without sensitive values)
    console.log(`[${requestId}] Environment check:`, {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
    });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const error = new Error('Missing Supabase environment variables');
      logError('Configuration error', error, { 
        requestId,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error',
          requestId
        },
        { status: 500 }
      );
    }

    // Create a Supabase client with the provided token
    console.log(`[${requestId}] Creating Supabase client...`);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          }
        }
      }
    );
    
    try {
      console.log(`[${requestId}] Setting auth session...`);
      // Set the auth header for this request using the session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: ''
      });
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      // Verify the token and get the user
      console.log(`[${requestId}] Getting user...`);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'No user found');
      }
      
      console.log(`[${requestId}] Authenticated as user:`, user.id);

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
        },
        requestId,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      };

      console.log(`[${requestId}] Request completed successfully in ${Date.now() - startTime}ms`);
      return NextResponse.json(response);
      
    } catch (error: any) {
      logError('Rewards API error', error, { 
        requestId,
        duration: Date.now() - startTime 
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
          requestId
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logError('Unexpected error in rewards API', error, { 
      requestId: 'unknown',
      duration: Date.now() - startTime 
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        requestId: 'unknown'
      },
      { status: 500 }
    );
  }
}
