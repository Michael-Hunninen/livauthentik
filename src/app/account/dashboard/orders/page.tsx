'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrdersPage() {
  // Mock active orders - in a real app, this would come from your order database
  const initialOrders = [
    {
      id: 'ORD-2025-4289',
      date: 'May 25, 2025',
      total: 149.99,
      status: 'Processing',
      trackingNumber: 'USPS-4821956234',
      estimatedDelivery: 'June 2, 2025',
      items: [
        { name: 'Devotion Protein', variant: 'Single Pack', price: 49.99, quantity: 1, image: '/images/product-1.jpg' },
        { name: 'Ultimate Devotion Bundle', variant: 'One Bag', price: 99.99, quantity: 1, image: '/images/bundle-product.jpg' }
      ]
    }
  ];

  // Mock past orders
  const pastOrders = [
    {
      id: 'ORD-2025-4156',
      date: 'May 10, 2025',
      total: 49.99,
      status: 'Delivered',
      items: [
        { name: 'Devotion Protein', variant: 'Single Pack', price: 49.99, quantity: 1, image: '/images/product-1.jpg' }
      ]
    },
    {
      id: 'ORD-2025-4012',
      date: 'April 15, 2025',
      total: 99.99,
      status: 'Delivered',
      items: [
        { name: 'Ultimate Devotion Bundle', variant: 'One Bag', price: 99.99, quantity: 1, image: '/images/bundle-product.jpg' }
      ]
    }
  ];

  // Mock subscription data - in a real app, this would come from your subscription system
  const subscriptions = [
    {
      id: 'SUB-2025-872',
      product: 'Devotion Protein',
      variant: 'Single Pack',
      frequency: 'Monthly',
      nextDelivery: 'June 15, 2025',
      price: 44.99,
      status: 'Active',
      startDate: 'May 15, 2025',
      image: '/images/product-1.jpg'
    }
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'past-orders', or 'subscriptions'

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = (orderId: string) => {
    // In a real app, you would call your API to cancel the order
    // For this demo, we'll just update the local state
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Cancellation Requested' } 
        : order
    ));
  };

  const handlePauseSubscription = (subscriptionId: string) => {
    // In a real app, this would trigger an API call to pause the subscription
    alert(`Subscription ${subscriptionId} would be paused. In a real app, this would update your subscription status.`);
  };

  const handleSkipDelivery = (subscriptionId: string) => {
    // In a real app, this would trigger an API call to skip the next delivery
    alert(`Next delivery for subscription ${subscriptionId} would be skipped. In a real app, this would update your next delivery date.`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
          Your Orders & Subscriptions
        </h1>
        <p className="text-muted-foreground">
          Track, manage, and modify your orders and subscriptions
        </p>
      </div>

      <div className="flex border-b border-border/10 mb-6 overflow-x-auto">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'text-accent border-b-2 border-accent' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Current Orders
          </button>
          <button
            onClick={() => setActiveTab('past-orders')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'past-orders' 
                ? 'text-accent border-b-2 border-accent' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Past Orders
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'subscriptions' 
                ? 'text-accent border-b-2 border-accent' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Subscriptions
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <motion.div variants={itemVariants}>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                >
                  {/* Order Summary */}
                  <div 
                    className="p-4 sm:p-6 cursor-pointer hover:bg-white/5 transition-colors duration-150"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' 
                            ? 'bg-green-500/10 text-green-500' 
                            : order.status === 'Cancellation Requested'
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-medium text-foreground">${order.total.toFixed(2)}</p>
                        </div>
                        <svg 
                          className={`h-5 w-5 text-foreground transition-transform duration-200 ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border/10"
                    >
                      {/* Tracking Information */}
                      <div className="p-4 sm:p-6 border-b border-border/5">
                        <h4 className="text-sm font-medium text-foreground mb-4">Shipping Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Tracking Number</p>
                            <p className="text-sm font-medium text-foreground">{order.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                            <p className="text-sm font-medium text-foreground">{order.estimatedDelivery}</p>
                          </div>
                        </div>
                        
                        {/* Tracking Progress */}
                        <div className="mt-6">
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs text-accent font-medium">Order Placed</div>
                              <div className="text-xs text-muted-foreground">Processing</div>
                              <div className="text-xs text-muted-foreground">Shipped</div>
                              <div className="text-xs text-muted-foreground">Delivered</div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/10">
                              <div className="bg-accent w-1/4 h-full rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="p-4 sm:p-6">
                        <h4 className="text-sm font-medium text-foreground mb-4">Order Items</h4>
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="h-16 w-16 bg-accent/5 rounded-lg overflow-hidden flex-shrink-0">
                                <div className="h-full w-full bg-accent/10 flex items-center justify-center">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <svg className="h-8 w-8 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <h5 className="text-sm font-medium text-foreground">{item.name}</h5>
                                <p className="text-xs text-muted-foreground">{item.variant}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                  <p className="text-sm font-medium text-foreground">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Order Actions */}
                      <div className="p-4 sm:p-6 flex flex-wrap gap-2 border-t border-border/10">
                        {order.status === 'Processing' && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors duration-200"
                          >
                            Cancel Order
                          </button>
                        )}
                        <Link 
                          href="#"
                          className="px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors duration-200"
                        >
                          Track Package
                        </Link>
                        <Link 
                          href="#"
                          className="px-4 py-2 rounded-lg border border-border/20 text-foreground text-sm font-medium hover:bg-white/5 transition-colors duration-200"
                        >
                          Download Invoice
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4M4 12l4 4m-4-4l4-4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-foreground">No active orders</h3>
              <p className="mt-1 text-sm text-muted-foreground">You don't have any current orders in progress.</p>
              <Link 
                href="/products"
                className="mt-4 inline-block px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
              >
                Browse Products
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'past-orders' && (
        <motion.div variants={itemVariants}>
          {pastOrders.length > 0 ? (
            <div className="space-y-6">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          {order.status}
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-medium text-foreground">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="mt-4 pt-4 border-t border-border/5">
                      <h4 className="text-sm font-medium text-foreground mb-3">Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-white/5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <h5 className="text-sm font-medium text-foreground">{item.name}</h5>
                              <p className="text-sm text-muted-foreground">{item.variant}</p>
                            </div>
                            <div className="ml-4 text-right">
                              <p className="text-sm font-medium text-foreground">${item.price.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-foreground">No past orders</h3>
              <p className="mt-1 text-sm text-muted-foreground">You haven't placed any orders yet.</p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'subscriptions' && (
        <motion.div variants={itemVariants}>
          {subscriptions.length > 0 ? (
            <div className="space-y-6">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden p-6"
                  id={`subscription-${subscription.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="h-24 w-24 bg-accent/5 rounded-lg overflow-hidden flex-shrink-0">
                      <div className="h-full w-full bg-accent/10 flex items-center justify-center">
                        {subscription.image ? (
                          <img src={subscription.image} alt={subscription.product} className="h-full w-full object-cover" />
                        ) : (
                          <svg className="h-12 w-12 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-foreground">{subscription.product}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              subscription.status === 'Active' 
                                ? 'bg-green-500/10 text-green-500' 
                                : subscription.status === 'Paused'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-red-500/10 text-red-500'
                            }`}>
                              {subscription.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{subscription.variant}</p>
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <p className="text-sm text-muted-foreground">Monthly Price</p>
                          <p className="text-lg font-medium text-foreground">${subscription.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Frequency</p>
                          <p className="text-sm font-medium text-foreground">{subscription.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Started On</p>
                          <p className="text-sm font-medium text-foreground">{subscription.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Next Delivery</p>
                          <p className="text-sm font-medium text-foreground">{subscription.nextDelivery}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        <button 
                          onClick={() => handlePauseSubscription(subscription.id)}
                          className="px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors duration-200"
                        >
                          Pause Subscription
                        </button>
                        <button 
                          onClick={() => handleSkipDelivery(subscription.id)}
                          className="px-4 py-2 rounded-lg border border-border/20 text-foreground text-sm font-medium hover:bg-white/5 transition-colors duration-200"
                        >
                          Skip Next Delivery
                        </button>
                        <Link 
                          href="#"
                          className="px-4 py-2 rounded-lg border border-border/20 text-foreground text-sm font-medium hover:bg-white/5 transition-colors duration-200"
                        >
                          Modify Subscription
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-foreground">No active subscriptions</h3>
              <p className="mt-1 text-sm text-muted-foreground">Subscribe to your favorite products for regular deliveries and exclusive discounts.</p>
              <Link 
                href="/products"
                className="mt-4 inline-block px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
              >
                Browse Subscription Products
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
