'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle, Star, ArrowRight, Clock, User, Award, BookOpen, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Program details
// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const programDetails = {
  id: 'self-mastery',
  name: 'LivAuthentik Self Mastery',
  subtitle: 'Elevate Your Life Through Conscious Evolution',
  price: 1997,
  salePrice: 1497,
  duration: '12 weeks',
  rating: 4.9,
  reviewCount: 256,
  description: 'A transformative journey into self-discovery, emotional intelligence, and personal excellence. This premium program combines ancient wisdom with cutting-edge psychology to help you master your internal world and create an extraordinary external reality.',
  coverImage: '/images/programs/self-mastery-cover.jpg',
  benefits: [
    'Develop unshakeable emotional resilience and inner peace',
    'Master the art of conscious decision-making and self-discipline',
    'Transform limiting beliefs into empowering mindsets',
    'Create powerful habits that align with your highest values',
    'Cultivate deep, authentic relationships in all areas of life',
    'Discover your unique purpose and create a vision-aligned life',
    'Access advanced meditation techniques for mental clarity'
  ],
  features: [
    {
      title: 'Weekly Live Coaching',
      description: 'Intimate group sessions with our master coaches providing personalized guidance',
      icon: User
    },
    {
      title: 'Premium Course Materials',
      description: 'Beautifully designed workbooks, guided journals, and reference guides',
      icon: BookOpen
    },
    {
      title: 'Private Community',
      description: 'Access to our exclusive member community with like-minded individuals',
      icon: Heart
    },
    {
      title: 'Lifetime Access',
      description: 'Unlimited access to all program materials and future updates',
      icon: Award
    },
    {
      title: 'Daily Practices',
      description: 'Structured daily rituals to integrate learning and accelerate growth',
      icon: Zap
    }
  ],
  modules: [
    {
      title: 'Foundations of Self-Awareness',
      description: 'Discover your authentic self through advanced personality assessments and deep inner work',
      weeks: 2
    },
    {
      title: 'Emotional Mastery',
      description: 'Learn to navigate your emotional landscape with grace and transform reactive patterns',
      weeks: 2
    },
    {
      title: 'Mindset Transformation',
      description: 'Reprogram limiting beliefs and develop an unshakeable growth-oriented mindset',
      weeks: 2
    },
    {
      title: 'Habit Engineering',
      description: 'Design and implement powerful habits that align with your highest values and goals',
      weeks: 2
    },
    {
      title: 'Relationship Excellence',
      description: 'Master the art of authentic communication and boundary-setting in all relationships',
      weeks: 2
    },
    {
      title: 'Purpose & Vision',
      description: 'Clarify your unique life purpose and create a compelling vision for your future',
      weeks: 2
    }
  ],
  testimonials: [
    {
      name: 'Jonathan Hayes',
      role: 'CEO & Entrepreneur',
      image: '/images/testimonials/jonathan.jpg',
      content: 'The Self Mastery Program completely transformed how I approach both my business and personal life. The emotional intelligence tools alone have improved my leadership capabilities tenfold.'
    },
    {
      name: 'Sarah Chen',
      role: 'Wellness Coach',
      image: '/images/testimonials/sarah.jpg',
      content: 'As someone who teaches wellness, I was amazed at how much deeper this program took me in my own journey. The community and coaching support are absolutely world-class.'
    },
    {
      name: 'Marcus Williams',
      role: 'Finance Executive',
      image: '/images/testimonials/marcus.jpg',
      content: 'I was skeptical at first, but this program delivered far beyond my expectations. The ROI on my personal growth has directly translated to success in my career and family life.'
    }
  ],
  faq: [
    {
      question: "How is this different from other personal development programs?",
      answer: "The LivAuthentik Self Mastery Program combines ancient wisdom with cutting-edge psychology, focusing on practical integration rather than theoretical knowledge. Our approach emphasizes embodied learning through daily practices, expert coaching, and community support, creating lasting transformation instead of temporary motivation."
    },
    {
      question: "What if I'm too busy to commit fully?",
      answer: "The program is designed for busy professionals, with core practices requiring just 20-30 minutes daily. All live sessions are recorded, and our coaches provide flexible support. Many graduates report that the time management tools learned early in the program actually create more space and efficiency in their lives."
    },
    {
      question: "Do I need prior personal development experience?",
      answer: "No prior experience is required. The program is structured to meet you where you are, whether you're new to personal development or have extensive experience. Our coaches provide personalized guidance to ensure appropriate pacing and depth."
    },
    {
      question: "What kind of results can I expect?",
      answer: "While individual results vary, our graduates consistently report significant improvements in emotional regulation, decision-making, relationship quality, clarity of purpose, and overall life satisfaction. Many also experience enhanced productivity, better health outcomes, and greater financial success as indirect benefits."
    },
    {
      question: "Is there a guarantee?",
      answer: "Yes, we offer a 14-day satisfaction guarantee. If you fully participate in the program for the first two weeks and don't feel it's providing value, we'll provide a full refund."
    }
  ]
};

