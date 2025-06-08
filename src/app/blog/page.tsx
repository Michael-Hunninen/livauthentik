"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Icons
import { Tag, Brain, Heart, Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type BlogCategory = 'all' | 'mind' | 'body' | 'spirit';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'mind' | 'body' | 'spirit';
  readTime: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}

// Mock blog posts data
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Power of Positive Thinking',
    excerpt: 'Discover how positive thinking can transform your mindset and improve your overall well-being.',
    category: 'mind',
    readTime: '5 min read',
    date: '2025-05-20',
    author: 'Sarah Johnson',
    image: '/images/blog/positive-thinking.jpg',
    slug: 'the-power-of-positive-thinking'
  },
  {
    id: '2',
    title: 'Morning Yoga Routine for Beginners',
    excerpt: 'Start your day right with this simple 15-minute yoga routine designed for beginners.',
    category: 'body',
    readTime: '7 min read',
    date: '2025-05-18',
    author: 'Michael Chen',
    image: '/images/blog/morning-yoga.jpg',
    slug: 'morning-yoga-routine-for-beginners'
  },
  {
    id: '3',
    title: 'Finding Your Inner Peace',
    excerpt: 'Explore mindfulness techniques to find calm and peace in your daily life.',
    category: 'spirit',
    readTime: '6 min read',
    date: '2025-05-15',
    author: 'Lisa Williams',
    image: '/images/blog/inner-peace.jpg',
    slug: 'finding-your-inner-peace'
  },
  {
    id: '4',
    title: 'The Science of Meditation',
    excerpt: 'Learn about the scientifically proven benefits of regular meditation practice.',
    category: 'mind',
    readTime: '8 min read',
    date: '2025-05-12',
    author: 'Dr. James Wilson',
    image: '/images/blog/meditation-science.jpg',
    slug: 'the-science-of-meditation'
  },
  {
    id: '5',
    title: 'Nutrition for Optimal Health',
    excerpt: 'Essential nutrients your body needs to function at its best and how to get them.',
    category: 'body',
    readTime: '9 min read',
    date: '2025-05-10',
    author: 'Emma Davis',
    image: '/images/blog/nutrition.jpg',
    slug: 'nutrition-for-optimal-health'
  },
  {
    id: '6',
    title: 'The Art of Gratitude',
    excerpt: 'How practicing gratitude can enhance your spiritual journey and overall happiness.',
    category: 'spirit',
    readTime: '5 min read',
    date: '2025-05-05',
    author: 'David Kim',
    image: '/images/blog/gratitude.jpg',
    slug: 'the-art-of-gratitude'
  },
];

const categoryIcons = {
  mind: <Brain className="w-4 h-4 mr-1" />,
  body: <Heart className="w-4 h-4 mr-1" />,
  spirit: <Sparkles className="w-4 h-4 mr-1" />
};

