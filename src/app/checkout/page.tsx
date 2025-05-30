'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import StripeProvider from '@/components/checkout/StripeProvider';
import PaymentForm from '@/components/checkout/PaymentForm';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState('');

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const createPaymentIntent = async () => {
    setLoading(true);
    setError('');

    try {
      // Create a payment intent with Stripe
      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          isSubscription: cartItems.some(item => item.isSubscription),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      
      // Move to the next step
      setStep(3);
    } catch (err) {
      setError('An error occurred while preparing your payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    clearCart();
    router.push('/checkout/success');
  };

  // Calculate the total price in cents for Stripe
  const calculateTotalInCents = () => {
    return cartItems.reduce((total, item) => {
      const price = item.isSubscription && item.subscriptionPrice 
        ? parseFloat(String(item.subscriptionPrice).replace(/[^0-9.]/g, '')) * 100
        : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * 100;
      
      return total + (price * item.quantity);
    }, 0);
  };

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-accent' : 'bg-muted'}`}></div>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-accent' : 'bg-muted'}`}></div>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 3 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border/40 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.isSubscription ? 'sub' : 'one'}`} className="flex items-center space-x-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt || item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.isSubscription ? 'Subscription' : 'One-time purchase'}
                      </p>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        <p className="text-sm font-medium text-foreground">
                          {item.isSubscription && item.subscriptionPrice 
                            ? item.subscriptionPrice 
                            : item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium">${(cartTotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="text-sm font-medium">Free</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <span className="text-sm font-medium">Calculated at next step</span>
                </div>
                <div className="flex justify-between py-2 border-t border-border mt-2">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-semibold">${(cartTotal / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Forms */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
            {/* Shipping Information - Step 1 */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl shadow-sm p-6 border border-border/40"
              >
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmitShipping} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="NZ">New Zealand</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
            
            {/* Payment Method Selection - Step 2 */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl shadow-sm p-6 border border-border/40"
              >
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4">
                    {error}
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="card-payment"
                        name="payment-method"
                        className="h-4 w-4 text-accent focus:ring-accent"
                        defaultChecked
                      />
                      <label htmlFor="card-payment" className="text-sm font-medium">
                        Credit / Debit Card
                      </label>
                    </div>
                    
                    <div className="ml-7 flex items-center space-x-2">
                      <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs">Visa</span>
                      </div>
                      <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs">MC</span>
                      </div>
                      <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs">Amex</span>
                      </div>
                      <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs">Disc</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Your payment information will be securely processed. We never store your full card details.
                  </p>
                  
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-accent hover:underline"
                    >
                      Back to Shipping
                    </button>
                    
                    <button
                      type="button"
                      onClick={createPaymentIntent}
                      disabled={loading}
                      className="px-6 py-2 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-70 flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Continue to Payment</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Stripe Payment Form - Step 3 */}
            {step === 3 && clientSecret && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl shadow-sm p-6 border border-border/40"
              >
                <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
                <StripeProvider clientSecret={clientSecret}>
                  <PaymentForm 
                    total={calculateTotalInCents()}
                    onSuccess={handlePaymentSuccess}
                  />
                </StripeProvider>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm text-accent hover:underline"
                  >
                    Back to previous step
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
