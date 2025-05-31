import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Hardcoded Supabase configuration
const SUPABASE_URL = 'https://adkrrjokgpufehpxinsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Jyam9rZ3B1ZmVocHhpbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU2NzcsImV4cCI6MjA2NDIyMTY3N30.9orYHKtsT-YsDRGrIJrj7D5hg825dupR7QwcAYf_1hk';

// Create a type-safe Supabase client
let supabase: SupabaseClient;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw error; // Fail fast if we can't initialize Supabase
}

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
  if (!supabase) {
    console.error('Supabase is not initialized in handleCheckoutSessionCompleted');
    return;
  }

  const customerId = session.customer as string;
  const userId = session.metadata?.userId;
  const productName = session.metadata?.productName || 'Unknown Product';
  const isSubscription = session.metadata?.isSubscription === 'true';

  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }

  try {
    // If this is a new customer, save the customer ID to the database
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('id, stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the code for no rows returned
      console.error('Error fetching customer:', fetchError);
      return;
    }

    if (!existingCustomer) {
      // Create new customer record
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          email: session.customer_details?.email || null,
          has_active_subscription: isSubscription,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError || !newCustomer) {
        console.error('Error creating customer:', insertError);
        return;
      }
    } else if (existingCustomer.stripe_customer_id !== customerId) {
      // Update the customer record if the Stripe customer ID has changed
      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating customer:', updateError);
        return;
      }
    }

    // Record the order
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        stripe_checkout_id: session.id,
        stripe_customer_id: customerId,
        product_name: productName,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'completed',
        is_subscription: isSubscription,
        created_at: new Date().toISOString(),
      });

    if (orderError) {
      console.error('Error recording order:', orderError);
      return;
    }

    // Add reward points for the purchase
    if (session.amount_total && session.amount_total > 0) {
      await addRewardPoints(userId, 'purchase_completed', productName);
    }

    // Log the successful purchase
    const { error: logError } = await supabase
      .from('activity_log')
      .insert({
        user_id: userId,
        action: 'purchase_completed',
        details: `Successfully purchased ${productName} for $${(session.amount_total || 0) / 100}`,
        created_at: new Date().toISOString(),
      });

    if (logError) {
      console.error('Error logging purchase activity:', logError);
    }
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  if (!stripe) {
    console.error('Stripe is not initialized in handleSubscriptionCreated');
    return;
  }

  if (!supabase) {
    console.error('Supabase is not initialized in handleSubscriptionCreated');
    return;
  }

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const userId = subscription.metadata?.userId;
  const currentPeriodEnd = (subscription as any).current_period_end as number;

  if (!priceId || !userId) {
    console.error('Missing priceId or userId in subscription metadata');
    return;
  }

  try {
    // Get the price and product details from Stripe
    const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
    const product = price.product as Stripe.Product;

    // Save the subscription to the database
    const { data: subscriptionData, error: upsertError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        stripe_price_id: priceId,
        stripe_current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        status: subscription.status,
        product_name: product.name,
        product_description: product.description || null,
        amount: price.unit_amount || 0,
        currency: price.currency,
        interval: price.recurring?.interval || null,
        interval_count: price.recurring?.interval_count || null,
        created: new Date(subscription.created * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      return;
    }

    // Update the customer's subscription status
    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        has_active_subscription: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating customer subscription status:', updateError);
      return;
    }

    // Add reward points for subscription
    await addRewardPoints(userId, 'subscription_created', product.name);
    
    // Log the subscription creation
    const { error: logError } = await supabase.from('activity_log').insert({
      user_id: userId,
      action: 'subscription_created',
      details: `New subscription created for ${product.name}`,
      created_at: new Date().toISOString(),
    });

    if (logError) {
      console.error('Error logging subscription creation:', logError);
    }
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  if (!supabase) {
    console.error('Supabase is not initialized in handleSubscriptionUpdated');
    return;
  }

  try {
    // Find the subscription in our database
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('user_id, status')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (fetchError) {
      console.error('Error fetching subscription:', fetchError);
      return;
    }

    // Update the subscription status
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return;
    }

    // If the subscription was cancelled, update the customer's status
    if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
      if (existingSubscription?.user_id) {
        const { error: customerError } = await supabase
          .from('customers')
          .update({ has_active_subscription: false })
          .eq('user_id', existingSubscription.user_id);

        if (customerError) {
          console.error('Error updating customer status:', customerError);
        }
      }
    }
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (!supabase) {
    console.error('Supabase is not initialized in handleSubscriptionDeleted');
    return;
  }

  try {
    // Find the subscription in our database
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (fetchError) {
      console.error('Error fetching subscription:', fetchError);
      return;
    }

    if (!existingSubscription) {
      console.error('No subscription found to delete');
      return;
    }

    // Delete the subscription
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', existingSubscription.id);

    if (deleteError) {
      console.error('Error deleting subscription:', deleteError);
      return;
    }

    // Update the customer's status
    const { error: updateError } = await supabase
      .from('customers')
      .update({ has_active_subscription: false })
      .eq('user_id', existingSubscription.user_id);

    if (updateError) {
      console.error('Error updating customer status:', updateError);
      return;
    }

    // Add to activity log
    const { error: logError } = await supabase.from('activity_log').insert({
      user_id: existingSubscription.user_id,
      action: 'subscription_canceled',
      details: 'Subscription was canceled',
      created_at: new Date().toISOString(),
    });

    if (logError) {
      console.error('Error adding to activity log:', logError);
    }
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!supabase) {
    console.error('Supabase is not initialized in handleInvoicePaymentSucceeded');
    return;
  }

  try {
    const subscriptionId = typeof (invoice as any).subscription === 'string' 
      ? (invoice as any).subscription 
      : (invoice as any).subscription?.id;
      
    if (!subscriptionId) {
      console.log('No subscription ID found in invoice, skipping');
      return; // Only handle subscription invoices
    }

    // Find the subscription in our database
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, user_id, product_name')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return;
    }

    if (!subscription) {
      console.error('No subscription found for invoice');
      return;
    }

    // Record the payment
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
      period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
      created_at: new Date().toISOString(),
    });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      return;
    }

    // Add reward points for recurring payment
    await addRewardPoints(subscription.user_id, 'renewal_payment', subscription.product_name || 'Unknown Product');
  } catch (error) {
    console.error('Error in handleInvoicePaymentSucceeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!supabase) {
    console.error('Supabase is not initialized in handleInvoicePaymentFailed');
    return;
  }

  try {
    const subscriptionId = typeof (invoice as any).subscription === 'string' 
      ? (invoice as any).subscription 
      : (invoice as any).subscription?.id;
      
    if (!subscriptionId) {
      console.log('No subscription ID found in failed invoice, skipping');
      return; // Only handle subscription invoices
    }

    // Find the subscription in our database
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, user_id, product_name')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return;
    }

    if (!subscription) {
      console.error('No subscription found for failed invoice');
      return;
    }

    // Record the failed payment
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      failure_reason: invoice.next_payment_attempt ? 'retry_pending' : 'final',
      period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
      period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
      created_at: new Date().toISOString(),
    });

    if (paymentError) {
      console.error('Error recording failed payment:', paymentError);
      return;
    }

    // Add to activity log
    const { error: logError } = await supabase.from('activity_log').insert({
      user_id: subscription.user_id,
      action: 'payment_failed',
      details: `Payment of $${(invoice.amount_due / 100).toFixed(2)} failed for ${subscription.product_name || 'your subscription'}`,
      created_at: new Date().toISOString(),
    });

    if (logError) {
      console.error('Error adding to activity log:', logError);
    }

    // Notify user of payment failure
    const { error: notificationError } = await supabase.from('notifications').insert({
      user_id: subscription.user_id,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `We couldn't process your payment for ${subscription.product_name || 'your subscription'}. Please update your payment method.`,
      read: false,
      created_at: new Date().toISOString(),
    });

    if (notificationError) {
      console.error('Error creating payment failed notification:', notificationError);
    }
  } catch (error) {
    console.error('Error in handleInvoicePaymentFailed:', error);
  }
}

