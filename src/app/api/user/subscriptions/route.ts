import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/auth-helpers';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // First get the Stripe customer ID from Supabase profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile?.stripe_customer_id) {
      console.error('Error fetching customer ID:', profileError);
      return NextResponse.json({ error: 'Failed to fetch customer information' }, { status: 500 });
    }
    
    if (!stripe) {
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
    }
    
    // Fetch real-time subscriptions directly from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'all', // Get active, past_due, unpaid, canceled, incomplete, incomplete_expired, trialing, paused
      expand: ['data.items.data.price.product'],
      limit: 100 // Adjust based on expected volume
    });
    
    // Format the subscription data for the frontend
    const formattedSubscriptions = subscriptions.data
      // Filter to include only active or paused subscriptions
      .filter(sub => ['active', 'paused', 'past_due', 'trialing'].includes(sub.status))
      .map(sub => {
        const product = sub.items.data[0]?.price.product as Stripe.Product;
        const price = sub.items.data[0]?.price;
        
        // Calculate next delivery date based on current period end
        // Stripe timestamps are in seconds, so multiply by 1000 for JS Date
        const nextDeliveryDate = new Date((sub as any).current_period_end * 1000);
        
        // Get interval for frequency - e.g., "month", "week", "year"
        const interval = price.recurring?.interval || 'month';
        const intervalCount = price.recurring?.interval_count || 1;
        
        // Format frequency display
        const frequency = intervalCount === 1 
          ? `${interval}ly` 
          : `Every ${intervalCount} ${interval}s`;
        
        return {
          id: sub.id,
          product: product?.name || 'Unknown Product',
          variant: product?.metadata?.variant || 'Standard',
          frequency: frequency,
          nextDelivery: nextDeliveryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          price: (price?.unit_amount || 0) / 100, // Convert cents to dollars
          status: sub.status, // Now including the status
          created: new Date(sub.created * 1000).toISOString(),
          pauseCollection: sub.pause_collection, // Contains details if subscription is paused
          cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
          cancelAtPeriodEnd: sub.cancel_at_period_end
        };
      });
    
    return NextResponse.json(formattedSubscriptions);
  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
