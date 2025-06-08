import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, this would come from a CMS or API
const getPostBySlug = (slug: string) => {
  const posts = [
    {
      id: '1',
      title: 'The Power of Positive Thinking',
      content: `
        <p>In today's fast-paced world, maintaining a positive mindset can be challenging, yet it's more important than ever. Positive thinking isn't about ignoring life's difficulties; it's about approaching them with a productive and hopeful mindset.</p>
        <h2>The Science Behind Positivity</h2>
        <p>Research shows that positive thinking can lead to numerous health benefits, including reduced stress, lower rates of depression, and even a longer lifespan. When we think positively, our brain releases endorphins and serotonin, which promote feelings of happiness and well-being.</p>
        <h2>Practical Ways to Cultivate Positivity</h2>
        <ul>
          <li>Practice gratitude daily by writing down three things you're thankful for</li>
          <li>Surround yourself with positive influences</li>
          <li>Challenge negative thoughts with evidence-based thinking</li>
          <li>Engage in activities that bring you joy</li>
          <li>Practice mindfulness and meditation</li>
        </ul>
        <p>Remember, positive thinking is a skill that can be developed with practice and patience.</p>
      `,
      excerpt: 'Discover how positive thinking can transform your mindset and improve your overall well-being.',
      category: 'mind',
      readTime: '5 min read',
      date: '2025-05-20',
      author: 'Sarah Johnson',
      authorImage: '/images/avatars/sarah.jpg',
      authorBio: 'Wellness Coach & Mindfulness Expert',
      image: '/images/blog/positive-thinking.jpg',
      slug: 'the-power-of-positive-thinking',
      tags: ['mindset', 'wellbeing', 'mental health']
    },
    // Add more posts as needed
  ];
  
  return posts.find(post => post.slug === slug);
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const shareText = `Check out this article: ${post.title}`;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all articles
        </Link>
      </div>
      
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Badge>
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-muted/50 hover:bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-border">
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-accent/20">
              <Image 
                src={post.authorImage} 
                alt={post.author} 
                width={48} 
                height={48} 
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">{post.authorBio}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readTime}
            </div>
          </div>
        </div>
      </header>
      
      <div className="relative rounded-xl overflow-hidden mb-12 bg-muted/30 border border-border">
        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={630}
          className="w-full h-auto aspect-video object-cover"
          priority
        />
      </div>
      
      <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:text-foreground prose-p:text-muted-foreground/90 prose-ul:marker:text-accent prose-li:marker:text-accent/70 prose-a:text-accent hover:prose-a:text-accent/80 prose-a:transition-colors prose-img:rounded-xl">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      <div className="mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Share this article</h3>
            <p className="text-sm text-muted-foreground">Found this helpful? Share it with others</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a 
                href={`mailto:?subject=${encodeURIComponent(shareText)}&body=Check out this article: ${encodedShareUrl}`}
                aria-label="Share via Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-border">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-light mb-6">Continue Your Journey</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore more articles and resources to support your path to wellness and self-discovery.
          </p>
          <Button asChild>
            <Link href="/blog">
              View All Articles
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
