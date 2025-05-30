'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  // Mock user data - in a real app, this would come from your auth/user system
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    memberSince: 'May 2025',
    rewardsPoints: 750
  };

  // Mock recent orders - in a real app, this would come from your order database
  const recentOrders = [
    {
      id: 'ORD-2025-4289',
      date: 'May 25, 2025',
      total: 149.99,
      status: 'Processing',
      items: [
        { name: 'Devotion Protein', variant: 'Single Pack', price: 49.99 },
        { name: 'Ultimate Devotion Bundle', variant: 'One Bag', price: 99.99 }
      ]
    },
    {
      id: 'ORD-2025-4156',
      date: 'May 10, 2025',
      total: 49.99,
      status: 'Delivered',
      items: [
        { name: 'Devotion Protein', variant: 'Single Pack', price: 49.99 }
      ]
    }
  ];

  // Mock subscription data - in a real app, this would come from your subscription system
  const activeSubscriptions = [
    {
      id: 'SUB-2025-872',
      product: 'Devotion Protein',
      variant: 'Single Pack',
      frequency: 'Monthly',
      nextDelivery: 'June 15, 2025',
      price: 44.99
    }
  ];

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
      className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full"
    >
      {/* Welcome Section */}
      <div className="mb-10 bg-gradient-to-r from-accent/5 to-accent/10 p-6 rounded-2xl border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back, <span className="text-accent">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Here's an overview of your account activity, orders, and rewards.
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/products"
              className="px-4 py-2.5 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Shop Now
            </Link>
            <Link 
              href="/account/dashboard/rewards"
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              View Rewards
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Order Summary Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-5 overflow-hidden relative group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Orders</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">3</h3>
                <p className="text-xs text-muted-foreground mt-1.5">2 completed, 1 processing</p>
              </div>
              <div className="p-2.5 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <Link href="/account/dashboard/orders" className="text-xs font-medium text-accent hover:text-accent/80 flex items-center gap-1 group">
                View all orders
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Rewards Summary Card */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Rewards Points</p>
              <h3 className="text-2xl font-bold text-foreground">{user.rewardsPoints}</h3>
              <p className="text-xs text-muted-foreground mt-1">250 points until next reward</p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Active Subscriptions Card */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-foreground">{activeSubscriptions.length}</h3>
              <p className="text-xs text-muted-foreground mt-1">Next delivery: June 15</p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Rewards Card */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Membership Level</p>
              <h3 className="text-2xl font-bold text-foreground">Silver</h3>
              <p className="text-xs text-muted-foreground mt-1">Since {user.memberSince}</p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">Your most recent purchases and their status</p>
          </div>
          <Link 
            href="/account/dashboard/history"
            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1 group"
          >
            View all orders
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order</th>
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3.5 px-5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <motion.tr 
                      key={order.id} 
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-foreground">{order.id}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-muted-foreground">{order.date}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-foreground">${order.total.toFixed(2)}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' 
                              ? 'bg-green-500/10 text-green-400' 
                              : order.status === 'Processing'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {order.status === 'Processing' && (
                            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link 
                          href={`/account/dashboard/orders/${order.id}`}
                          className="text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1 group"
                        >
                          View
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white/5 mb-3">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-foreground">No orders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by placing your first order.</p>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Active Subscriptions */}
      <motion.div variants={itemVariants}>
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Active Subscriptions</h2>
            <p className="text-sm text-muted-foreground">Your active product subscriptions and deliveries</p>
          </div>
          <Link 
            href="/account/dashboard/orders"
            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1 group"
          >
            Manage all
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {activeSubscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Frequency</th>
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Delivery</th>
                    <th className="py-3.5 px-5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                    <th className="py-3.5 px-5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeSubscriptions.map((subscription) => (
                    <motion.tr 
                      key={subscription.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{subscription.product}</div>
                            <div className="text-xs text-muted-foreground">{subscription.variant}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground">
                          {subscription.frequency}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-sm text-foreground">{subscription.nextDelivery}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-foreground">
                        ${subscription.price.toFixed(2)} <span className="text-xs text-muted-foreground">/mo</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link 
                          href={`/account/dashboard/orders#subscription-${subscription.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium text-foreground hover:bg-white/5 transition-colors duration-200"
                        >
                          Manage
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white/5 mb-3">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-foreground">No active subscriptions</h3>
              <p className="mt-1 text-sm text-muted-foreground">Subscribe to your favorite products for regular deliveries.</p>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