// Helper function to add reward points
async function addRewardPoints(userId: string, action: string, productName: string) {
  if (!supabase) {
    console.error('Supabase is not initialized in addRewardPoints');
    return;
  }

  try {
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
    const { data: existingRewards, error: fetchError } = await supabase
      .from('user_rewards')
      .select('id, total_points')
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
      console.error('Error fetching user rewards:', fetchError);
      return;
    }
    
    if (existingRewards) {
      // Update existing rewards
      const { error: updateError } = await supabase
        .from('user_rewards')
        .update({ 
          total_points: (existingRewards.total_points || 0) + points,
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingRewards.id);

      if (updateError) {
        console.error('Error updating user rewards:', updateError);
        return;
      }
    } else {
      // Create new rewards record
      const { error: insertError } = await supabase
        .from('user_rewards')
        .insert({
          user_id: userId,
          total_points: points,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating user rewards:', insertError);
        return;
      }
    }
    
    // Log the reward
    const { error: logError } = await supabase.from('reward_history').insert({
      user_id: userId,
      points: points,
      action: action,
      description: `Earned ${points} points for ${action}: ${productName}`,
      created_at: new Date().toISOString()
    });

    if (logError) {
      console.error('Error logging reward:', logError);
    }
  } catch (error) {
    console.error('Error in addRewardPoints:', error);
  }
}
