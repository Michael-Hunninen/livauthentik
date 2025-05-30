import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Stripe webhook handler
export async function POST(request: Request) {
  if (!stripe) {
    console.error('Stripe is not initialized');
    return NextResponse.json(
      { error: 'Stripe is not properly configured' },
      { status: 500 }
    );
  }

  if (!supabase) {
    console.error('Supabase is not initialized');
    return NextResponse.json(
      { error: 'Supabase is not properly configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET env variable' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // Handle specific event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook: ${error}`);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Helper functions to handle different types of events
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const userId = session.metadata?.userId;
  const productName = session.metadata?.productName;
  const isSubscription = session.metadata?.isSubscription === 'true';

  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }

  // If this is a new customer, save the customer ID to the database
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!existingCustomer) {
    await supabase.from('customers').insert({
      user_id: userId,
      stripe_customer_id: customerId,
      email: session.customer_details?.email,
      created_at: new Date().toISOString(),
    });
  } else {
    // Update the customer record if it exists
    await supabase
      .from('customers')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', userId);
  }

  // Record the order
  await supabase.from('orders').insert({
    user_id: userId,
    stripe_checkout_id: session.id,
    stripe_customer_id: customerId,
    product_name: productName,
    amount: session.amount_total,
    currency: session.currency,
    status: 'completed',
    is_subscription: isSubscription,
    created_at: new Date().toISOString(),
  });

  // If this is a subscription checkout, the subscription record will be created
  // in the handleSubscriptionCreated function when that event fires
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  if (!stripe) {
    console.error('Stripe is not initialized in handleSubscriptionCreated');
    return;
  }

  // Find the customer in our database
  const { data: customer } = await supabase
    .from('customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single();

  if (!customer) {
    console.error('No customer found for subscription');
    return;
  }

  // Get the price and product details
  const priceId = subscription.items.data[0].price.id;
  let price: Stripe.Price;
  let product: Stripe.Product | null = null;
  
  try {
    price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });
    
    if (typeof price.product === 'object' && price.product !== null) {
      product = price.product as Stripe.Product;
    }
  } catch (error) {
    console.error('Error retrieving price details:', error);
    return;
  }
  
  if (!product) {
    console.error('No product found for price:', priceId);
    return;
  }

  // Create the subscription record
  await supabase.from('subscriptions').insert({
    user_id: customer.user_id,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    stripe_price_id: priceId,
    product_id: product.id,
    product_name: product.name,
    price_amount: price.unit_amount,
    currency: price.currency,
    interval: price.type === 'recurring' ? price.recurring?.interval : null,
    status: subscription.status,
    current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    created_at: new Date().toISOString(),
  });

  // Add subscription reward points if applicable
  await addRewardPoints(customer.user_id, 'subscription_created', product.name);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find the subscription in our database
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSubscription) {
    console.error('No subscription found to update');
    return;
  }

  // Update the subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingSubscription.id);

  // If subscription was canceled, add to activity log
  if (subscription.cancel_at_period_end) {
    await supabase.from('activity_log').insert({
      user_id: existingSubscription.user_id,
      action: 'subscription_canceled',
      details: 'Subscription set to cancel at end of billing period',
      created_at: new Date().toISOString(),
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find the subscription in our database
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSubscription) {
    console.error('No subscription found to delete');
    return;
  }

  // Update the subscription status to 'canceled'
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingSubscription.id);

  // Add to activity log
  await supabase.from('activity_log').insert({
    user_id: existingSubscription.user_id,
    action: 'subscription_ended',
    details: 'Subscription has ended',
    created_at: new Date().toISOString(),
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : (invoice as any).subscription?.id;
  if (!subscriptionId) return; // Only handle subscription invoices

  // Find the subscription in our database
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, user_id, product_name')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!subscription) {
    console.error('No subscription found for invoice');
    return;
  }

  // Record the payment
  await supabase.from('payments').insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    period_start: new Date(invoice.period_start * 1000).toISOString(),
    period_end: new Date(invoice.period_end * 1000).toISOString(),
    created_at: new Date().toISOString(),
  });

  // Add reward points for recurring payment
  await addRewardPoints(subscription.user_id, 'renewal_payment', subscription.product_name);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : (invoice as any).subscription?.id;
  if (!subscriptionId) return; // Only handle subscription invoices

  // Find the subscription in our database
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!subscription) {
    console.error('No subscription found for invoice');
    return;
  }

  // Record the failed payment
  await supabase.from('payments').insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    period_start: new Date(invoice.period_start * 1000).toISOString(),
    period_end: new Date(invoice.period_end * 1000).toISOString(),
    created_at: new Date().toISOString(),
  });

  // Add to activity log
  await supabase.from('activity_log').insert({
    user_id: subscription.user_id,
    action: 'payment_failed',
    details: 'Subscription payment failed',
    created_at: new Date().toISOString(),
  });
}

// Helper function to add reward points
async function addRewardPoints(userId: string, action: string, productName: string) {
  let points = 0;
  
  // Determine points based on action
  switch (action) {
    case 'subscription_created':
      points = 500; // New subscription
      break;
    case 'renewal_payment':
      points = 100; // Recurring payment
      break;
    default:
      points = 50; // Default reward
  }
  
  // Add points to user's reward balance
  const { data: existingRewards } = await supabase
    .from('user_rewards')
    .select('id, total_points')
    .eq('user_id', userId)
    .single();
    
  if (existingRewards) {
    // Update existing rewards
    await supabase
      .from('user_rewards')
      .update({
        total_points: existingRewards.total_points + points,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingRewards.id);
  } else {
    // Create new rewards record
    await supabase.from('user_rewards').insert({
      user_id: userId,
      total_points: points,
      created_at: new Date().toISOString(),
    });
  }
  
  // Record points transaction
  await supabase.from('reward_transactions').insert({
    user_id: userId,
    points: points,
    action: action,
    description: `Earned ${points} points for ${productName}`,
    created_at: new Date().toISOString(),
  });
}
