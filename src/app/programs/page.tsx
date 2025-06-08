'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight } from 'lucide-react';

// Dynamically import ProgramsHero with no SSR to avoid hydration issues
const ProgramsHero = dynamic(() => import('@/components/ProgramsHero'), {
  ssr: false
});

const programs = [
  {
    id: 1,
    name: 'LivAuthentik Self Mastery',
    subtitle: 'Transform Your Life with Intentional Growth',
    description: 'Our flagship coaching program designed to help you master yourself, overcome limiting beliefs, and live with purpose and intention. Develop the mindset and habits of high performers through personalized coaching and proven frameworks.',
    href: '/programs/self-mastery',
    imageSrc: '/images/self-mastery.jpg',
    imageAlt: 'LivAuthentik Self Mastery coaching program',
    features: [
      'One-on-one personalized coaching sessions',
      'Custom-tailored growth plan',
      'Weekly accountability check-ins',
      'Exclusive access to resources and workshops',
      'Lifetime access to program materials'
    ],
    badge: 'FLAGSHIP PROGRAM'
  },
  {
    id: 2,
    name: 'Authentik Integrated',
    subtitle: 'For Coaches Ready to Scale as True CEOs',
    description: 'A comprehensive program that transforms high-performing coaches into true CEOs with our done-for-you systems implementation and leadership development. Scale your coaching business while developing the team dynamics needed for sustainable growth.',
    href: '/programs/integrated',
    imageSrc: '/images/integrated.jpg',
    imageAlt: 'Authentik Integrated program for coaches',
    features: [
      'Done-for-you business systems implementation',
      'Team leadership development framework',
      'Growth strategy consultation',
      'Client acquisition and retention systems',
      'Executive coaching for leadership transformation'
    ],
    badge: 'EXECUTIVE LEVEL'
  }
];

export default function ProgramsPage() {
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
  
  return (
    <div className="min-h-screen relative">
      {/* Full-screen hero with video background */}
      <ProgramsHero />
      
      {/* Programs Section */}
      <section className="relative z-10 bg-background min-h-screen">
        <div className="pt-screen">
          <div className="container px-6 mx-auto pt-24 pb-40 lg:pt-40">
            {/* Luxurious Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background via-background to-accent/5"></div>
              <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
              
              {/* Floating decorative elements */}
              <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl opacity-60 animate-float"></div>
              <div className="absolute bottom-1/4 left-10 w-64 h-64 rounded-full bg-amber-100/5 blur-3xl opacity-50 animate-float-delayed"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-24"
            >
              <span className="inline-block text-accent font-medium mb-5 tracking-wider text-sm uppercase bg-accent/5 px-4 py-1 rounded-full border border-accent/10 shadow-sm">Exclusive Offerings</span>
              
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6 tracking-tight">
                <span className="relative inline-block">
                  Transformative Programs
                  <motion.span 
                    className="absolute -bottom-3 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                Each exclusive program is meticulously crafted with precision and care to deliver extraordinary value and profound transformation, perfectly tailored to elevate your journey toward unparalleled success and fulfillment.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {programs.map((program, index) => (
                <motion.div 
                  key={program.id} 
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`bg-[rgba(61,46,37,0.5)] backdrop-blur-[20px] rounded-2xl border border-white/10 overflow-hidden relative z-10
                               before:content-[''] before:absolute before:inset-0 before:rounded-2xl 
                               before:bg-gradient-to-r before:from-accent/80 before:via-amber-400 before:to-accent/80
                               before:-z-10 before:opacity-0 before:transition-opacity before:duration-300
                               hover:before:opacity-100
                               after:content-[''] after:absolute after:inset-[1px] after:rounded-2xl
                               after:bg-[#3d2e25] after:bg-opacity-50 after:backdrop-blur-[20px] after:-z-5`}
                    onMouseEnter={() => setHoveredProgram(program.id)}
                    onMouseLeave={() => setHoveredProgram(null)}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber-400"></div>
                    <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
                    
                    {/* Program Card Content */}
                    <div className="flex flex-col relative z-10">
                      {/* Program Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-primary/5 to-transparent z-10"></div>
                        <Image 
                          src={program.imageSrc}
                          alt={program.imageAlt}
                          fill
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          priority={index === 0}
                        />
                        {program.badge && (
                          <motion.div 
                            className="absolute top-4 right-4 z-20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                          >
                            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{program.badge}</span>
                            </span>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Program Info */}
                      <div className="p-6 sm:p-7 flex flex-col h-full">
                        <div className="mb-4 flex-grow">
                          <Badge 
                            variant="outline" 
                            className="text-xs mb-3 backdrop-blur-sm bg-white/5 border-accent/20 text-accent"
                          >
                            {program.id === 1 ? 'FLAGSHIP PROGRAM' : 'EXECUTIVE LEVEL'}
                          </Badge>
                          <h2 className="text-xl font-serif font-light mb-2 group-hover:text-accent transition-colors duration-300">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{program.name}</span>
                          </h2>
                          <p className="text-[#fffff0] text-sm mb-3">
                            {program.subtitle}
                          </p>
                          <p className="text-[#fffff0] text-sm mb-4 line-clamp-3">
                            {program.description}
                          </p>
                          
                          <AnimatePresence>
                            {hoveredProgram === program.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-4 border-t border-accent/10 pt-4 overflow-hidden"
                              >
                                <h4 className="text-sm font-medium text-foreground mb-2">
                                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">Program Includes:</span>
                                </h4>
                                <ul className="space-y-2">
                                  {program.features.slice(0, 4).map((feature, i) => (
                                    <motion.li 
                                      key={i} 
                                      className="flex items-start text-xs"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
                                    >
                                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-accent/10 flex items-center justify-center mr-2 mt-0.5">
                                        <svg className="h-2 w-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                      <span className="text-[#fffff0]">{feature}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Action Buttons */}
                        <motion.div 
                          className="pt-4 border-t border-accent/10 flex justify-between"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: hoveredProgram === program.id ? 1 : 0,
                            y: hoveredProgram === program.id ? 0 : 10
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs backdrop-blur-sm bg-white/5 border-white/20 text-[#fffff0] hover:bg-transparent"
                            asChild
                          >
                            <Link href={program.href}>
                              Learn More
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-[#fffff0] font-medium shadow-sm
                                     border border-transparent hover:bg-transparent hover:bg-none hover:border-[#fffff0] hover:transition-none transition-colors duration-200"
                            onClick={() => setHoveredProgram(hoveredProgram === program.id ? null : program.id)}
                          >
                            Book Consultation
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
