'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  
  // If someone tries to access this page directly without completing checkout
  // redirect them to the homepage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cartItems.length > 0) {
        router.push('/');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [cartItems, router]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-card rounded-xl shadow-sm p-8 md:p-12 border border-border/40 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Order Confirmed!</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. We have received your order and will process it shortly.
            A confirmation email has been sent to your email address.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">What happens next?</h2>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>You will receive an order confirmation email with details of your purchase.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Your order will be processed and prepared for shipping within 1-2 business days.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Once your order ships, you'll receive a shipping confirmation email with tracking information.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/account/orders"
              className="w-full sm:w-auto bg-accent text-accent-foreground px-6 py-3 rounded-md hover:bg-accent/90 transition-colors text-center"
            >
              View Order Details
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto border border-border bg-card text-foreground px-6 py-3 rounded-md hover:bg-muted transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
