import React from 'react';
import Image from 'next/image';
import PhilosophyReveal from '@/components/PhilosophyReveal';
import FoundersReveal from '@/components/FoundersReveal';
import Link from 'next/link';
import StorySlider from '@/components/StorySlider';
import AboutHero from '@/components/AboutHero';
import { FeaturedTicker } from '@/components/featured-ticker';
import StoryAnimator from '@/components/StoryAnimator';
import dynamic from 'next/dynamic';

// Dynamically import TestimonialCarousel with no SSR to avoid window is not defined errors
const TestimonialCarousel = dynamic(
  () => import('@/components/testimonial-carousel').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center">Loading testimonials...</div>,
  }
);

// Core values data
const values = [
  {
    title: 'Devotion',
    description: 'We believe devotion is the ultimate luxury. Your commitment to your goals and values is your greatest asset, and we\'re here to help you protect and nurture it.',
    icon: '♛',
  },
  {
    title: 'Transformation',
    description: 'We\'re committed to helping you transform every aspect of your life through our premium wellness solutions and guidance.',
    icon: '✧',
  },
  {
    title: 'Excellence',
    description: 'We settle for nothing less than exceptional quality in everything we create and every experience we deliver.',
    icon: '✦',
  },
  {
    title: 'Leadership',
    description: 'We lead by example, empowering you to become the leader of your own life and health journey.',
    icon: '♚',
  },
];

