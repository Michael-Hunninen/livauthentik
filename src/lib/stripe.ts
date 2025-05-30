import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY env variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  appInfo: {
    name: 'LivAuthentik',
    version: '0.1.0',
  },
});

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    customer_creation: customerId ? undefined : 'always',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });

  return session;
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function getProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });
  
  return products.data.map((product) => {
    const price = product.default_price as Stripe.Price;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.images?.[0] ?? null,
      price: price?.unit_amount ? price.unit_amount / 100 : 0,
      currency: price?.currency ?? 'usd',
      interval: price?.type === 'recurring' ? price.recurring?.interval : null,
      metadata: product.metadata,
    };
  });
}

export async function getProduct(productId: string) {
  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });
  
  const price = product.default_price as Stripe.Price;
  
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? null,
    price: price?.unit_amount ? price.unit_amount / 100 : 0,
    currency: price?.currency ?? 'usd',
    interval: price?.type === 'recurring' ? price.recurring?.interval : null,
    metadata: product.metadata,
  };
}
