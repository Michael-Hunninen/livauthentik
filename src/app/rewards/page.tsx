"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Gift, ShoppingCart, Star, Users, Zap, Award, UserPlus, LogIn, Truck, Percent, ArrowRight } from 'lucide-react';

export default function RewardsPage() {
  // Removed user-specific rewards status as per requirements

  const rewardTiers = [
    {
      name: 'Bronze',
      points: 0,
      benefits: [
        '1 point per $1 spent',
        'Birthday reward',
        'Exclusive member discounts'
      ],
      color: 'bg-amber-600',
      icon: <Award className="w-6 h-6" />
    },
    {
      name: 'Silver',
      points: 1000,
      benefits: [
        '1.5 points per $1 spent',
        'Free standard shipping',
        'Early access to sales',
        'Birthday gift'
      ],
      color: 'bg-gray-400',
      icon: <Award className="w-6 h-6" />
    },
    {
      name: 'Gold',
      points: 2000,
      benefits: [
        '2 points per $1 spent',
        'Free express shipping',
        'Exclusive products',
        'VIP customer support',
        'Quarterly surprise gifts'
      ],
      color: 'bg-yellow-500',
      icon: <Award className="w-6 h-6" />
    }
  ];

  const waysToEarn = [
    {
      title: 'Make a Purchase',
      description: 'Earn points for every dollar spent on our products.',
      points: '1-3x points',
      icon: <ShoppingCart className="w-6 h-6 text-primary" />
    },
    {
      title: 'Write a Review',
      description: 'Share your experience with our products.',
      points: '50 points',
      icon: <Star className="w-6 h-6 text-primary" />
    },
    {
      title: 'Refer a Friend',
      description: 'Get points when your friends make their first purchase.',
      points: '250 points',
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      title: 'Birthday Reward',
      description: 'Celebrate with us and receive a special birthday reward.',
      points: '100 points',
      icon: <Gift className="w-6 h-6 text-primary" />
    }
  ];

  const availableRewards = [
    {
      name: '$5 Off',
      points: 500,
      description: 'Save $5 on your next purchase',
      icon: <Zap className="w-6 h-6 text-amber-500" />
    },
    {
      name: 'Free Shipping',
      points: 300,
      description: 'Free standard shipping on your next order',
      icon: <Truck className="w-6 h-6 text-amber-500" />
    },
    {
      name: '15% Off',
      points: 1000,
      description: 'Get 15% off your entire order',
      icon: <Percent className="w-6 h-6 text-amber-500" />
    },
    {
      name: 'Free Product',
      points: 2000,
      description: 'Choose a free product from our selection',
      icon: <Gift className="w-6 h-6 text-amber-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Rewards Program
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Earn Points, Get Rewarded
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our loyalty program and start earning points with every purchase and activity.
              Redeem your points for exclusive rewards and discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/account?tab=signup">
                  <UserPlus className="w-5 h-5" />
                  Join Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/account?tab=login">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>


      {/* How It Works */}
      <section className="pt-16 pb-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Earn Points',
                description: 'Shop and engage to earn points on every purchase.'
              },
              {
                step: '2',
                title: 'Redeem Rewards',
                description: 'Use points for discounts and exclusive products.'
              },
              {
                step: '3',
                title: 'Enjoy Perks',
                description: 'Unlock special benefits and early access.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg border border-border text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Earn */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ways to Earn Points</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              There are many ways to earn points in our rewards program. Start earning today!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {waysToEarn.map((way, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {way.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{way.title}</h3>
                    <p className="text-muted-foreground mb-3">{way.description}</p>
                    <div className="flex items-center text-sm text-amber-600 font-medium">
                      <Zap className="w-4 h-4 mr-1" />
                      {way.points}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Reward Tiers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock greater rewards as you earn more points
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative flex flex-col h-full overflow-hidden rounded-xl border-2 border-border bg-card transition-all duration-300 ${
                  tier.name === 'Bronze' ? 'hover:border-amber-600' : 
                  tier.name === 'Silver' ? 'hover:border-gray-400' : 
                  'hover:border-yellow-500'
                }`}
              >
                <div className={`${tier.color} h-2 w-full`}></div>
                <div className="flex flex-col h-full p-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {tier.icon}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{tier.points}+</span>
                      <span className="text-muted-foreground"> points</span>
                    </div>
                    
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex flex-row space-x-2">
                      <Button asChild className="flex-1">
                        <Link href="/account?tab=signup">
                          Sign Up
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="flex-1">
                        <Link href="/account?tab=login">
                          Log In
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Rewards */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold text-primary mb-3 tracking-wider uppercase">
              Exclusive Perks
            </span>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Elevate Your Experience</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock premium rewards and exclusive benefits with your loyalty points
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableRewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative bg-card rounded-xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {React.cloneElement(reward.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div className="flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary">
                      <Zap className="w-4 h-4 mr-1.5" />
                      {reward.points}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{reward.name}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{reward.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-border/20">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary/5 group-hover:border-primary/30 group-hover:text-foreground transition-colors"
                      asChild
                    >
                      <Link href="/account?tab=signup" className="flex items-center justify-center">
                        <span>Sign Up / Log In</span>
                        <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Earning?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join LivAuthentik Rewards today and start earning points on every purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/account/register">
                  <UserPlus className="w-5 h-5" />
                  Join Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/products">
                  <ShoppingCart className="w-5 h-5" />
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