// Team members data
const teamMembers = [
  {
    name: 'Brandon Oshodin',
    role: 'Co-Founder',
    bio: 'With over 18 years of experience in strength conditioning and peak performance coaching, Brandon brings a wealth of knowledge in transforming lives. As a former professional athlete and certified trainer, he has helped thousands achieve their highest potential through his unique approach that combines physical training with mindset mastery. His work with Fortune 500 companies and professional athletes has established him as a thought leader in performance optimization.',
    imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/68420b326e8b7830ed3ea267.jpeg',
  },
  {
    name: 'Olivia Oshodin',
    role: 'Co-Founder',
    bio: 'Olivia is a certified holistic nutritionist and A Course In Miracles teacher with 12 years of experience in guiding individuals toward optimal health and spiritual alignment. Her expertise in nutrition and mindset has transformed lives across the globe. As a mother of five, she understands the challenges of maintaining balance and brings this wisdom to her work, helping others create sustainable, healthy lifestyles that align with their deepest values and aspirations.',
    imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/68420a90d7ebee3e7b01d7fd.jpeg',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen relative">
      {/* Decorative Background Elements (Global) */}
      <div className="fixed inset-0 -z-50 opacity-60">
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* Hero Section - Using the new AboutHero component */}
      <div className="sticky top-0 left-0 w-full h-screen z-0">
        <AboutHero />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="bg-background min-h-screen pt-screen">
        
        {/* As Featured In Section */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay"></div>
          </div>
          
          {/* Featured Ticker */}
          <div className="bg-background/50 backdrop-blur-sm border-y border-accent/5">
            <FeaturedTicker />
          </div>
        </section>
        
        {/* Story Section */}
        <section id="story-section" className="py-24 sm:py-32 relative overflow-hidden">
          {/* Premium Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-radial from-accent/3 to-transparent opacity-60 story-bg-gradient"></div>
            <div className="absolute w-full h-px top-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent story-border-top"></div>
            <div className="absolute w-full h-px bottom-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent story-border-bottom"></div>
            <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl story-orb-1"></div>
            <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-accent/5 blur-3xl story-orb-2"></div>
            <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay story-texture"></div>
          </div>
          
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
              <div className="story-text-content opacity-0 translate-y-12 transition-all duration-1000">
                <div className="inline-block mb-6 story-badge opacity-0 translate-y-6">
                  <span className="text-accent text-sm uppercase tracking-widest font-medium bg-accent/5 px-3 py-1 rounded-full border border-accent/10 shadow-sm">Our Journey</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 tracking-tight story-heading opacity-0 translate-y-6">
                  Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/70 font-medium">Story</span>
                </h2>
                
                <div className="h-px w-0 story-separator bg-gradient-to-r from-accent/30 to-transparent mb-8 transition-all duration-1500"></div>
              
                <div className="space-y-8 text-lg text-muted-foreground leading-relaxed story-paragraphs opacity-0 translate-y-6">
                  <p>
                    Welcome to LivAuthentik, a transformative movement founded by Brandon and Olivia Oshodin, where we redefine devotion as your greatest luxury. With over 18 years of relentless dedication to peak performance, we've combined our expertise in coaching, strength conditioning, and leadership dynamics to empower individuals to embrace their devotion as the gateway to unlocking their full potential.
                  </p>
                  
                  <div className="relative my-12 p-8 bg-accent/5 border-l-4 border-accent/30 rounded-r-lg backdrop-blur-sm shadow-md story-quote opacity-0">
                    <p className="text-xl md:text-2xl italic font-serif text-foreground">
                      "Our mission is to inspire you to view your commitment to your goals and values as a luxury that protects you from life's chaos."
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative story-image-container opacity-0 translate-x-12 transition-all duration-1000">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-accent/10 via-white/5 to-accent/5 rounded-2xl blur opacity-70 -z-10 story-image-glow"></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl aspect-square story-image">
                  <Image
                    src="https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/684209baf7e1291b7573d4ee.jpeg"
                    alt="Our Journey"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/20 opacity-70 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-amber-50/5 mix-blend-overlay"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Client-side animator component */}
          <StoryAnimator />
        </section>

        {/* Horizontal Sliding Cards Section with Full Viewport Height */}
        <section className="relative z-[20]" style={{height: 'calc(100vh * 3.5)'}}>
          <div id="story-slider" className="h-screen sticky top-0" style={{willChange: 'transform'}}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10"></div>
            <StorySlider cards={[
              {
                id: 'philosophy',
                heading: 'Our Philosophy',
                content: "We believe that your devotion is not a burden but a powerful sanctuary that guides you toward excellence. Our journey was profoundly shaped in our early 20s under the mentorship of the legendary Bob Proctor, whose wisdom illuminated the art of personal transformation.",
                imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/6841fc475983927d08d0d275.jpeg',
                imageAlt: 'Philosophy Background',
                gradientPosition: 'bl'
              },
              {
                id: 'impact',
                heading: 'Our Impact',
                content: "We have brought groundbreaking strategies to Fortune 500 companies, empowering them to unlock the untapped power of the unconscious mind—all while crafting the foundation of our own entrepreneurial legacy. With over 12 years of expertise in sports performance, holistic nutrition and A Course In Miracles teacher training, we have had the privilege of serving tens of thousands of discerning students.",
                imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e2b5aa1103471f6ed186e.jpeg',
                imageAlt: 'Our Impact',
                gradientPosition: 'tl'
              },
              {
                id: 'journey',
                heading: 'Personal Journey',
                content: "As parents of five young children, including three under the age of three, we understand the challenges of balancing responsibilities while striving for greatness. Our journey inspires our passion for helping others like you—those ready to turn devotion into strength and clarity.",
                imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e30f2a1103436dbed27b8.jpeg',
                imageAlt: 'Family Journey',
                gradientPosition: 'tr'
              },
              {
                id: 'vision',
                heading: 'Our Vision',
                content: "At LivAuthentik, we envision a world where individuals embrace their authentic selves, understanding that true luxury comes from within. Our premium wellness solutions are designed not just to enhance your physical wellbeing, but to transform your entire approach to life—elevating your mindset, your relationships, and your spiritual connection.",
                imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e3518d9a12e4bf5a92d79.png',
                imageAlt: 'Our Vision',
                gradientPosition: 'b'
              }
            ]} />
          </div>
        </section>
        
        {/* Philosophy Section - Will only appear after story slider is complete */}
        <section id="philosophy-section" className="py-24 sm:py-32 relative overflow-hidden bg-[#fafaf8] z-[50] mt-[-100vh]">
          {/* Premium entrance animation elements */}
          <div className="absolute top-0 left-0 right-0 w-0 h-px philosophy-line bg-gradient-to-r from-accent/30 via-accent/60 to-accent/30 z-20"></div>
          <div className="absolute inset-0 philosophy-reveal bg-accent/5 -z-5 transform origin-bottom scale-y-0"></div>
          <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-white/90 via-white/80 to-transparent z-10"></div>
          
          {/* Premium Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fafaf8] to-[#f5f5f0]"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent/5 to-transparent opacity-20"></div>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-accent/5 to-transparent opacity-20"></div>
          </div>
          
          {/* Philosophy Reveal Animation Component */}
          <PhilosophyReveal />
          
          <div className="container px-6 mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block text-accent text-sm uppercase tracking-widest font-medium bg-accent/5 px-3 py-1 rounded-full border border-accent/10 shadow-sm mb-6 philosophy-content">Our Approach</span>
              <h2 className="section-title text-4xl md:text-5xl font-serif font-light mb-6">
                Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/70 font-medium">Philosophy</span>
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-accent/30 to-transparent mx-auto mb-8"></div>
              <p className="philosophy-content mt-6 text-lg leading-8 text-gray-600">
                At LivAuthentik, our philosophy centers on the belief that true wellness stems from authenticity and holistic balance. We've developed our approach based on years of research and practical experience, working with individuals from all walks of life.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                {values.map((value, index) => (
                  <div key={index} className="group relative philosophy-content min-h-[280px]">
                    {/* Premium card styling */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-accent/10 via-accent/5 to-amber-100/10 rounded-2xl blur-md opacity-70 -z-10 group-hover:opacity-90 transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-full -mr-10 -mt-10 opacity-50 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full -ml-8 -mb-8 opacity-50 blur-xl"></div>
                    
                    {/* Main card content */}
                    <div className="relative overflow-hidden rounded-2xl border border-accent/10 shadow-lg bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-md p-8 transition-all duration-700 hover:shadow-2xl hover:border-accent/30 transform hover:translate-y-[-8px] w-full h-full flex flex-col">
                      {/* Accent line */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-1/2 bg-gradient-to-b from-accent/40 via-accent/20 to-transparent rounded-r-full opacity-60 group-hover:h-2/3 group-hover:opacity-75 transition-all duration-700 ease-in-out"></div>
                      
                      {/* Icon in an offset position */}
                      <div className="absolute -right-5 -top-5 w-20 h-20 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center shadow-lg border border-accent/10 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                          <span className="text-3xl font-serif text-accent -rotate-12 group-hover:-rotate-6 transition-transform duration-700">{value.icon}</span>
                        </div>
                      </div>
                      
                      {/* Content with asymmetrical layout */}
                      <div className="mt-6 ml-1">
                        <h3 className="text-2xl font-serif font-medium text-[#333] mb-4">{value.title}</h3>
                        <div className="h-px w-16 bg-gradient-to-r from-accent/60 to-transparent mb-6"></div>
                        <p className="text-[#555] leading-relaxed pr-6">{value.description}</p>
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-accent/20 rounded-br-md opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
                      <div className="absolute top-1/2 right-8 w-1 h-1 rounded-full bg-accent/40"></div>
                      <div className="absolute top-1/2 right-6 w-2 h-2 rounded-full bg-accent/20"></div>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
        
        {/* Founders Section */}
        <section id="founders-section" className="py-24 sm:py-32 relative overflow-hidden">
          {/* Animation entrance line */}
          <div className="absolute top-0 left-0 right-0 w-0 h-px founders-line bg-gradient-to-r from-accent/30 via-accent/60 to-accent/30 z-30"></div>
          
          {/* Main Background with Gradient */}
          <div className="absolute inset-0 founders-reveal bg-gradient-to-br from-amber-50 via-amber-50/95 to-amber-100/90 opacity-0 -z-5"></div>

            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Base Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/80"></div>
              
              {/* Subtle Noise Texture */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23caac8e\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '200px'
              }}></div>
              
              {/* Large Gradient Orbs */}
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-amber-300/30 to-amber-500/10 blur-3xl opacity-60"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/20 to-amber-400/5 blur-3xl opacity-50"></div>
              
              {/* Subtle Grid Overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23caac8e\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '40px 40px'
              }}></div>
              
              {/* Decorative Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-300/30 rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-300/30 rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-300/30 rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-300/30 rounded-br-2xl"></div>
              
              {/* Subtle Border */}
              <div className="absolute inset-0 border border-amber-100/50 rounded-2xl pointer-events-none"></div>
            </div>
          
          {/* Founders Reveal Animation Component */}
          <FoundersReveal />
          
          <div className="container px-6 mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block text-accent text-sm uppercase tracking-widest font-medium bg-accent/5 px-3 py-1 rounded-full border border-accent/10 shadow-sm mb-6 founders-header">Our Leadership</span>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 founders-header">
                Meet The <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/70 font-medium">Founders</span>
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-accent/30 to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-[#555] max-w-3xl mx-auto leading-relaxed founders-header">
                Husband and wife team dedicated to transforming lives through devotion and authenticity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="group relative founder-card">
                  {/* Card Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-600/20 rounded-3xl blur opacity-70 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                  
                  {/* Main Card */}
                  <div className="h-full flex flex-col rounded-2xl bg-gradient-to-br from-amber-50/90 to-amber-50/70 backdrop-blur-sm border border-amber-100/50 shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] md:aspect-video overflow-hidden flex-shrink-0 border-b border-amber-100/50">
                      <div className="absolute inset-0 z-10 overflow-hidden">
                        <div className="absolute inset-0 border-4 border-white/5 m-1 rounded-xl z-20 opacity-60 transition-transform duration-700 group-hover:scale-105"></div>
                      </div>
                      {member.imageSrc ? (
                        <Image
                          src={member.imageSrc}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100/50 to-amber-50/30">
                          <span className="text-amber-800/30 font-serif font-medium text-5xl">
                            {member.name.split(' ')[0][0]}
                            {member.name.split(' ')[1][0]}
                          </span>
                        </div>
                      )}
                      
                      {/* Name and Role Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <h3 className="text-2xl font-serif font-normal text-amber-50 drop-shadow-md">{member.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="h-px w-8 bg-amber-400 mr-2"></div>
                          <p className="text-sm font-medium text-amber-200/90">{member.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio Section */}
                    <div className="flex flex-col flex-grow p-8 bg-gradient-to-br from-amber-50/90 to-amber-50/70">
                      <div className="h-px w-16 bg-gradient-to-r from-amber-400/80 to-transparent mb-6"></div>
                      <p className="text-amber-900/90 leading-relaxed font-light text-[15.5px] tracking-wide flex-grow">
                        {member.bio}
                      </p>
                      
                      {/* Decorative Elements */}
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-amber-100">
                        <div className="flex space-x-2">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-200/60"></div>
                          ))}
                        </div>
                        <div className="text-amber-800/40 text-xs font-medium tracking-wider">
                          LIV AUTHENTIK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonial Slider Section */}
        <section className="pt-16 pb-24 relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-amber-50/80 to-amber-50/90">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5"></div>
            <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light text-amber-950/90 mb-6">
                <span className="block">Hear From Our</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 font-medium">Valued Community</span>
              </h2>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <TestimonialCarousel />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-white via-[#fafaf8] to-[#f5f5f0]">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent"></div>
            <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-70"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-70"></div>
          </div>
          
          <div className="container px-6 mx-auto text-center">
            <span className="inline-block text-accent text-sm uppercase tracking-widest font-medium bg-accent/5 px-3 py-1 rounded-full border border-accent/10 shadow-sm mb-6">Your Transformation</span>
            
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">
              Begin Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/70 font-medium">Journey</span>
            </h2>
            
            <div className="h-px w-24 bg-gradient-to-r from-accent/40 to-transparent mx-auto mb-8"></div>
            
            <p className="text-2xl md:text-3xl text-[#555] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Step into the fires of self-discovery with us, and through Devotion be introduced to your Authentik self.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/shop" 
                className="px-8 py-4 bg-gradient-to-r from-accent to-amber-500 text-background font-medium rounded-full hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2 group shadow-md hover:shadow-lg"
              >
                Explore Our Products
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link 
                href="/programs" 
                className="px-8 py-4 border border-accent/30 bg-white text-[#333] font-medium rounded-full hover:bg-accent/5 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Discover Our Programs
              </Link>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
