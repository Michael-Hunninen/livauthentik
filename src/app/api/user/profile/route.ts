import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/auth-helpers';

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Fetch user profile data from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }
    
    // Get user's rewards points
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('points, created_at')
      .eq('user_id', user.id)
      .single();
      
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: profile?.full_name || user.email?.split('@')[0],
      memberSince: new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      }),
      rewardsPoints: rewards?.points || 0
    });
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
