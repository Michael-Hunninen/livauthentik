'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface CheckoutButtonProps {
  priceId: string;
  productName: string;
  isSubscription?: boolean;
  variantName?: string;
  className?: string;
  buttonText?: string;
}

export default function CheckoutButton({
  priceId,
  productName,
  isSubscription = false,
  variantName,
  className,
  buttonText = 'Buy Now'
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const displayName = variantName 
    ? `${productName} - ${variantName}` 
    : productName;

  const handleCheckout = async () => {
    if (!priceId) {
      toast({
        title: 'Error',
        description: 'Product price not found',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          productName: displayName,
          isSubscription,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {buttonText}
    </Button>
  );
}
