'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Emma Carter',
    role: 'Founder & CEO',
    bio: 'With over a decade of experience in the wellness industry, Emma founded LivAuthentik to bridge the gap between premium nutritional science and holistic well-being practices.',
    imageSrc: '/images/team-1.jpg',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Chief Scientific Officer',
    bio: 'A nutritional biochemist with a Ph.D. from Stanford, Dr. Chen oversees our product formulations and ensures all supplements meet the highest standards of efficacy and safety.',
    imageSrc: '/images/team-2.jpg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Wellness Program Director',
    bio: 'Certified in integrative nutrition and mindfulness coaching, Sarah develops our transformative experience programs that complement our supplement offerings.',
    imageSrc: '/images/team-3.jpg',
  },
  {
    name: 'James Wilson',
    role: 'Head of Operations',
    bio: 'With expertise in sustainable supply chain management, James ensures our products are ethically sourced and delivered with minimal environmental impact.',
    imageSrc: '/images/team-4.jpg',
  }
];

const values = [
  {
    name: 'Quality',
    description: 'We never compromise on ingredient quality or production standards, ensuring each product delivers optimal results.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Transparency',
    description: 'We believe in full disclosure about our ingredients, sourcing practices, and the science behind our formulations.',
    icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    name: 'Sustainability',
    description: 'From ingredient sourcing to packaging, we prioritize environmental responsibility throughout our supply chain.',
    icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819'
  },
  {
    name: 'Innovation',
    description: 'We continuously explore cutting-edge nutritional science to develop products that push the boundaries of wellness.',
    icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18'
  },
  {
    name: 'Integrity',
    description: 'We operate with honesty and ethical principles, putting our customers\' wellness and trust above all else.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Community',
    description: 'We foster a supportive community that empowers individuals on their unique wellness journeys.',
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
  }
];

const milestones = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'LivAuthentik was founded with a mission to create premium wellness products that combine scientific innovation with holistic principles.'
  },
  {
    year: '2021',
    title: 'Launch of Devotion',
    description: 'Our flagship protein and colostrum supplement was launched after 12 months of research and development.'
  },
  {
    year: '2022',
    title: 'Devotion Experience',
    description: 'We expanded our offerings to include comprehensive wellness programs that complement our supplement line.'
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'LivAuthentik products became available internationally, helping us reach wellness enthusiasts worldwide.'
  },
  {
    year: '2024',
    title: 'Product Innovation',
    description: 'We introduced new formulations to our product lineup, continuing our commitment to cutting-edge nutritional science.'
  },
  {
    year: '2025',
    title: 'Sustainable Initiatives',
    description: 'We launched our sustainability program, implementing eco-friendly packaging and carbon-neutral shipping options.'
  }
];

export default function AboutPage() {
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
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Our <span className="text-accent">Story</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                At LivAuthentik, we're dedicated to creating premium wellness products and experiences that help you live your most authentic, vibrant life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-muted">
                <Image
                  src="/images/devotion-product.jpg"
                  alt="LivAuthentik mission"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary rounded-full -z-10"></div>
            </div>
            
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl mb-6">
                Our Mission & Vision
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                LivAuthentik was founded on a simple yet powerful belief: that wellness should be approached holistically, combining the best of nutritional science with mind-body practices.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our mission is to create premium, science-backed wellness products and experiences that help people achieve optimal health and live authentically. We believe in the power of quality ingredients, transparent practices, and a supportive community.
              </p>
              <p className="text-lg text-muted-foreground">
                Our vision is to become the leading wellness brand known for innovation, integrity, and results. We strive to transform lives by making holistic wellness accessible and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 sm:py-24 bg-muted/20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at LivAuthentik, from product development to customer interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-background p-6 rounded-xl border border-border/40 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">{value.name}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Our Journey
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From our humble beginnings to where we are today, here's how LivAuthentik has evolved.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative md:flex ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                  {/* Desktop Version (left-right alternating) */}
                  <div className={`hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-accent bg-background z-10`}></div>
                  
                  <div className={`bg-card rounded-xl shadow-sm p-6 border border-border/40 md:w-5/12 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-auto md:mr-0 md:ml-8'}`}>
                    <span className="text-sm font-medium text-accent block mb-2">{milestone.year}</span>
                    <h3 className="text-xl font-medium text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 sm:py-24 bg-muted/20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind LivAuthentik who bring our vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-background rounded-xl overflow-hidden border border-border/40 shadow-sm">
                <div className="aspect-w-3 aspect-h-4 bg-muted">
                  {member.imageSrc ? (
                    <Image
                      src={member.imageSrc}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/20">
                      <span className="text-accent font-medium text-2xl">
                        {member.name.split(' ')[0][0]}
                        {member.name.split(' ')[1][0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-accent mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground rounded-2xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 lg:p-16 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold sm:text-4xl mb-6">
                Join Our Wellness Journey
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Experience the LivAuthentik difference and transform your approach to wellness with our premium products and programs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/products"
                  className="rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors w-full sm:w-auto"
                >
                  Shop Products
                </Link>
                <Link 
                  href="/experience"
                  className="rounded-md border border-primary-foreground bg-transparent px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary-foreground/10 transition-colors w-full sm:w-auto"
                >
                  Explore the Experience
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
