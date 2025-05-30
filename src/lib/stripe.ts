import Stripe from 'stripe';

let stripe: Stripe | null = null;

// Only initialize Stripe if we're in the browser or the secret key is available
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
      appInfo: {
        name: 'LivAuthentik',
        version: '0.1.0',
      },
    });
  }
} catch (err) {
  console.error('Failed to initialize Stripe:', err);
}

export { stripe };

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
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customerId,
    customer_creation: customerId ? undefined : 'always',
    metadata,
  });

  return session;
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['customer', 'items.data.price.product'],
  });
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function getProducts() {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  });

  // Combine products with their prices
  const productsWithPrices = products.data.map((product) => {
    const productPrices = prices.data.filter(
      (price) => price.product === product.id
    );
    return {
      ...product,
      prices: productPrices,
    };
  });

  return productsWithPrices;
}

export async function getProduct(productId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    expand: ['data.product'],
  });

  const defaultPrice = typeof product.default_price === 'object' ? product.default_price : null;
  
  return {
    ...product,
    default_price: defaultPrice,
    prices: prices.data,
  };
}
