'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import StripeProvider from '@/components/checkout/StripeProvider';
import PaymentForm from '@/components/checkout/PaymentForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import TestCheckoutForm from '@/components/checkout/TestCheckoutForm';

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
  const [rewards, setRewards] = useState<any[]>([]);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [appliedReward, setAppliedReward] = useState<any>(null);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);
  const supabase = createClientComponentClient();
  
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
    
    // Check for stored rewards in sessionStorage and prepare to apply them
    const storedRewardId = sessionStorage.getItem('checkoutRewardId');
    const storedRewardName = sessionStorage.getItem('checkoutRewardName');
    
    if (storedRewardId && storedRewardName) {
      console.log('🎁 Found stored reward in sessionStorage:', { id: storedRewardId, name: storedRewardName });
      
      // We'll load rewards and then apply this automatically
      setSelectedReward(storedRewardId);
    }
    
    // Mark initialization as complete after processing
    setIsInitialized(true);
  }, []);

  // Generate mock rewards for testing when API is not available
  const generateMockRewards = () => [
    { 
      id: 'free-shipping', 
      name: 'Free Shipping', 
      description: 'Free shipping on your next order', 
      pointsCost: 100,
      points_cost: 100
    },
    { 
      id: '10-off', 
      name: '10% Off', 
      description: '10% off your next purchase up to $50', 
      pointsCost: 200,
      points_cost: 200
    },
    { 
      id: '5-credit', 
      name: '$5 Store Credit', 
      description: 'Get $5 credit for your next purchase',
      pointsCost: 300,
      points_cost: 300
    },
    { 
      id: 'free-gift', 
      name: 'Free Mystery Gift', 
      description: 'Free mystery gift with your next order',
      pointsCost: 500,
      points_cost: 500
    },
    { 
      id: 'vip-access', 
      name: 'VIP Early Access', 
      description: 'Early access to new products and sales',
      pointsCost: 1000,
      points_cost: 1000
    }
  ];

  // Load available rewards
  const loadRewards = async () => {
    // Skip if already loading
    if (isLoadingRewards) return;
    
    console.log('🚀 Starting to load rewards...');
    setIsLoadingRewards(true);
    
    try {
      // Debug: Check auth state
      console.log('🔍 Checking auth state...');
      
      // Get current session and user
      const [{ data: { user }, error: userError }, { data: { session }, error: sessionError }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.auth.getSession()
      ]);
      
      console.log('🔑 Initial auth state:', {
        hasUser: !!user,
        userEmail: user?.email,
        hasSession: !!session,
        sessionAge: session?.user?.created_at ? 
          `${Math.floor((Date.now() - new Date(session.user.created_at).getTime()) / 1000)}s old` : 'unknown',
        userError: userError?.message,
        sessionError: sessionError?.message,
        accessToken: session?.access_token ? '***' : 'none'
      });

      // Check if we have a valid session
      let currentSession = session;
      
      // If no active session or user, try to recover
      if (!currentSession || !user || sessionError || userError) {
        console.log('🔒 No active session or user found, checking localStorage...');
        
        // Check if we have auth data in localStorage
        const authData = typeof window !== 'undefined' ? localStorage.getItem('sb-adkrrjokgpufehpxinsr-auth-token') : null;
        console.log('📦 LocalStorage auth data:', authData ? 'exists' : 'not found');
        
        if (authData) {
          try {
            const parsedAuth = JSON.parse(authData);
            console.log('🔄 Attempting to set session from localStorage...');
            const { data: { session: newSession }, error: setSessionError } = await supabase.auth.setSession({
              access_token: parsedAuth.access_token,
              refresh_token: parsedAuth.refresh_token
            });
            
            if (newSession && !setSessionError) {
              console.log('✅ Successfully restored session from localStorage');
              currentSession = newSession; // Update the current session
            } else {
              throw setSessionError || new Error('Failed to restore session');
            }
          } catch (e) {
            console.error('❌ Error restoring session from localStorage:', e);
            // Clear invalid auth data
            if (typeof window !== 'undefined') {
              localStorage.removeItem('sb-adkrrjokgpufehpxinsr-auth-token');
            }
            throw e;
          }
        }
        
        // If we still don't have a session, try to refresh
        if (!currentSession) {
          console.log('🔄 Attempting to refresh session...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshedSession) {
            console.log('✅ Session refreshed successfully');
            currentSession = refreshedSession; // Update the current session
          } else {
            console.error('❌ Failed to refresh session:', refreshError?.message || 'Unknown error');
            console.log('🎁 Falling back to mock rewards');
            const mockRewards = generateMockRewards();
            setRewards(mockRewards);
            return;
          }
        }
      }
      
      // At this point, we should have a valid session
      if (!currentSession) {
        console.error('❌ No session available after refresh');
        throw new Error('Authentication required');
      }
      
      console.log('👤 Session found for user:', currentSession.user?.email);
      
      // Try to fetch from API
      console.log('🌐 Fetching rewards from API...');
      const response = await fetch('/api/user/rewards', {
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });
      
      const responseData = await response.json();
      console.log('📦 API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      if (response.ok) {
        const rewardsData = responseData.data || responseData;
        let redeemableRewards = [];
        
        if (Array.isArray(rewardsData.redeemableRewards)) {
          // If we got an array of rewards
          redeemableRewards = rewardsData.redeemableRewards;
        } else if (rewardsData.redeemableRewards && Array.isArray(rewardsData.redeemableRewards.data)) {
          // If rewards are nested in a data property
          redeemableRewards = rewardsData.redeemableRewards.data;
        } else if (Array.isArray(rewardsData)) {
          // If the response is directly an array of rewards
          redeemableRewards = rewardsData;
        }
        
        if (redeemableRewards.length > 0) {
          console.log('✅ Loaded rewards from API:', redeemableRewards);
          setRewards(redeemableRewards);
          
          // Process URL rewards first
          processUrlRewards(redeemableRewards);
          
          // Check if we have a selected reward that should be auto-applied
          const storedRewardId = sessionStorage.getItem('checkoutRewardId');
          if (storedRewardId && selectedReward === storedRewardId) {
            console.log('🔄 Auto-applying stored reward:', storedRewardId);
            
            // Find matching reward
            const rewardToApply = redeemableRewards.find((r: any) => r.id === storedRewardId);
            if (rewardToApply) {
              // Calculate discount amount based on reward type
              let discountAmount = 0;
              const subtotal = getDisplayTotal();
              
              if (rewardToApply.id === '10-off' || rewardToApply.id.includes('10%')) {
                // 10% off discount
                discountAmount = subtotal * 0.1;
              } else if (rewardToApply.id === '5-credit' || rewardToApply.id.includes('$5')) {
                // $5 credit
                discountAmount = 5;
              } else if (rewardToApply.id === 'free-shipping' || rewardToApply.id.includes('shipping')) {
                // Free shipping
                discountAmount = 0;
              } else if (rewardToApply.id.includes('20%')) {
                // 20% off
                discountAmount = subtotal * 0.2;
              }
              
              // Apply the reward
              setAppliedReward({
                ...rewardToApply,
                discountAmount
              });
              
              toast({
                title: 'Reward applied',
                description: `${rewardToApply.name} has been applied to your order.`,
              });
              
              console.log('✅ Successfully applied reward with discount:', discountAmount);
            }
          }
        } else {
          console.warn('⚠️ No rewards found in API response, using mock rewards');
          const mockRewards = generateMockRewards();
          setRewards(mockRewards);
        }
      } else {
        console.error('❌ API Error:', responseData.error || 'Unknown error');
        throw new Error(responseData.error?.message || 'Failed to load rewards');
      }
    } catch (error) {
      console.error('🔥 Error loading rewards:', error);
      const mockRewards = generateMockRewards();
      console.log('🎁 Falling back to mock rewards due to error');
      setRewards(mockRewards);
    } finally {
      setIsLoadingRewards(false);
    }
  };
  
  // Process URL rewards
  const processUrlRewards = (availableRewards: any[]) => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    try {
      console.log('🔍 Checking for rewards in URL...');
      
      // Always check URL parameters first
      const params = new URLSearchParams(window.location.search);
      const urlRewardId = params.get('applyReward');
      const urlRewardName = params.get('rewardName');
      
      // Check if we have URL parameters
      if (urlRewardId && urlRewardName) {
        console.log('🔗 Found reward in URL:', { id: urlRewardId, name: urlRewardName });
        
        // Store in session storage as backup
        sessionStorage.setItem('checkoutRewardId', urlRewardId);
        sessionStorage.setItem('checkoutRewardName', urlRewardName);
        
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('applyReward');
        newUrl.searchParams.delete('rewardName');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Process the reward
        applyRewardById(urlRewardId, urlRewardName, availableRewards);
      } 
      // Check session storage if no URL params
      else {
        const storedRewardId = sessionStorage.getItem('checkoutRewardId');
        const storedRewardName = sessionStorage.getItem('checkoutRewardName');
        
        if (storedRewardId && storedRewardName) {
          console.log('📦 Found stored reward in session storage:', { 
            id: storedRewardId, 
            name: storedRewardName 
          });
          
          // Process the stored reward
          applyRewardById(storedRewardId, storedRewardName, availableRewards);
        } else {
          console.log('ℹ️ No reward parameters found in URL or session storage');
        }
      }
    } catch (error) {
      console.error('❌ Error processing URL rewards:', error);
    }
  };
  
  // Helper function to apply a reward by ID
  const applyRewardById = (rewardId: string, rewardName: string, availableRewards: any[]) => {
    console.log('🎁 Processing reward:', { rewardId, rewardName });
    
    // Find the reward in available rewards
    const reward = availableRewards.find((r: any) => r.id === rewardId);
    
    if (reward) {
      console.log('✅ Found matching reward:', reward);
      setSelectedReward(rewardId);
      
      // Calculate discount amount based on reward type
      const subtotal = isDirect ? directTotal : cartTotal; // Get raw subtotal without any discounts
      let discountAmount = 0;
      
      if (reward.id === '10-off' || reward.id.includes('10%')) {
        // 10% off discount
        discountAmount = subtotal * 0.1;
      } else if (reward.id === '5-credit' || reward.id.includes('5-off') || reward.name.includes('$5')) {
        // $5 credit
        discountAmount = 5;
      } else if (reward.id === 'free-shipping' || reward.id.includes('shipping') || reward.name.toLowerCase().includes('shipping')) {
        // Free shipping - handled separately in shipping cost calculation
        discountAmount = 0;
      } else if (reward.id.includes('20%') || reward.name.includes('20%')) {
        // 20% off
        discountAmount = subtotal * 0.2;
      }
      
      console.log('💰 Calculated discount amount:', discountAmount, 'for subtotal:', subtotal);
      
      // Apply the reward
      setAppliedReward({
        ...reward,
        name: rewardName || reward.name,
        discountAmount
      });
      
      // Show toast confirmation
      toast({
        title: 'Reward applied',
        description: `${rewardName || reward.name} has been applied to your order.`,
      });
      
      return true;
    } else {
      console.warn('⚠️ Reward not found in available rewards:', rewardId);
      return false;
    }
  };
  
  // Load rewards on mount
  useEffect(() => {
    loadRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle successful payment
  const handlePaymentSuccess = () => {
    // Clear both regular cart and direct checkout storage
    clearCart();
    localStorage.removeItem('livauthentik-direct-checkout');
    router.push('/checkout/success');
  };

  // Calculate the raw subtotal without any discounts
  const calculateRawSubtotal = () => {
    let subtotal = 0;
    
    if (isDirect) {
      subtotal = directItems.reduce((total, item) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
      }, 0);
    } else {
      subtotal = cartItems.reduce((total, item) => {
        const price = item.isSubscription && item.subscriptionPrice 
          ? parseFloat(String(item.subscriptionPrice).replace(/[^0-9.]/g, ''))
          : parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
      }, 0);
    }
    
    console.log('Calculated raw subtotal:', subtotal);
    return subtotal;
  };
  
  const handleApplyReward = () => {
    if (!selectedReward) return;
    
    const reward = rewards.find(r => r.id === selectedReward);
    if (!reward) {
      console.error('Selected reward not found:', selectedReward);
      return;
    }
    
    // Get the raw subtotal without any discounts
    const subtotal = calculateRawSubtotal();
    let discountAmount = 0;
    
    console.log('Applying reward:', {
      rewardId: reward.id,
      rewardName: reward.name,
      subtotal,
      directTotal,
      cartTotal,
      isDirect,
      rewardDetails: reward
    });
    
    // Calculate discount amount based on reward type
    const rewardName = (reward.name || '').toLowerCase();
    
    if (rewardName.includes('20%')) {
      // 20% off
      discountAmount = subtotal * 0.2;
      console.log('Applied 20% discount:', discountAmount);
    } else if (rewardName.includes('10%')) {
      // 10% off discount
      discountAmount = subtotal * 0.1;
      console.log('Applied 10% discount:', discountAmount);
    } else if (rewardName.includes('$5') || rewardName.includes('5$') || rewardName.includes('5 off')) {
      // $5 credit
      discountAmount = Math.min(5, subtotal); // Cap at subtotal to avoid negative total
      console.log('Applied $5 discount:', discountAmount);
    } else if (rewardName.includes('shipping')) {
      // Free shipping - handled in shipping cost calculation
      discountAmount = 0;
      console.log('Applied free shipping');
    }
    
    console.log('Final discount amount:', discountAmount, 'for subtotal:', subtotal);
    
    // Apply the reward
    setAppliedReward({
      ...reward,
      discountAmount
    });
    
    toast({
      title: 'Reward applied',
      description: `${reward.name} has been applied to your order.`,
    });
  };
  
  const handleRemoveReward = () => {
    setAppliedReward(null);
    setSelectedReward(null);
  };

  // Calculate the total price in cents for Stripe
  const calculateTotalInCents = () => {
    // Use the display total which already includes the discount
    const displayTotal = getDisplayTotal();
    
    // Convert to cents and round to nearest integer for Stripe
    return Math.round(displayTotal * 100);
  };
  
  // Calculate the raw subtotal without any discounts (for display)
  const getSubtotal = (): number => {
    if (isDirect) {
      return directItems.reduce((total, item) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
      }, 0);
    } else {
      return cartItems.reduce((total, item) => {
        const price = item.isSubscription && item.subscriptionPrice 
          ? parseFloat(String(item.subscriptionPrice).replace(/[^0-9.]/g, ''))
          : parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
      }, 0);
    }
  };

  // Calculate shipping cost based on subtotal and applied rewards
  const calculateShippingCost = (): number => {
    const subtotal = getSubtotal();
    
    // Check if free shipping reward is applied
    const hasFreeShipping = appliedReward?.name?.toLowerCase().includes('free shipping');
    
    // Free shipping for orders over $250 or if free shipping reward is applied
    if (subtotal >= 250 || hasFreeShipping) {
      return 0;
    }
    
    // Standard shipping cost
    return 9.95;
  };

  // Get the items to display (either from cart or direct checkout)
  const getDisplayItems = () => {
    return isDirect ? directItems : cartItems;
  };

  // Get the total price to display (subtotal - discount + shipping)
  const getDisplayTotal = () => {
    const subtotal = getSubtotal();
    const shippingCost = calculateShippingCost();
    let total = subtotal;
    
    // Apply reward discount if available
    if (appliedReward?.discountAmount !== undefined && appliedReward.discountAmount > 0) {
      total = Math.max(0, subtotal - appliedReward.discountAmount);
      
      console.log('Calculating display total:', {
        subtotal,
        discount: appliedReward.discountAmount,
        shipping: shippingCost,
        finalTotal: total + shippingCost,
        reward: appliedReward.name
      });
    }
    
    // Add shipping cost to the total
    return total + shippingCost;
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
              
              {/* Rewards Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-foreground">Your Rewards</h3>
                  <button
                    onClick={loadRewards}
                    disabled={isLoadingRewards}
                    className="text-xs text-devotionBrown hover:underline flex items-center"
                    title="Refresh rewards"
                  >
                    {isLoadingRewards ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-devotionBrown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </>
                    )}
                  </button>
                </div>
                
                {error ? (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700 mb-2">{error}</p>
                    <button
                      onClick={loadRewards}
                      className="text-xs text-red-700 hover:underline font-medium"
                    >
                      Try again
                    </button>
                  </div>
                ) : isLoadingRewards ? (
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/40 flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-devotionBrown/30 border-t-devotionBrown rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-muted-foreground">Loading rewards...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appliedReward ? (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-green-800">Applied Reward</h4>
                            <p className="text-sm text-green-600">{appliedReward.name}</p>
                          </div>
                          <button
                            onClick={handleRemoveReward}
                            className="text-sm text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : rewards.length > 0 ? (
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <label className="block font-medium text-amber-800 mb-2">Apply Reward</label>
                        <div className="flex gap-2">
                          <select 
                            value={selectedReward || ''}
                            onChange={(e) => setSelectedReward(e.target.value || null)}
                            className="flex-1 p-2 border border-amber-200 bg-white rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value="">Select a reward</option>
                            {rewards.map((reward) => (
                              <option key={reward.id} value={reward.id}>
                                {reward.name} - {reward.points_cost || reward.pointsCost || 0} points
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleApplyReward}
                            disabled={!selectedReward}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/30 rounded-lg border border-border/40 text-center">
                        <p className="text-sm text-muted-foreground mb-2">You don't have any rewards yet</p>
                        <Link 
                          href="/account/rewards" 
                          className="text-sm text-devotionBrown hover:underline font-medium inline-flex items-center"
                        >
                          Earn rewards
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    )}
                    
                    {rewards.length > 0 && (
                      <div className="text-xs text-muted-foreground text-center">
                        <p>Don't see your reward? Try refreshing the list.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Removed duplicate Applied Reward message */}
              
              <div className="space-y-4 mb-4">
                {getDisplayItems().map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-background border border-border flex-shrink-0">
                      <Image
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-foreground">
                        {item.isSubscription && item.subscriptionPrice 
                          ? item.subscriptionPrice 
                          : item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-border pt-4">
                <div className="space-y-2">
                  {/* Subtotal (before any discounts) */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-medium">${getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {/* Applied Reward Discount */}
                  {appliedReward?.discountAmount ? (
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">
                        {appliedReward.name}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        -${appliedReward.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  ) : null}
                  
                  {/* Shipping Cost */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span className="text-sm font-medium">
                      {calculateShippingCost() > 0 
                        ? `$${calculateShippingCost().toFixed(2)}` 
                        : 'Free'}
                    </span>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-semibold">
                        ${getDisplayTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    {appliedReward?.discountAmount ? (
                      <p className="text-xs text-green-600 mt-1">
                        {appliedReward.name} applied (${appliedReward.discountAmount.toFixed(2)} off)
                      </p>
                    ) : null}
                  </div>
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
                    
                    {step === 2 ? (
                      <TestCheckoutForm 
                        total={getDisplayTotal() - (appliedReward?.discountAmount || 0)}
                        onSuccess={handlePaymentSuccess}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-border rounded-full font-medium hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                          >
                            Back to Cart
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-devotionBrown text-white font-medium rounded-full hover:bg-devotionBrown/90 transition-colors"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </div>
                    )}
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
