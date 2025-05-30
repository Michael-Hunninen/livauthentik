import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { priceId, productName, isSubscription } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get the user session
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'User must be logged in' },
        { status: 401 }
      );
    }

    // Check if user has customer ID in the database
    const { data: customerData } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    const customerId = customerData?.stripe_customer_id;

    // Create the checkout session
    const checkoutSession = await createCheckoutSession({
      priceId,
      customerId,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/dashboard/orders?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/shop?canceled=true`,
      metadata: {
        userId: user.id,
        productName,
        isSubscription: isSubscription ? 'true' : 'false',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
