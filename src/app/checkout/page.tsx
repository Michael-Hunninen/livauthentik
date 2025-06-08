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
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isDirect, setIsDirect] = useState(false);
  const [directItems, setDirectItems] = useState<any[]>([]);
  const [directTotal, setDirectTotal] = useState(0);

  // Track if initialization is complete to avoid premature redirects
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check for direct checkout and load items from localStorage
  useEffect(() => {
    // Check if this is a direct checkout from URL parameter
    const params = new URLSearchParams(window.location.search);
    const isDirectCheckout = params.get('direct') === 'true';
    setIsDirect(isDirectCheckout);
    
    if (isDirectCheckout) {
      // Load items from direct checkout storage
      const directCheckoutData = localStorage.getItem('livauthentik-direct-checkout');
      console.log('Direct checkout data:', directCheckoutData);
      
      if (directCheckoutData) {
        try {
          const data = JSON.parse(directCheckoutData);
          console.log('Parsed direct checkout items:', data.items);
          setDirectItems(data.items);
          
          // Calculate total for direct items
          const total = data.items.reduce((sum: number, item: any) => {
            const getNumericPrice = (price: string | number): number => {
              if (typeof price === 'number') return price;
              return parseFloat(price.toString().replace('$', ''));
            };
            
            const itemPrice = getNumericPrice(item.price);
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          setDirectTotal(total);
        } catch (error) {
          console.error('Error parsing direct checkout data:', error);
        }
      } else {
        console.log('No direct checkout data found in localStorage');
      }
    }
    
    // Mark initialization as complete after processing
    setIsInitialized(true);
  }, []);

  // Redirect to home if cart is empty and not direct checkout
  // Only run this check after initialization is complete
  useEffect(() => {
    // Skip this check until initialization is complete
    if (!isInitialized) return;
    
    console.log('Checking if redirect needed:', { 
      isInitialized,
      cartItems: cartItems.length,
      isDirect,
      directItems: directItems.length
    });
    
    if (cartItems.length === 0 && !isDirect) {
      console.log('Redirecting: Empty cart and not direct checkout');
      router.push('/');
    } else if (isDirect && directItems.length === 0) {
      console.log('Redirecting: Direct checkout but no items found');
      router.push('/');
    }
  }, [cartItems, router, isDirect, directItems, isInitialized]);

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
    try {
      // Only set loading if we don't have a client secret yet
      if (!clientSecret) {
        setLoading(true);
      }
      setError(null);
      
      // In a real app, you would call your API to create a PaymentIntent
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate getting a client secret from your backend
      setClientSecret('pi_mock_client_secret_' + Math.random().toString(36).substr(2, 9));
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create payment intent when reaching the payment step
  useEffect(() => {
    if (step === 2 && !clientSecret && !loading) {
      createPaymentIntent();
    }
  }, [step]);

  const handlePaymentSuccess = () => {
    // Clear both regular cart and direct checkout storage
    clearCart();
    localStorage.removeItem('livauthentik-direct-checkout');
    router.push('/checkout/success');
  };

  // Calculate the total price in cents for Stripe
  const calculateTotalInCents = () => {
    if (isDirect) {
      return directItems.reduce((total, item) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
      }, 0);
    } else {
      return cartItems.reduce((total, item) => {
        const price = item.isSubscription && item.subscriptionPrice 
          ? parseFloat(String(item.subscriptionPrice).replace(/[^0-9.]/g, '')) * 100
          : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * 100;
        
        return total + (price * item.quantity);
      }, 0);
    }
  };

  // Get the items to display (either from cart or direct checkout)
  const getDisplayItems = () => {
    return isDirect ? directItems : cartItems;
  };
  
  // Get the total price to display
  const getDisplayTotal = () => {
    return isDirect ? directTotal : cartTotal;
  };

  // Check if we have items to show (either from cart or direct checkout)
  if (cartItems.length === 0 && (!isDirect || directItems.length === 0)) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="text-xs mt-1">Shipping</span>
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-accent' : 'bg-muted'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="text-xs mt-1">Payment</span>
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
                {getDisplayItems().map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-background border border-border flex-shrink-0">
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
                  <span className="text-sm font-medium">${getDisplayTotal().toFixed(2)}</span>
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
                  <span className="text-base font-semibold">${getDisplayTotal().toFixed(2)}</span>
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
            
            {/* Payment Form - Step 2 */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl shadow-sm p-6 border border-border/40"
              >
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4">
                    {error}
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
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
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Your payment information will be securely processed. We never store your full card details.
                    </p>
                    
                    <div className="space-y-4">
                      {loading && !clientSecret ? (
                        <div className="flex justify-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="h-8 w-8 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
                            <span className="text-sm text-muted-foreground">Preparing payment form...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="bg-destructive/10 text-destructive rounded-md p-3">
                          {error}
                          <button
                            onClick={createPaymentIntent}
                            className="mt-2 text-sm text-destructive underline"
                          >
                            Try again
                          </button>
                        </div>
                      ) : clientSecret ? (
                        <StripeProvider clientSecret={clientSecret}>
                          <PaymentForm 
                            total={calculateTotalInCents()}
                            onSuccess={handlePaymentSuccess}
                          />
                        </StripeProvider>
                      ) : null}
                      
                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-2 border border-border rounded-full font-medium hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                        >
                          Back to Shipping
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