const categoryColors = {
  mind: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  body: 'bg-green-100 text-green-800 hover:bg-green-200',
  spirit: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <section className="relative py-32 overflow-visible">
        {/* Premium background elements */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/3 via-background/80 to-background opacity-90"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-amber-200/5 via-accent/5 to-transparent blur-3xl opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-amber-100/10 via-accent/5 to-transparent blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-gradient-to-tr from-accent/10 to-amber-200/40 blur-sm opacity-60 animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-12 w-6 h-6 rounded-full bg-gradient-to-bl from-amber-300/20 to-accent/10 blur-sm opacity-60 animate-float-slow-reverse"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-accent/20 to-amber-200/20 blur-sm opacity-40 animate-float-medium"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block text-sm font-medium tracking-wider uppercase mb-6 px-5 py-1.5 rounded-full border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent shadow-sm backdrop-blur-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-amber-400">LivAuthentik Journal</span>
            </span>
            
            <h1 className="text-5xl md:text-6xl font-serif font-light text-foreground mb-8 leading-tight tracking-tight">
              Nourish Your <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Mind, Body</span>
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></span>
              </span> & Spirit
            </h1>
            
            <div className="h-px w-64 bg-gradient-to-r from-transparent via-accent/30 to-transparent my-8 mx-auto opacity-80"></div>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
              Discover curated articles, expert guides, and transformative insights to help you live your most balanced and authentic life.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button 
                className="rounded-full px-8 py-6 bg-gradient-to-r from-accent to-amber-400/90 text-white hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-1 text-base font-medium"
              >
                Explore Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-5 sticky top-0 z-30 backdrop-blur-lg">
        <div className="absolute inset-0 bg-background/70 border-y border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.03] via-transparent to-accent/[0.03]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-6 py-6 font-serif font-light tracking-wide transition-all duration-300 border ${activeCategory === 'all' 
                ? 'bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 text-accent shadow-md' 
                : 'hover:bg-accent/5 hover:text-foreground border-white/5 hover:border-accent/20 backdrop-blur-md'}`}
              onClick={() => setActiveCategory('all')}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${activeCategory === 'all' ? 'bg-accent/20' : 'bg-white/5'} mr-2`}>
                <Tag className="w-3.5 h-3.5" />
              </div>
              All Articles
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-6 py-6 font-serif font-light tracking-wide transition-all duration-300 border ${activeCategory === 'mind' 
                ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/30 text-blue-500 shadow-md' 
                : 'hover:bg-blue-500/5 hover:text-blue-500 border-white/5 hover:border-blue-500/20 backdrop-blur-md'}`}
              onClick={() => setActiveCategory('mind')}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${activeCategory === 'mind' ? 'bg-blue-500/20' : 'bg-white/5'} mr-2`}>
                <Brain className="w-3.5 h-3.5" />
              </div>
              Mind
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-6 py-6 font-serif font-light tracking-wide transition-all duration-300 border ${activeCategory === 'body' 
                ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-400/30 text-amber-400 shadow-md' 
                : 'hover:bg-amber-500/5 hover:text-amber-400 border-white/5 hover:border-amber-400/20 backdrop-blur-md'}`}
              onClick={() => setActiveCategory('body')}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${activeCategory === 'body' ? 'bg-amber-500/20' : 'bg-white/5'} mr-2`}>
                <Heart className="w-3.5 h-3.5" />
              </div>
              Body
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-6 py-6 font-serif font-light tracking-wide transition-all duration-300 border ${activeCategory === 'spirit' 
                ? 'bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/30 text-purple-500 shadow-md' 
                : 'hover:bg-purple-500/5 hover:text-purple-500 border-white/5 hover:border-purple-500/20 backdrop-blur-md'}`}
              onClick={() => setActiveCategory('spirit')}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${activeCategory === 'spirit' ? 'bg-purple-500/20' : 'bg-white/5'} mr-2`}>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              Spirit
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 md:py-32 relative overflow-visible">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-accent/[0.03]"></div>
        <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-accent/5 to-amber-200/10 blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tl from-accent/5 to-amber-200/5 blur-3xl opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {filteredPosts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20 backdrop-blur-sm bg-white/[0.05] border border-white/10 rounded-2xl shadow-lg px-10"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-accent/70" />
              </div>
              <h3 className="text-2xl font-serif font-light text-foreground/80 mb-6">No articles found in this category.</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">Try selecting a different category or browse all our articles.</p>
              <Button 
                variant="outline"
                size="lg"
                className="mt-4 rounded-full px-8 py-6 border-accent/20 hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 text-accent"
                onClick={() => setActiveCategory('all')}
              >
                View all articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                  className="h-full"
                >
                  <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 group relative">
                    {/* Card decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] via-transparent to-accent/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.02] mix-blend-overlay"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-tr from-accent/15 to-transparent blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute inset-0 border border-white/10 group-hover:border-accent/10 rounded-2xl transition-colors duration-500"></div>
                    
                    {/* Image section */}
                    <div className="aspect-[5/3] bg-muted/20 relative overflow-hidden group-hover:shadow-lg transition-all duration-500">
                      {/* Premium Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-40 mix-blend-multiply group-hover:opacity-20 transition-opacity duration-700 z-10"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent opacity-30 z-10"></div>
                      
                      {/* Image placeholder (would be replaced with actual image) */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-amber-200/5"></div>
                      
                      {/* Category badge */}
                      <div className="absolute bottom-5 left-5 z-20">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium tracking-wide backdrop-blur-md shadow-lg border transition-all duration-500 ${post.category === 'mind' 
                          ? 'bg-gradient-to-r from-blue-500/60 to-blue-400/40 text-white border-white/20 shadow-blue-500/10' 
                          : post.category === 'body' 
                          ? 'bg-gradient-to-r from-amber-500/60 to-amber-400/40 text-white border-white/20 shadow-amber-500/10' 
                          : 'bg-gradient-to-r from-purple-500/60 to-purple-400/40 text-white border-white/20 shadow-purple-500/10'
                        }`}>
                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 mr-2">
                            {categoryIcons[post.category]}
                          </div>
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 md:p-10 flex-grow flex flex-col relative z-10">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground/80 mb-5">
                        <span className="flex items-center text-xs font-light">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-accent/70" />
                          {formatDate(post.date)}
                        </span>
                        <span className="text-accent/20">•</span>
                        <span className="flex items-center text-xs font-light">
                          <Clock className="w-3.5 h-3.5 mr-2 text-accent/70" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-serif font-light leading-snug mb-5 group-hover:text-accent transition-colors duration-300">
                        <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-foreground/70 font-light leading-relaxed mb-8 flex-grow">{post.excerpt}</p>
                      
                      <div className="pt-5 border-t border-white/5 group-hover:border-accent/10 transition-colors duration-500">
                        <Button 
                          variant="ghost" 
                          className="px-0 hover:bg-transparent group/btn" 
                          asChild
                        >
                          <Link href={`/blog/${post.slug}`} className="flex items-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-amber-400 font-medium">Read Article</span>
                            <span className="w-7 h-7 ml-3 flex items-center justify-center rounded-full bg-accent/10 text-accent group-hover/btn:bg-accent group-hover/btn:text-white transition-all duration-300 group-hover/btn:translate-x-1.5">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-accent/[0.05]"></div>
        <div className="absolute -top-40 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-accent/10 to-amber-300/5 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-accent/5 to-transparent blur-3xl opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-[0.02] mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto backdrop-blur-lg rounded-2xl p-10 md:p-16 relative overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Inner card decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/10 opacity-70"></div>
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-accent/5 to-transparent opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-gradient-to-tl from-accent/10 to-transparent blur-3xl opacity-20"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block text-sm font-medium tracking-wider uppercase text-accent/80 px-4 py-1 rounded-full border border-accent/10 bg-accent/5 shadow-sm mb-6">
                  Exclusive Insights
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-6">
                  Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Wellness Journey</span>
                </h2>
                <div className="h-px w-20 bg-gradient-to-r from-accent/30 to-transparent mx-auto my-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed mb-10">
                  Subscribe to our curated newsletter for premium articles, expert insights, and exclusive content delivered directly to your inbox.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-6 py-4 rounded-full border border-white/10 bg-white/[0.03] text-foreground focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 flex-grow backdrop-blur-sm shadow-inner transition-all duration-300 font-light"
                />
                <Button 
                  size="lg" 
                  className="rounded-full bg-gradient-to-r from-accent to-amber-500 border-none text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-8 py-6 font-medium"
                >
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
