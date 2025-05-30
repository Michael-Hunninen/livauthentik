'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const experienceProgram = {
  id: 2,
  name: 'Devotion Experience',
  description: 'Mind, Body & Nutrition Program',
  longDescription: 'The Devotion Experience is our comprehensive wellness program designed to transform your mind, body, and nutrition habits. This all-in-one digital program includes personalized meal plans, workout routines, meditation practices, and expert guidance to help you achieve your wellness goals.',
  price: '$150.00',
  subscriptionPrice: '$97.00',
  href: '/products/2',
  imageSrc: '/images/experience-product.jpg',
  imageAlt: 'Devotion Experience program',
  badge: 'NEW',
  programDetails: {
    duration: '12 weeks',
    access: 'Lifetime',
    includes: [
      'Personalized meal plans',
      'Workout library',
      'Meditation guide',
      'Weekly coaching calls',
      'Private community access'
    ]
  }
};

const testimonials = [
  {
    content: "The Devotion Experience transformed my approach to wellness. The personalized meal plans and workout routines fit perfectly into my busy schedule, and the meditation practices have helped me reduce stress significantly.",
    author: "Sarah J.",
    role: "Marketing Executive",
    imageSrc: "/images/testimonial-1.jpg"
  },
  {
    content: "I've tried many wellness programs before, but none have been as comprehensive as the Devotion Experience. The coaching calls provided accountability, and the community support kept me motivated throughout my journey.",
    author: "Michael T.",
    role: "Software Engineer",
    imageSrc: "/images/testimonial-2.jpg"
  },
  {
    content: "What sets the Devotion Experience apart is how it addresses all aspects of wellness - not just physical fitness. The holistic approach helped me develop sustainable habits that I've maintained long after completing the program.",
    author: "Elena R.",
    role: "Healthcare Professional",
    imageSrc: "/images/testimonial-3.jpg"
  }
];

const features = [
  {
    name: 'Personalized Nutrition',
    description: 'Custom meal plans tailored to your preferences, dietary needs, and wellness goals, with recipes and shopping lists included.',
    icon: 'M21 15.9999V7.9999C21 6.89533 20.1046 5.9999 19 5.9999H5C3.89543 5.9999 3 6.89533 3 7.9999V15.9999C3 17.1046 3.89543 17.9999 5 17.9999H19C20.1046 17.9999 21 17.1046 21 15.9999Z'
  },
  {
    name: 'Targeted Workouts',
    description: 'Progressive exercise routines designed for your fitness level and goals, with video guidance for proper form and technique.',
    icon: 'M7 11.5V14M7 11.5V9M7 11.5H9.5M7 11.5H4.5M12 6a1 1 0 110-2 1 1 0 010 2zm0 0V4m0 2v2M15 11.5h.5a2 2 0 012 2v1.5M15 11.5V10M15 11.5V13M15 11.5h-2.5'
  },
  {
    name: 'Mindfulness Practices',
    description: 'Guided meditation sessions and mindfulness exercises to reduce stress, improve focus, and enhance your mental wellbeing.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Expert Coaching',
    description: 'Weekly live coaching sessions with wellness experts to answer questions, provide guidance, and keep you accountable.',
    icon: 'M8 10a3 3 0 100-6 3 3 0 000 6zm2 5.9c0 .828-.504 1.563-1.274 1.86a12 12 0 01-7.451 0c-.77-.297-1.275-1.032-1.275-1.86V14a2 2 0 012-2h6a2 2 0 012 2v1.9zm-2 0V14H4v1.9c.606.456 2.278.987 4 .987s3.394-.53 4-1.987zM16 12a4 4 0 110-8 4 4 0 010 8zm2 1a1 1 0 011 1v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1a1 1 0 011-1h4z'
  },
  {
    name: 'Community Support',
    description: 'Access to a private community of like-minded individuals on the same wellness journey, sharing tips, motivation, and success stories.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    name: 'Progress Tracking',
    description: 'Comprehensive tools to track your progress, set goals, and celebrate achievements throughout your wellness journey.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  }
];

export default function ExperiencePage() {
  const { addToCart } = useCart();
  
  const handleAddToCart = (isSubscription: boolean) => {
    addToCart(experienceProgram, 1, isSubscription);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background/80"></div>
        </div>
        <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent mb-4">
                Premium Wellness Program
              </span>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                The <span className="text-accent">Devotion</span> Experience
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                A comprehensive mind, body, and nutrition program designed to transform your wellness journey and help you achieve your health goals.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors min-w-[180px]"
                >
                  Join Now - ${experienceProgram.price.replace('$', '')}
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  className="rounded-md border border-accent bg-background px-6 py-3 text-sm font-semibold text-accent shadow-sm hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors min-w-[180px]"
                >
                  Subscribe - ${experienceProgram.subscriptionPrice.replace('$', '')}/mo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl mb-6">
                Transform Your Life Holistically
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {experienceProgram.longDescription}
              </p>
              <div className="bg-muted/30 rounded-lg p-6 border border-border/40">
                <h3 className="text-xl font-medium mb-4">Program Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{experienceProgram.programDetails.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Access</p>
                    <p className="font-medium">{experienceProgram.programDetails.access}</p>
                  </div>
                </div>
                <h4 className="font-medium mb-2">What's Included:</h4>
                <ul className="space-y-2">
                  {experienceProgram.programDetails.includes.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-muted">
                {experienceProgram.imageSrc ? (
                  <Image
                    src={experienceProgram.imageSrc}
                    alt={experienceProgram.imageAlt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">Program image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 sm:py-24 bg-muted/20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Program Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The Devotion Experience offers a comprehensive approach to wellness, addressing all aspects of your health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background p-6 rounded-xl border border-border/40 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">{feature.name}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from people who have transformed their lives with the Devotion Experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-muted/20 p-6 rounded-xl border border-border/40">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted mr-4">
                    {testimonial.imageSrc ? (
                      <Image
                        src={testimonial.imageSrc}
                        alt={`${testimonial.author} profile`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/20">
                        <span className="text-accent font-medium text-sm">
                          {testimonial.author.split(' ')[0][0]}
                          {testimonial.author.split(' ')[1][0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold sm:text-4xl mb-6">
              Ready to Transform Your Wellness Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join thousands of others who have experienced the benefits of our comprehensive wellness program.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4">
              <button
                onClick={() => handleAddToCart(false)}
                className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors min-w-[180px]"
              >
                Join Now - ${experienceProgram.price.replace('$', '')}
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                className="rounded-md border border-primary-foreground bg-transparent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground transition-colors min-w-[180px]"
              >
                Subscribe - ${experienceProgram.subscriptionPrice.replace('$', '')}/mo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
