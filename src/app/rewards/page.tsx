"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Gift, 
  ShoppingCart, 
  Star, 
  Users, 
  Award, 
  UserPlus, 
  LogIn, 
  Truck, 
  Percent 
} from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RewardsHero from '@/components/RewardsHero';

function PointsToCtaButton({ points, onClick }: { points: string, onClick: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHovered = useRef(false);
  
  // Function to handle the animation when parent card is hovered
  const handleParentHover = (isHovering: boolean) => {
    isHovered.current = isHovering;
    const pointsBadge = buttonRef.current?.previousElementSibling as HTMLElement;
    
    if (isHovering) {
      // Animate points badge out
      pointsBadge?.style.setProperty('transform', 'translateY(-20px)');
      pointsBadge?.style.setProperty('opacity', '0');
      
      // Animate CTA button in
      if (buttonRef.current) {
        buttonRef.current.style.pointerEvents = 'auto';
        buttonRef.current.animate(
          [
            { opacity: 0, transform: 'translateY(40px) scale(0.9)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
          ],
          {
            duration: 300,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
          }
        );
      }
    } else {
      // Reset points badge
      pointsBadge?.style.setProperty('transform', 'translateY(0)');
      pointsBadge?.style.setProperty('opacity', '1');
      
      // Reset CTA button
      if (buttonRef.current) {
        buttonRef.current.style.pointerEvents = 'none';
        buttonRef.current.animate(
          [
            { opacity: 1, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(40px) scale(0.9)' }
          ],
          {
            duration: 300,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
          }
        );
      }
    }
  };

  // Set up event listeners for the parent card
  useEffect(() => {
    const card = buttonRef.current?.closest('.earn-points-card');
    if (!card) return;
    
    const handleMouseEnter = () => handleParentHover(true);
    const handleMouseLeave = () => handleParentHover(false);
    
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative h-10 mt-auto">
      {/* Points Badge - Visible by default */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-sm bg-background/80 text-foreground/80 py-2 px-4 rounded-full border border-border/50 shadow-sm backdrop-blur-sm z-10 transition-all duration-300"
      >
        <Zap className="w-4 h-4 mr-2 text-accent" />
        <span className="font-medium tracking-wide">{points}</span>
      </div>
      
      {/* CTA Button - Shown on parent hover */}
      <button 
        ref={buttonRef}
        className="absolute inset-0 flex items-center justify-center bg-background/95 text-foreground/95 text-sm font-medium rounded-full shadow-lg border border-white/10 hover:border-accent/30 backdrop-blur-sm w-full z-20"
        style={{
          opacity: 0,
          transform: 'translateY(40px) scale(0.9)',
          pointerEvents: 'none'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <span>Start Earning</span>
        <ArrowRight className="w-4 h-4 ml-2 text-accent" />
      </button>
    </div>
  );
}

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
      icon: <ShoppingCart className="w-6 h-6 text-accent" />
    },
    {
      title: 'Write a Review',
      description: 'Share your experience with our products.',
      points: '50 points',
      icon: <Star className="w-6 h-6 text-accent" />
    },
    {
      title: 'Refer a Friend',
      description: 'Get points when your friends make their first purchase.',
      points: '250 points',
      icon: <Users className="w-6 h-6 text-accent" />
    },
    {
      title: 'Birthday Reward',
      description: 'Celebrate with us and receive a special birthday reward.',
      points: '100 points',
      icon: <Gift className="w-6 h-6 text-accent" />
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section - Sticky at the top */}
      <div className="sticky top-0 left-0 w-full h-screen z-0">
        <RewardsHero />
      </div>
      
      {/* Content that overlays the hero */}
      <div className="relative z-10">
        {/* This div creates the solid background that covers the hero */}
        <div className="bg-background min-h-screen pt-screen">
            
            {/* How It Works Section */}
            <section id="howItWorks" className="py-24 relative overflow-hidden bg-background">
              {/* Premium Background Effects */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-background to-accent/5"></div>
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-accent/5 to-transparent opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-tl from-accent/5 to-transparent blur-3xl"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl opacity-40"></div>
                <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-tr from-accent/10 to-amber-200/5 blur-3xl opacity-30"></div>
              <div className="absolute top-40 right-10 w-32 h-32 rounded-full bg-gradient-to-bl from-accent/20 to-transparent blur-3xl opacity-20"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.9, 
              ease: "easeOut",
              opacity: { duration: 0.6 },
              y: { type: "spring", stiffness: 50, damping: 15 }
            }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Effortless Luxury</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
              <span className="relative inline-block">
                How It 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium"> Works</span>
                <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">Experience our seamless rewards journey in three simple steps</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                title: 'Earn Points',
                description: 'Collect points with every purchase and engagement with our premium products.'
              },
              {
                step: '2',
                title: 'Redeem Rewards',
                description: 'Exchange your accumulated points for exclusive products and luxurious experiences.'
              },
              {
                step: '3',
                title: 'Enjoy Perks',
                description: 'Access elevated benefits, early product releases, and personalized wellness services.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.6, scale: 0.98, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeOut",
                  opacity: { duration: 1.2, ease: "easeOut" },
                  scale: { duration: 1.2, ease: "easeOut" } 
                }}
                className="group relative backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-700 text-center overflow-hidden"
              >
                {/* Background decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent text-2xl font-serif font-medium mb-6 mx-auto border border-accent/10 shadow-lg group-hover:shadow-primary/10 transition-all duration-500">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-accent/90 transition-colors duration-300">{item.title}</h3>
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent my-4 mx-auto opacity-50"></div>
                  <p className="text-muted-foreground/90 font-light leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Earn */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-amber-300/5 blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-20 right-0 w-60 h-60 rounded-full bg-gradient-to-bl from-accent/10 to-amber-200/10 blur-3xl opacity-20 -z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.02] mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.9, 
              ease: "easeOut",
              opacity: { duration: 0.6 },
              y: { type: "spring", stiffness: 50, damping: 15 }
            }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Curated Opportunities</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
              Ways to <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Earn Points</span>
            </h2>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-accent/30 to-transparent my-6 mx-auto"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Discover multiple elegant pathways to accumulate points and elevate your wellness journey
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
            {waysToEarn.map((way, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: 5, rotateY: 2, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  rotateX: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
                  rotateY: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }}
                className="earn-points-card group relative h-full min-h-[360px] perspective-1000"
              >
                {/* Card Container */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-accent/5">
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm border border-white/5 rounded-2xl transition-all duration-700 group-hover:border-white/10">
                    {/* Subtle texture */}
                    <div className="absolute inset-0 opacity-5 bg-[url('/images/texture.png')] mix-blend-overlay"></div>
                    
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/0 group-hover:via-accent/5 group-hover:to-accent/10 transition-all duration-1000"></div>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Decorative accent */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
                  
                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col p-8 transition-all duration-500">
                    {/* Icon */}
                    <motion.div 
                      className="mb-8 p-3.5 rounded-xl bg-gradient-to-br from-accent/5 to-accent/3 border border-accent/5 group-hover:border-accent/20 transition-all duration-500 inline-flex items-center justify-center w-14 h-14"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      {React.cloneElement(way.icon, { 
                        className: 'w-6 h-6 text-foreground/90 group-hover:text-accent transition-colors duration-500' 
                      })}
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-serif font-light text-foreground/95 mb-4 leading-tight">
                      {way.title}
                    </h3>
                    
                    {/* Divider */}
                    <div className="w-10 h-0.5 bg-gradient-to-r from-accent/40 to-transparent my-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Description */}
                    <p className="text-foreground/70 font-light text-[0.95rem] leading-relaxed mb-8 flex-grow">
                      {way.description}
                    </p>
                    
                    {/* Points Badge that transforms into CTA */}
                    <PointsToCtaButton 
                      points={way.points} 
                      onClick={() => {
                        // Add your action here (e.g., navigate to shop)
                      }} 
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  />
                  
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(300px_circle_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/10 to-transparent opacity-50"></div>
        <div className="absolute -top-32 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-accent/10 to-amber-200/5 blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-accent/5 to-transparent blur-3xl opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.02] mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.9, 
              ease: "easeOut",
              opacity: { duration: 0.6 },
              y: { type: "spring", stiffness: 50, damping: 15 }
            }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Membership Levels</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
              Reward <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Tiers</span>
            </h2>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-accent/30 to-transparent my-6 mx-auto"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Ascend through our membership tiers to unlock increasingly exclusive benefits and privileges
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Connecting line between tiers */}
            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/20 to-transparent hidden md:block"></div>
            
            {rewardTiers.map((tier, index) => {
              const isGold = tier.name === 'Gold';
              const isSilver = tier.name === 'Silver';
              
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0.7, scale: 0.97, translateY: 15 }}
                  whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ 
                    duration: 1.3,
                    delay: index * 0.05, 
                    ease: "easeOut", 
                    opacity: { duration: 1.4 },
                    scale: { duration: 1.3, ease: "easeOut" }
                  }}
                  className={`group relative flex flex-col h-full overflow-hidden rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-700 ${                  
                    isGold
                      ? 'bg-gradient-to-b from-amber-500/5 to-transparent shadow-xl hover:shadow-amber-500/5' 
                      : isSilver
                        ? 'bg-gradient-to-b from-gray-300/5 to-transparent shadow-lg hover:shadow-gray-300/5' 
                        : 'bg-gradient-to-b from-amber-600/5 to-transparent shadow-md hover:shadow-amber-600/5'
                  }`}
                >
                  {/* Tier-specific glow effect */}
                  <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${isGold ? 'bg-amber-400' : isSilver ? 'bg-gray-400' : 'bg-amber-600'}`}></div>
                  
                  {/* Top accent strip */}
                  <div className={`h-1.5 w-full ${tier.name === 'Bronze' ? 'bg-gradient-to-r from-amber-600/80 to-amber-600/40' : tier.name === 'Silver' ? 'bg-gradient-to-r from-gray-400/80 to-gray-400/40' : 'bg-gradient-to-r from-yellow-500/80 to-yellow-500/40'}`}></div>
                  
                  <div className="flex flex-col h-full p-8">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-serif font-light">
                          <span className={`bg-clip-text text-transparent ${tier.name === 'Bronze' ? 'bg-gradient-to-r from-amber-600 to-amber-400' : tier.name === 'Silver' ? 'bg-gradient-to-r from-gray-400 to-gray-300' : 'bg-gradient-to-r from-amber-500 to-yellow-300'}`}>
                            {tier.name}
                          </span>
                        </h3>
                        <div className={`p-3 rounded-full ${tier.name === 'Bronze' ? 'bg-amber-600/10 text-amber-500' : tier.name === 'Silver' ? 'bg-gray-400/10 text-gray-300' : 'bg-yellow-500/10 text-yellow-400'} shadow-lg border border-white/5`}>
                          {tier.icon}
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <span className={`text-4xl font-serif ${isGold ? 'text-amber-500' : isSilver ? 'text-gray-400' : 'text-amber-600'}`}>{tier.points}+</span>
                        <span className="text-muted-foreground font-light"> points</span>
                      </div>
                      
                      <ul className="space-y-4">
                        {tier.benefits.map((benefit, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0.7, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: 0.2 + (i * 0.07) + (index * 0.05), 
                              duration: 1.0,
                              ease: "easeOut"
                            }}
                            className="flex items-start group/item"
                          >
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors duration-300 ${tier.name === 'Bronze' ? 'text-amber-500 bg-amber-500/10' : tier.name === 'Silver' ? 'text-gray-300 bg-gray-400/10' : 'text-yellow-400 bg-yellow-500/10'} group-hover/item:bg-opacity-20`}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-muted-foreground/90 font-light">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0.7, y: 10, scaleX: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
                      viewport={{ once: true, margin: "-5%" }}
                      transition={{ 
                        delay: 0.2 + (index * 0.1), 
                        duration: 1.3,
                        ease: "easeOut",
                        opacity: { duration: 1.3, ease: "easeOut" }
                      }}
                      className="mt-8 pt-6 border-t border-white/5"
                    >
                      <div className="flex flex-col space-y-3">
                        <Button 
                          asChild 
                          className={`${isGold ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : isSilver ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-amber-600 to-amber-700'} border-none text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                          <Link href="/account?tab=signup" className="py-6">
                            Begin Your Journey
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="border-white/10 hover:bg-white/5 py-5 transition-all duration-300">
                          <Link href="/account?tab=login">
                            Member Sign In
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Available Rewards */}
      <section id="available-rewards" className="py-24 relative overflow-visible">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent"></div>
        <div className="absolute top-40 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-accent/10 to-amber-200/5 blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-bl from-accent/10 to-amber-200/10 blur-3xl opacity-20 -z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.02] mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 px-4 py-1 rounded-full border border-accent/10 bg-accent/5">
              Exclusive Privileges
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mt-6 mb-6">
              Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Experience</span>
            </h2>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-accent/30 to-transparent my-6 mx-auto"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Exchange your accumulated points for these curated rewards, designed to enhance your wellness journey
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {availableRewards.map((reward, index) => {
              const cardBg = 'bg-background/95';
              const iconBg = 'bg-accent/5 border-accent/10';
              const pointsBg = 'bg-accent/5 border-accent/10 text-accent';
              const titleColor = 'text-foreground group-hover:text-accent';
              const descriptionColor = 'text-muted-foreground/80';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { 
                      duration: 0.4, 
                      ease: [0.22, 1, 0.36, 1] 
                    }
                  }}
                  className="group relative h-full"
                >
                  {/* Card Container */}
                  <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-500 bg-background/95 border border-white/5 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5">
                    {/* Card Background */}
                    <div className={`absolute inset-0 ${cardBg} transition-all duration-700`}>
                      {/* Subtle texture */}
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
                      
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent via-30% to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Accent border highlight */}
                      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-accent/30 transition-all duration-500 pointer-events-none"></div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="relative z-10 h-full flex flex-col p-6">

                      
                      {/* Icon and Points */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-500 ${iconBg} group-hover:scale-110 group-hover:shadow-lg`}>
                          {React.cloneElement(reward.icon, { 
                            className: 'w-6 h-6 transition-all duration-500 text-accent'
                          })}
                        </div>
                        <div className={`flex items-center px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 ${pointsBg}`}>
                          <Zap className="w-4 h-4 mr-1.5 text-accent" />
                          <span className="font-mono font-medium text-foreground">
                            {reward.points}
                          </span>
                        </div>
                      </div>
                      
                      {/* Title and Description */}
                      <div className="mb-6">
                        <h3 className="text-xl font-medium mb-3 transition-colors duration-300 text-foreground group-hover:text-accent">
                          {reward.name}
                        </h3>
                        <p className="text-sm leading-relaxed font-light text-muted-foreground/80">
                          {reward.description}
                        </p>
                      </div>
                      
                      {/* CTA Button */}
                      <div className="mt-auto pt-5 border-t border-white/5 group-hover:border-accent/10 transition-colors duration-300">
                        <Button 
                          className="w-full py-4 rounded-lg font-medium tracking-wide transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg bg-accent/5 border border-accent/10 text-accent hover:bg-accent hover:text-white hover:border-accent/30"
                          asChild
                        >
                          <Link href="/account?tab=signup" className="flex items-center justify-center relative z-10">
                            <span>Redeem Now</span>
                            <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 text-accent group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.01] via-transparent to-accent/[0.02]"></div>
        <div className="absolute -top-40 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-accent/10 to-amber-300/5 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-tr from-accent/5 to-transparent blur-3xl opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.02] mix-blend-overlay"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="backdrop-blur-lg rounded-2xl p-10 md:p-16 relative overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Inner card decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/10 opacity-70"></div>
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-accent/5 to-transparent opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-gradient-to-tl from-accent/10 to-transparent blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-6 max-w-xl"
                >
                  <span className="inline-block text-sm font-medium tracking-wider uppercase text-accent/80 px-4 py-1 rounded-full border border-accent/10 bg-accent/5 shadow-sm">
                    Begin Your Journey
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground">
                    Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Elevate</span> Your Experience?
                  </h2>
                  <div className="h-px w-20 bg-gradient-to-r from-accent/30 to-transparent"></div>
                  <p className="text-muted-foreground/90 text-lg font-light leading-relaxed">
                    Join our exclusive rewards program today and begin collecting points with every LivAuthentik purchase. Sign up now to unlock a world of premium benefits and luxurious rewards.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-col gap-4 min-w-[200px]"
                >
                  <Button 
                    size="lg" 
                    asChild
                    className="bg-gradient-to-r from-accent to-amber-500 border-none text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-7"
                  >
                    <Link href="/account?tab=signup" className="font-medium">
                      Begin Your Journey
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild
                    className="border-white/10 hover:bg-white/5 hover:border-accent/20 transition-all duration-300 py-7"
                  >
                    <Link href="/rewards/faq" className="font-light">
                      Explore Program Details
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}
