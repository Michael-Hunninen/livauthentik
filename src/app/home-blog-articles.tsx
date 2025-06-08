'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Blog articles data
const blogArticles = [
  {
    id: 'article1',
    title: "The Science of Adaptogens: Nature's Stress Solution",
    excerpt: "Discover how adaptogenic herbs can help your body resist stressors and restore balance naturally.",
    image: '/images/blog/adaptogens.jpg',
    category: 'Wellness',
    author: 'Dr. Sarah Chen',
    date: 'May 28, 2025',
    readTime: '6 min read',
    slug: 'science-of-adaptogens'
  },
  {
    id: 'article2',
    title: 'Mindful Movement: Transforming Your Exercise Routine',
    excerpt: "Learn how bringing mindfulness to your workout can enhance results and deepen your mind-body connection.",
    image: '/images/blog/mindful-movement.jpg',
    category: 'Fitness',
    author: 'Michael Torres',
    date: 'May 15, 2025',
    readTime: '5 min read',
    slug: 'mindful-movement'
  },
  {
    id: 'article3',
    title: 'Nutritional Alchemy: Foods That Synergize for Optimal Health',
    excerpt: "Explore powerful food combinations that work together to enhance absorption and maximize nutritional benefits.",
    image: '/images/blog/nutritional-alchemy.jpg',
    category: 'Nutrition',
    author: 'Emma Blackwood',
    date: 'May 3, 2025',
    readTime: '7 min read',
    slug: 'nutritional-alchemy'
  },
  {
    id: 'article4',
    title: "The Luxury of Rest: Why Sleep Is Your Ultimate Wellness Investment",
    excerpt: "Understand why proper sleep might be the most important element in your wellness journey.",
    image: '/images/blog/luxury-of-rest.jpg',
    category: 'Sleep',
    author: 'Dr. James Wilson',
    date: 'April 22, 2025',
    readTime: '4 min read',
    slug: 'luxury-of-rest'
  }
];

export function HomeBlogArticles() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background z-0"></div>
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl opacity-30 z-0"></div>
      <div className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Wellness Insights</span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
            <span className="relative inline-block">
              Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Articles</span>
              <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">Discover expert insights and transformative wisdom for your wellness journey</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {blogArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-white/10 hover:border-accent/30 transition-all duration-500"
            >
              {/* Article image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent z-10"></div>
                <Image 
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{article.category}</span>
                  </span>
                </div>
              </div>
              
              {/* Article content */}
              <div className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <span>{article.date}</span>
                  <span className="mx-2 text-accent/50">•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <h3 className="text-lg font-serif font-light text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{article.title}</span>
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    By {article.author}
                  </span>
                  
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-xs font-medium text-accent hover:text-amber-400 transition-colors duration-300"
                  >
                    Read More
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-accent/10 to-amber-400/10 backdrop-blur-md border border-accent/20 text-accent hover:text-amber-500 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/40"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
