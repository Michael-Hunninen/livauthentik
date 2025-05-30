"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Sparkles, ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              LivAuthentik Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Nourish Your Mind, Body & Spirit
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover articles, guides, and insights to help you live a more balanced and authentic life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setActiveCategory('all')}
            >
              <Tag className="w-4 h-4 mr-2" />
              All Articles
            </Button>
            <Button
              variant={activeCategory === 'mind' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setActiveCategory('mind')}
            >
              <Brain className="w-4 h-4 mr-2" />
              Mind
            </Button>
            <Button
              variant={activeCategory === 'body' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setActiveCategory('body')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Body
            </Button>
            <Button
              variant={activeCategory === 'spirit' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setActiveCategory('spirit')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Spirit
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">No articles found in this category.</h3>
              <Button 
                variant="ghost" 
                className="mt-4"
                onClick={() => setActiveCategory('all')}
              >
                View all articles
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video bg-muted/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
                          {categoryIcons[post.category]}
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold leading-tight">
                        <Link href={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="link" className="px-0" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read more <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Want more content like this?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest articles, tips, and exclusive content delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-grow"
              />
              <Button size="lg" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