export default function SelfMasteryProgram() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background z-0"></div>
        <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-30 z-0"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4">
                <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5 backdrop-blur-sm px-3 py-1">
                  SIGNATURE PROGRAM
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-6">
                <span className="block">LivAuthentik</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">
                  Self Mastery
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8">
                {programDetails.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8 items-center">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(programDetails.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-foreground font-medium">{programDetails.rating}</span>
                  <span className="ml-1 text-muted-foreground">({programDetails.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{programDetails.duration}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl md:text-3xl font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">
                    {formatPrice(programDetails.salePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(programDetails.price)}
                  </span>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    SAVE {formatPrice(programDetails.price - programDetails.salePrice)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Flexible payment plans available</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-accent via-amber-400 to-accent/80 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 text-white shadow-lg hover:shadow-accent/20 hover:shadow-xl">
                  Enroll Now
                </Button>
                <Button variant="outline" size="lg" className="border-accent/30 text-accent hover:bg-accent/5 hover:text-accent hover:border-accent/50 transition-all duration-300">
                  Download Syllabus
                </Button>
              </div>
            </motion.div>
            
            {/* Right Content - Program Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10"></div>
              <div className="absolute inset-0 border border-white/10 rounded-xl z-20"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-60 z-0"></div>
              
              {programDetails.coverImage ? (
                <Image 
                  src={programDetails.coverImage}
                  alt={programDetails.name}
                  fill
                  className="object-cover z-0"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background flex items-center justify-center">
                  <span className="text-4xl font-serif text-accent/40">LivAuthentik</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Program Description */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-light prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed"
            >
              <p className="text-xl">{programDetails.description}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 grid md:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-2xl font-serif font-light mb-6 flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">Key Benefits</span>
                </h3>
                <ul className="space-y-4">
                  {programDetails.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-muted-foreground/90">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-light mb-6 flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">What's Included</span>
                </h3>
                <ul className="space-y-4">
                  {programDetails.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        {React.createElement(feature.icon, { className: "w-4 h-4 text-accent" })}
                      </div>
                      <div>
                        <h4 className="text-foreground font-medium mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Program Modules */}
      <section className="py-16 relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-6">
              <span className="relative inline-block">
                Program <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Modules</span>
                <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">A comprehensive journey through self-discovery and personal mastery</p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {programDetails.modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6 last:mb-0"
              >
                <Card className="backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                        <span className="text-accent font-serif font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="text-xl font-serif font-medium text-foreground">{module.title}</h3>
                          <Badge variant="outline" className="bg-accent/5 text-accent/90 border-accent/20 whitespace-nowrap w-fit">
                            {module.weeks} {module.weeks === 1 ? 'Week' : 'Weeks'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background z-0"></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl opacity-20 z-0"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-6">
              <span className="relative inline-block">
                Program <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Testimonials</span>
                <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">Hear from those who have transformed their lives through this journey</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programDetails.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full"
              >
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-accent/10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Quote icon */}
                  <div className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-accent/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-muted-foreground/90 italic mb-6 flex-grow font-light leading-relaxed text-lg">"{testimonial.content}"</p>
                  
                  {/* Author info */}
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20 shadow-md mr-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-10"></div>
                      {testimonial.image ? (
                        <Image 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                          <span className="text-accent font-serif text-lg">{testimonial.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-foreground group-hover:text-accent transition-colors duration-300">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground/70">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Common Questions</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-6">
              <span className="relative inline-block">
                Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Questions</span>
                <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">Everything you need to know about the Self Mastery Program</p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            {programDetails.faq.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4 last:mb-0"
              >
                <div 
                  className={`backdrop-blur-sm border ${expandedFaq === index ? 'bg-accent/5 border-accent/20' : 'bg-white/5 border-white/10'} rounded-lg overflow-hidden transition-all duration-300`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center"
                    aria-expanded={expandedFaq === index}
                  >
                    <h3 className="font-medium text-lg text-foreground">{item.question}</h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-accent transition-transform duration-300 ${expandedFaq === index ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 pt-0 text-muted-foreground">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background z-0"></div>
        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-40 z-0"></div>
        <div className="absolute bottom-10 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-10 mix-blend-overlay z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl opacity-20 -z-10"></div>
            
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4 border-accent/30 text-accent bg-accent/5 backdrop-blur-sm px-3 py-1">
                LIMITED ENROLLMENT
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4">
                Begin Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Transformation</span> Today
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The next cohort begins soon. Secure your place in this exclusive program and start your journey toward self-mastery.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-accent via-amber-400 to-accent/80 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 text-white shadow-lg hover:shadow-accent/20 hover:shadow-xl">
                Enroll Now ({formatPrice(programDetails.salePrice)})
              </Button>
              <Button variant="outline" size="lg" className="border-accent/30 text-accent hover:bg-accent/5 hover:text-accent hover:border-accent/50 transition-all duration-300">
                Schedule a Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
