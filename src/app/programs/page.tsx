'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

const programs = [
  {
    id: 1,
    name: 'LivAuthentik Self Mastery',
    subtitle: 'Transform Your Life with Intentional Growth',
    description: 'Our flagship coaching program designed to help you master yourself, overcome limiting beliefs, and live with purpose and intention. Develop the mindset and habits of high performers through personalized coaching and proven frameworks.',
    price: '$3,500.00',
    subscriptionPrice: '$350.00',
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
    price: '$8,500.00',
    subscriptionPrice: '$850.00',
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
  const { addToCart } = useCart();
  
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background/90"></div>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-accent/5 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-accent font-medium mb-3 tracking-wider text-sm uppercase">Transform Your Potential</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
              Premium Coaching <span className="text-accent">Programs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Unlock your highest potential with our transformative coaching programs designed to elevate your personal and professional life to new heights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="#programs" 
                className="px-8 py-4 rounded-full bg-accent text-white font-medium tracking-wide shadow-lg hover:shadow-accent/20 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Programs
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 rounded-full bg-background border border-border text-foreground font-medium hover:bg-accent/5 transition-colors duration-300"
              >
                Book a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section id="programs" className="py-20 lg:py-32">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              <span className="relative inline-block">
                Our Premium Programs
                <motion.span 
                  className="absolute -bottom-2 left-0 h-1 bg-accent/40 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each program is meticulously designed to provide exceptional value and transformational results, tailored to meet your specific goals and aspirations.
            </p>
          </div>
          
          <div className="space-y-24">
            {programs.map((program, index) => (
              <motion.div 
                key={program.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent rounded-3xl -z-10 opacity-70"></div>
                
                <div className={`grid md:grid-cols-2 gap-12 p-8 md:p-12 rounded-3xl border border-border/30 shadow-lg ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  {/* Program Image */}
                  <div className={`relative ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 blur-2xl transform scale-95 -z-10"></div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                        <span className="text-3xl font-serif font-medium text-white/30">
                          {program.name}
                        </span>
                      </div>
                      {program.imageSrc && (
                        <Image 
                          src={program.imageSrc}
                          alt={program.imageAlt}
                          fill
                          className="object-cover"
                        />
                      )}
                      {program.badge && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-accent shadow-md">
                            {program.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Program Info */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-2">
                      {program.name}
                    </h3>
                    <p className="text-lg font-medium text-accent mb-4">
                      {program.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-foreground mb-4">Program Includes:</h4>
                      <ul className="space-y-3">
                        {program.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center mr-3 mt-0.5">
                              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-2xl font-medium">{program.price}</span>
                        {program.subscriptionPrice && (
                          <span className="text-sm text-muted-foreground">
                            or {program.subscriptionPrice} monthly
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={program.href}
                        className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-white font-medium tracking-wide shadow-md hover:shadow-accent/20 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Learn More
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-background border border-border hover:bg-accent/5 transition-colors duration-300"
                      >
                        Book a Call
                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-accent/5">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Transformational Results
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hear from those who have experienced profound change through our premium coaching programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 mr-4"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Client Name</h4>
                    <p className="text-sm text-muted-foreground">CEO, Company Name</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "The coaching program has been transformative for both my personal development and business growth. The combination of strategic guidance and accountability helped me achieve results I never thought possible."
                </p>
                <div className="flex text-accent">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-background to-background shadow-2xl border border-white/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-40"></div>
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative px-8 py-20 md:p-20 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                Ready to Transform Your Life?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Take the first step towards extraordinary personal and professional growth by scheduling a complimentary strategy call with our team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-white font-medium tracking-wide shadow-lg hover:shadow-accent/20 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Schedule Your Call
                </Link>
                <Link
                  href="#programs"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-background border border-border hover:bg-accent/5 transition-colors duration-300"
                >
                  Explore Programs Again
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
