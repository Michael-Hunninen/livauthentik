'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

interface TestCheckoutFormProps {
  total: number;
  onSuccess: () => void;
}

export default function TestCheckoutForm({ total, onSuccess }: TestCheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'test' | 'success' | 'fail'>('test');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/30',
    cvc: '123',
    name: 'Test User'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentMethod === 'fail') {
        throw new Error('Payment failed: Insufficient funds');
      }
      
      // Show success message
      toast({
        title: 'Payment successful',
        description: 'Your order has been placed successfully!',
      });
      
      // Call the success handler
      onSuccess();
      
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl shadow-sm p-6 border border-border/40"
    >
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selector */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Test Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('test')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                paymentMethod === 'test' 
                  ? 'border-devotionBrown bg-amber-50' 
                  : 'border-border hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${
                  paymentMethod === 'test' 
                    ? 'border-devotionBrown flex items-center justify-center'
                    : 'border-gray-300'
                }`}>
                  {paymentMethod === 'test' && (
                    <div className="w-3 h-3 rounded-full bg-devotionBrown"></div>
                  )}
                </div>
                <span>Test Payment</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-8">Succeeds every time</p>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('success')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                paymentMethod === 'success' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-border hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${
                  paymentMethod === 'success' 
                    ? 'border-green-500 flex items-center justify-center'
                    : 'border-gray-300'
                }`}>
                  {paymentMethod === 'success' && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
                <span>Always Succeed</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-8">Simulate success</p>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('fail')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                paymentMethod === 'fail' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-border hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${
                  paymentMethod === 'fail' 
                    ? 'border-red-500 flex items-center justify-center'
                    : 'border-gray-300'
                }`}>
                  {paymentMethod === 'fail' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
                <span>Always Fail</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-8">Simulate failure</p>
            </button>
          </div>
        </div>
        
        {/* Card Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="1234 1234 1234 1234"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                className="w-full p-2 border border-border rounded-md bg-background"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                CVC
              </label>
              <input
                type="text"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                className="w-full p-2 border border-border rounded-md bg-background"
                placeholder="CVC"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name on Card
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              className="w-full p-2 border border-border rounded-md bg-background"
              placeholder="John Doe"
            />
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-sm font-medium">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-devotionBrown text-white font-medium rounded-md hover:bg-devotionBrown/90 transition-colors disabled:opacity-70 disabled:cursor-not-wait flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </button>
        
        {/* Test Card Notice */}
        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>This is a test payment form. No real transactions will be processed.</p>
          <p>Use any test card details to proceed.</p>
        </div>
      </form>
    </motion.div>
  );
}
