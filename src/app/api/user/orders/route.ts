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
    
    // Fetch real-time payment intents directly from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      customer: profile.stripe_customer_id,
      limit: 100, // Adjust based on expected volume
      expand: ['data.latest_charge', 'data.payment_method']
    });
    
    // Also fetch charges to get complete order history
    const charges = await stripe.charges.list({
      customer: profile.stripe_customer_id,
      limit: 100, // Adjust based on expected volume
      expand: ['data.invoice', 'data.payment_intent']
    });
    
    // Get order details by checking payment metadata or retrieving from associated invoices
    const chargesMap = new Map();
    
    // Process charges into a map to avoid duplicates (a PaymentIntent might have multiple charges)
    charges.data.forEach((charge) => {
      // Skip charges that are already linked to a payment intent we'll process separately
      if (charge.payment_intent && typeof charge.payment_intent !== 'string') {
        return;
      }
      
      // Use the charge ID as the order ID if no payment intent exists
      const orderId = charge.id;
      chargesMap.set(orderId, {
        id: orderId,
        date: new Date(charge.created * 1000),
        amount: charge.amount,
        currency: charge.currency,
        status: mapStripeStatusToOrderStatus(charge.status),
        metadata: charge.metadata,
        description: charge.description,
        receiptUrl: charge.receipt_url,
        paymentMethod: charge.payment_method_details?.type || 'card',
        items: []
      });
    });
    
    // Process payment intents to get order information
    const formattedOrders = paymentIntents.data
      // Only include successful or processing payment intents
      .filter(intent => [
        'succeeded', 'processing', 'requires_capture', 'requires_confirmation'
      ].includes(intent.status))
      .map(intent => {
        const charge = intent.latest_charge as Stripe.Charge;
        const metadata = intent.metadata || {};
        
        // Extract items from metadata if available
        const items = [];
        if (metadata.items) {
          try {
            const parsedItems = JSON.parse(metadata.items);
            items.push(...parsedItems);
          } catch (e) {
            console.error('Failed to parse items metadata:', e);
          }
        }
        
        // If no items were found in metadata, create a placeholder item
        if (items.length === 0) {
          items.push({
            name: metadata.productName || intent.description || 'Product Purchase',
            variant: metadata.variant || 'Standard',
            price: (intent.amount || 0) / 100, // Convert from cents
            quantity: metadata.quantity || 1
          });
        }
        
        return {
          id: intent.id,
          date: new Date(intent.created * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          total: (intent.amount || 0) / 100, // Convert from cents
          status: mapStripeStatusToOrderStatus(intent.status),
          items,
          receiptUrl: charge?.receipt_url || null,
          paymentMethod: intent.payment_method_types[0] || 'card'
        };
      });
      
    // Add charges that weren't part of a payment intent 
    chargesMap.forEach((charge) => {
      formattedOrders.push({
        id: charge.id,
        date: charge.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        total: charge.amount / 100, // Convert from cents
        status: charge.status,
        items: charge.items.length ? charge.items : [{
          name: charge.description || 'Product Purchase',
          variant: 'Standard',
          price: charge.amount / 100,
          quantity: 1
        }],
        receiptUrl: charge.receiptUrl,
        paymentMethod: charge.paymentMethod
      });
    });
    
    // Sort orders by date (newest first)
    formattedOrders.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to map Stripe status to more user-friendly order status
function mapStripeStatusToOrderStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'succeeded':
      return 'Delivered';
    case 'processing':
      return 'Processing';
    case 'requires_capture':
      return 'Processing';
    case 'requires_payment_method':
      return 'Payment Failed';
    case 'requires_confirmation':
      return 'Pending';
    case 'canceled':
      return 'Canceled';
    default:
      return 'Processing';
  }
}
