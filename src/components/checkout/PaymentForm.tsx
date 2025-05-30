'use client';

import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface PaymentFormProps {
  total: number;
  onSuccess: () => void;
}

export default function PaymentForm({ total, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          title: 'Payment failed',
          description: error.message || 'An unknown error occurred',
          variant: 'destructive',
        });
      } else {
        // Payment succeeded!
        toast({
          title: 'Payment successful',
          description: 'Thank you for your purchase!',
        });
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred during payment processing.');
      toast({
        title: 'Payment error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-sm text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Total</span>
          <span className="text-sm font-bold">
            ${(total / 100).toFixed(2)}
          </span>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(total / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
}
