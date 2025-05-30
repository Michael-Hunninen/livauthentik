'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrderHistoryPage() {
  // Mock order history - in a real app, this would come from your order database
  const pastOrders = [
    {
      id: 'ORD-2025-4156',
      date: 'May 10, 2025',
      total: 49.99,
      status: 'Delivered',
      items: [
        { name: 'Devotion Protein', variant: 'Single Pack', price: 49.99, quantity: 1 }
      ]
    },
    {
      id: 'ORD-2025-3892',
      date: 'April 22, 2025',
      total: 99.99,
      status: 'Delivered',
      items: [
        { name: 'Ultimate Devotion Bundle', variant: 'One Bag', price: 99.99, quantity: 1 }
      ]
    },
    {
      id: 'ORD-2025-3562',
      date: 'March 15, 2025',
      total: 149.99,
      status: 'Delivered',
      items: [
        { name: 'Devotion Protein', variant: 'Single Pack', price: 49.99, quantity: 1 },
        { name: 'Ultimate Devotion Bundle', variant: 'One Bag', price: 99.99, quantity: 1 }
      ]
    }
  ];

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filter orders based on status and search term
  const filteredOrders = pastOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variant.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesStatus && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05 
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
          Order History
        </h1>
        <p className="text-muted-foreground">
          View and manage your past orders
        </p>
      </div>

      {/* Filter and Search */}
      <motion.div 
        variants={itemVariants}
        className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">
              Search Orders
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="bg-background/50 border border-border/20 text-foreground rounded-lg block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                placeholder="Search by order ID or product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-muted-foreground mb-1">
              Filter by Status
            </label>
            <select
              id="filter"
              className="bg-background/50 border border-border/20 text-foreground rounded-lg block w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Order History List */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {filteredOrders.length > 0 ? (
            <div>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b border-border/10 last:border-0"
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
                            : order.status === 'Cancelled'
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
                      className="border-t border-border/10 p-4 sm:p-6"
                    >
                      {/* Order Items */}
                      <h4 className="text-sm font-medium text-foreground mb-4">Order Items</h4>
                      <div className="space-y-4 mb-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 bg-accent/10 rounded-md flex items-center justify-center">
                              <svg className="h-5 w-5 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-foreground">{item.name}</h5>
                                  <p className="text-xs text-muted-foreground">{item.variant}</p>
                                </div>
                                <div className="mt-1 sm:mt-0 flex items-center justify-between sm:justify-end sm:space-x-4">
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                  <p className="text-sm font-medium text-foreground">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Delivery Information */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-foreground mb-2">Delivery Information</h4>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Delivered on:</span> {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">Delivered to:</span> 123 Main St, Apt 4B, New York, NY 10001
                          </p>
                        </div>
                      </div>
                      
                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link 
                          href="#"
                          className="px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors duration-200"
                        >
                          Buy Again
                        </Link>
                        <Link 
                          href="#"
                          className="px-4 py-2 rounded-lg border border-border/20 text-foreground text-sm font-medium hover:bg-white/5 transition-colors duration-200"
                        >
                          View Invoice
                        </Link>
                        {order.status === 'Delivered' && (
                          <Link 
                            href="#"
                            className="px-4 py-2 rounded-lg border border-border/20 text-foreground text-sm font-medium hover:bg-white/5 transition-colors duration-200"
                          >
                            Return Items
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-foreground">No orders found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              <Link 
                href="/products"
                className="mt-4 inline-block px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
