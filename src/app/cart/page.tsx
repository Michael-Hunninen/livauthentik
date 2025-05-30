'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    toggleSubscription,
    clearCart
  } = useCart();

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.isSubscription && item.subscriptionPrice !== undefined 
      ? parseFloat(String(item.subscriptionPrice).replace(/[^0-9.-]+/g, '')) 
      : parseFloat(String(item.price).replace(/[^0-9.-]+/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  // Calculate tax (example: 8% tax rate)
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  // Handle quantity update
  const handleQuantityChange = async (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const id = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
    setIsProcessing(id);
    try {
      updateQuantity(id, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update cart');
    } finally {
      setIsProcessing(null);
    }
  };
  
  // Handle remove item
  const handleRemoveItem = async (itemId: string | number) => {
    const id = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
    setIsProcessing(id);
    try {
      removeFromCart(id);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsProcessing(null);
    }
  };
  
  // Handle subscription toggle
  const handleToggleSubscription = async (itemId: string | number) => {
    const id = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
    setIsProcessing(id);
    try {
      toggleSubscription(id);
      toast.success('Subscription updated');
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setIsProcessing(null);
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    setIsLoading(true);
    // Redirect to checkout page
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link href="/products" className="inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Your Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.isSubscription ? 'sub' : 'onetime'}`} 
                     className="flex flex-col sm:flex-row border-b border-border pb-6">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden mb-4 sm:mb-0">
                    {item.imageSrc ? (
                      <Image 
                        src={item.imageSrc} 
                        alt={item.imageAlt || item.name} 
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/20">
                        <span className="text-muted-foreground text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 sm:ml-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.isSubscription && (
                          <span className="inline-block mt-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                            Subscription
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isProcessing === item.id}
                        className="text-muted-foreground hover:text-destructive h-6 w-6 flex items-center justify-center disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        {isProcessing === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isProcessing === item.id || item.quantity <= 1}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          {isProcessing === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </button>
                        <span className="w-10 text-center">
                          {isProcessing === item.id ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isProcessing === item.id}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          {isProcessing === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.isSubscription && item.subscriptionPrice !== undefined 
                            ? (typeof item.subscriptionPrice === 'string' 
                                ? parseFloat(item.subscriptionPrice.replace(/[^0-9.-]+/g, '')) 
                                : item.subscriptionPrice)
                            : (typeof item.price === 'string' 
                                ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity 
                                : item.price * item.quantity)
                          ).toFixed(2)}
                        </p>
                        {item.isSubscription && item.subscriptionPrice !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            ${(typeof item.subscriptionPrice === 'string' 
                              ? parseFloat(item.subscriptionPrice.replace(/[^0-9.-]+/g, '')) 
                              : item.subscriptionPrice).toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {typeof item.subscriptionPrice !== 'undefined' && (
                      <div className="mt-3">
                        <button
                          onClick={() => handleToggleSubscription(item.id)}
                          disabled={isProcessing === item.id}
                          className="text-xs text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {isProcessing === item.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Updating...
                            </>
                          ) : item.isSubscription ? (
                            'Switch to one-time purchase'
                          ) : (
                            'Switch to subscription (save 20%)'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button variant="outline" asChild>
                <Link href="/products" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg" 
                onClick={handleCheckout}
                disabled={isLoading || cartItems.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                or{' '}
                <Link href="/products" className="text-accent hover:underline">
                  continue shopping
                </Link>
              </p>
            </div>
            
            <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-border">
              <h3 className="font-medium text-foreground mb-2">Need help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our customer service team is available to help with any questions.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
