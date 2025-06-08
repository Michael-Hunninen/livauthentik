'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#a27b5c',
            colorBackground: '#fffff0',
            colorText: '#1a0f08',
            colorDanger: '#df1b41',
            fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }
    : {};

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
