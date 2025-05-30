import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerId, isSubscription, paymentType } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Create Supabase server client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user && !customerId) {
      return NextResponse.json(
        { error: 'User must be authenticated' },
        { status: 401 }
      );
    }

    // Create a customer if we don't have one yet
    let customer;
    if (customerId) {
      customer = customerId;
    } else if (user) {
      // Check if customer already exists in Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      if (profile?.stripe_customer_id) {
        customer = profile.stripe_customer_id;
      } else {
        // Create a new customer in Stripe
        const customerData = await stripe.customers.create({
          email: user.email || undefined,
          // Get user's name from profile table instead of directly from user object
          // as Supabase User type doesn't have a name property
          metadata: {
            userId: user.id,
          },
        });

        // Save customer ID to Supabase
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerData.id })
          .eq('id', user.id);

        customer = customerData.id;
      }
    }

    // Calculate amount
    const amount = items.reduce((total: number, item: any) => {
      const price = isSubscription && item.subscriptionPrice 
        ? parseFloat(item.subscriptionPrice.replace(/[^0-9.]/g, '')) * 100
        : parseFloat(item.price.replace(/[^0-9.]/g, '')) * 100;
      
      return total + (price * item.quantity);
    }, 0);

    let paymentIntent;

    if (isSubscription) {
      // For subscriptions, we'll create a subscription
      // This is a simplified example - you'd need to create Products and Prices in Stripe first
      const subscription = await stripe.subscriptions.create({
        customer: customer as string,
        items: items.map((item: any) => ({
          price: item.priceId, // This should be a Stripe Price ID
        })),
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Access payment intent from the invoice
      // TypeScript doesn't recognize expanded fields automatically
      const invoice = subscription.latest_invoice as any;
      paymentIntent = invoice.payment_intent?.client_secret;
    } else {
      // For one-time purchases, create a payment intent
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: 'usd',
        customer: customer as string,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: user?.id || 'anonymous-user',
          items: JSON.stringify(
            items.map((item: any) => ({
              id: item.id || '',
              name: item.name || '',
              quantity: item.quantity || 1,
            }))
          ),
        },
      });

      paymentIntent = intent.client_secret;
    }

    return NextResponse.json({ clientSecret: paymentIntent });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}
