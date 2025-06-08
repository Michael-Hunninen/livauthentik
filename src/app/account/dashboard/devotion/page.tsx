'use client';

import React, { useState, forwardRef, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiHeadphones, FiCoffee, FiArrowRight } from 'react-icons/fi';

// UI Components
const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
}>(({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? 'div' : 'button';
  const variants = {
    default: 'bg-accent hover:bg-accent/90 text-white',
    outline: 'bg-transparent border-2 border-accent text-accent hover:bg-accent/10',
    ghost: 'bg-transparent hover:bg-muted/50 text-foreground',
  };
  
  const sizes = {
    sm: 'h-9 px-3 rounded-md text-xs',
    default: 'h-10 px-4 py-2 rounded-md text-sm',
    lg: 'h-11 px-8 rounded-md text-base',
  };
  
  const buttonProps = {
    className: `inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
      variants[variant as keyof typeof variants] || variants.default
    } ${sizes[size as keyof typeof sizes] || sizes.default} ${className}`,
    ref,
    ...(asChild ? {} : { type: 'button' }),
    ...props,
  };
  
  return React.createElement(Comp, buttonProps, children);
});

Button.displayName = 'Button';

// Card Components
const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }>(({ 
  className = '',
  hoverable = false,
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={`relative bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${
      hoverable ? 'hover:shadow-lg hover:border-accent/50 hover:-translate-y-1' : ''
    } ${className}`}
    {...props}
  />
));

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  className = '', 
  ...props 
}, ref) => (
  <div 
    ref={ref} 
    className={`p-6 pb-2 ${className}`} 
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ 
  className = '', 
  ...props 
}, ref) => (
  <h3 
    ref={ref}
    className={`text-xl font-bold tracking-tight text-foreground ${className}`} 
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ 
  className = '', 
  ...props 
}, ref) => (
  <p 
    ref={ref}
    className={`text-muted-foreground leading-relaxed ${className}`} 
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  className = '', 
  ...props 
}, ref) => (
  <div 
    ref={ref} 
    className={`px-6 py-2 ${className}`} 
    {...props}
  >
    {props.children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  className = '', 
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={`p-6 pt-0 mt-auto ${className}`} 
    {...props}
  >
    {props.children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Tab panel component with animations using CSS for better performance
const TabPanel = ({ 
  isActive, 
  children,
  className = '' 
}: { 
  isActive: boolean; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      key={isActive ? 'active' : 'inactive'}
      initial={false}
      animate={isActive ? 'visible' : 'hidden'}
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          display: 'block',
          transition: { duration: 0.3, ease: 'easeInOut' }
        },
        hidden: { 
          opacity: 0, 
          y: 10,
          transition: { duration: 0.2, ease: 'easeInOut' },
          transitionEnd: { display: 'none' }
        }
      }}
      className={`${className} ${!isActive ? 'pointer-events-none' : ''}`}
    >
      {children}
    </motion.div>
  );
};

// Mock data for the Devotion Experience sections
const workoutPrograms = [
  {
    id: 'strength-fundamentals',
    title: 'Strength Fundamentals',
    description: 'Build strength and endurance with this 8-week foundational program.',
    image: '/images/fitness/strength.jpg',
    level: 'Beginner',
    duration: '8 weeks',
    sessions: 24
  },
  {
    id: 'cardio-sculpt',
    title: 'Cardio Sculpt',
    description: 'High-intensity cardio combined with targeted sculpting exercises.',
    image: '/images/fitness/cardio.jpg',
    level: 'Intermediate',
    duration: '6 weeks',
    sessions: 18
  },
  {
    id: 'yoga-flow',
    title: 'Yoga Flow',
    description: 'Improve flexibility and mindfulness with progressive yoga practices.',
    image: '/images/fitness/yoga.jpg',
    level: 'All Levels',
    duration: '10 weeks',
    sessions: 30
  }
];

const mealPlans = [
  {
    id: 'clean-eating',
    title: 'Clean Eating',
    description: 'Whole foods, minimal processing, maximum nutrition.',
    image: '/images/meals/clean-eating.jpg',
    duration: '4 weeks',
    meals: 84,
    dietaryOptions: ['Vegetarian Option', 'Gluten-Free Option']
  },
  {
    id: 'high-protein',
    title: 'High Protein',
    description: 'Focus on lean proteins and muscle-building nutrition.',
    image: '/images/meals/protein.jpg',
    duration: '4 weeks',
    meals: 84,
    dietaryOptions: ['Dairy-Free Option']
  },
  {
    id: 'balanced-nutrition',
    title: 'Balanced Nutrition',
    description: 'Perfectly portioned meals with balanced macronutrients.',
    image: '/images/meals/balanced.jpg',
    duration: '4 weeks',
    meals: 84,
    dietaryOptions: ['Vegetarian Option', 'Dairy-Free Option']
  }
];

const audioCoaching = [
  {
    id: 'morning-motivation',
    title: 'Morning Motivation',
    description: 'Start your day with intention and purpose.',
    image: '/images/coaching/morning.jpg',
    duration: '10-15 min',
    episodes: 28,
    journalPrompts: 14
  },
  {
    id: 'mindset-mastery',
    title: 'Mindset Mastery',
    description: 'Transform your thinking for greater confidence and clarity.',
    image: '/images/coaching/mindset.jpg',
    duration: '15-20 min',
    episodes: 21,
    journalPrompts: 21
  },
  {
    id: 'evening-reflection',
    title: 'Evening Reflection',
    description: 'Unwind and process your day with guided reflection.',
    image: '/images/coaching/evening.jpg',
    duration: '10-15 min',
    episodes: 28,
    journalPrompts: 14
  }
];

function ProgramCard({ 
  title, 
  description, 
  progress = 0, 
  daysCompleted = 0, 
  totalDays = 0, 
  locked = false,
  href = '#'
}: {
  title: string;
  description: string;
  progress?: number;
  daysCompleted?: number;
  totalDays?: number;
  locked?: boolean;
  href?: string;
}) {
  return (
    <Card className="overflow-hidden border-border/30 transition-all hover:border-accent/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between space-x-4">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {locked && (
            <span className="inline-flex h-6 items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Coming Soon
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!locked && progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Day {daysCompleted} of {totalDays}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        )}
        
        {!locked && progress === 0 && (
          <div className="text-sm text-muted-foreground">
            <p>Ready to begin your journey</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-border/10 bg-muted/5 p-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto" 
          disabled={locked}
          asChild={!locked}
        >
          {locked ? (
            <span>Locked</span>
          ) : (
            <Link href={href} className="flex items-center">
              {progress > 0 ? 'Continue' : 'Start'}
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Featured Program Component
const FeaturedProgram = ({ 
  title, 
  subtitle,
  description, 
  image = '/images/fitness-placeholder.jpg',
  progress = 0, 
  daysCompleted = 0, 
  totalDays = 0, 
  href = '#',
  startDate = 'June 2025'
}: {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  progress?: number;
  daysCompleted?: number;
  totalDays?: number;
  href?: string;
  startDate?: string;
}) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
      }}
      className="relative bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-10"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-20 -mb-20 z-0"></div>
      
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="relative md:w-1/3 lg:w-2/5 shrink-0">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-transparent to-transparent mix-blend-overlay z-10"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-20">
              <span className="text-xs font-semibold text-white">Featured this Month</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-20">
              <span className="text-xs font-semibold text-white">Starts {startDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between md:w-2/3 lg:w-3/5 relative z-10">
          <div>
            <div className="mb-2">
              <span className="text-xs uppercase tracking-wide font-medium text-accent/80">{subtitle}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            
            {progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent/70 to-accent h-2 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Day {daysCompleted} of {totalDays}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Link 
              href={href}
              className="inline-flex items-center justify-center h-10 px-6 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-md transition-colors duration-200"
            >
              {progress > 0 ? 'Continue' : 'Start Now'}
            </Link>
            <Link
              href={`${href}/details`}
              className="text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1 group"
            >
              View Details
              <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DevotionExperience() {
  const [activeTab, setActiveTab] = React.useState('fitness');
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-8 relative overflow-hidden min-h-screen"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-background to-accent/5"></div>
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-accent/5 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-tl from-accent/5 to-transparent blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl opacity-40"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 relative"
      >
        <div className="inline-block mb-4">
          <span className="text-accent text-sm uppercase tracking-widest font-medium bg-accent/5 px-3 py-1 rounded-full border border-accent/10 shadow-sm">
            LivAuthentik Devotion
          </span>
        </div>
        
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground tracking-tight leading-tight">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Devotion</span> Journey
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-accent/40 to-transparent my-4"></div>
          <p className="text-lg text-muted-foreground font-light">
            Transform your mind, body, and spirit with our exclusive devotion programs
          </p>
        </div>
      </motion.div>

      {/* Luxury Tab Navigation */}
      <div className="mb-10 relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        <div className="flex flex-wrap -mb-px relative z-10">
          <button
            onClick={() => setActiveTab('fitness')}
            className={`mr-8 py-3 px-1 font-medium text-sm border-b-2 transition-all duration-300 ${
              activeTab === 'fitness' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-accent/30'
            }`}
          >
            <div className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300 ${activeTab === 'fitness' ? 'bg-accent' : 'bg-muted-foreground/40'}`}></span>
              <FiAward className="mr-2 h-4 w-4" /> Fitness
            </div>
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`mr-8 py-3 px-1 font-medium text-sm border-b-2 transition-all duration-300 ${
              activeTab === 'nutrition' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-accent/30'
            }`}
          >
            <div className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300 ${activeTab === 'nutrition' ? 'bg-accent' : 'bg-muted-foreground/40'}`}></span>
              <FiCoffee className="mr-2 h-4 w-4" /> Nutrition
            </div>
          </button>
          <button
            onClick={() => setActiveTab('mind')}
            className={`mr-8 py-3 px-1 font-medium text-sm border-b-2 transition-all duration-300 ${
              activeTab === 'mind' 
                ? 'text-accent border-accent' 
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-accent/30'
            }`}
          >
            <div className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300 ${activeTab === 'mind' ? 'bg-accent' : 'bg-muted-foreground/40'}`}></span>
              <FiHeadphones className="mr-2 h-4 w-4" /> Mind
            </div>
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        {/* Fitness Tab */}
        <TabPanel isActive={activeTab === 'fitness'}>
          <FeaturedProgram
            title="Elite Power & Performance"
            subtitle="Featured Fitness Program"
            description="Our signature 12-week progressive strength and conditioning program designed to maximize athletic performance, build lean muscle, and enhance overall fitness. Includes personalized progression tracking and advanced training techniques."
            progress={0}
            daysCompleted={0}
            totalDays={84}
            href="/account/dashboard/devotion/fitness/elite-power-performance"
            image="/images/fitness-elite.jpg"
            startDate="June 15, 2025"
          />
          
          <h2 className="text-2xl font-serif font-light mt-12 mb-6 text-foreground">Your Active Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPrograms.map((program: any) => (
              <ProgramCard key={program.id} {...program} />
            ))}
          </div>
        </TabPanel>
        
        {/* Nutrition Tab */}
        <TabPanel isActive={activeTab === 'nutrition'}>
          <FeaturedProgram
            title="Luxury Wellness Cuisine"
            subtitle="Featured Nutrition Program"
            description="Experience the art of mindful eating with our premium culinary wellness program. This 28-day journey combines gourmet nutrition with science-backed meal planning, featuring seasonal ingredients and chef-crafted recipes designed to nourish both body and soul."
            progress={30}
            daysCompleted={8}
            totalDays={28}
            href="/account/dashboard/devotion/nutrition/wellness-cuisine"
            image="/images/nutrition-luxury.jpg"
            startDate="June 1, 2025"
          />
          
          <h2 className="text-2xl font-serif font-light mt-12 mb-6 text-foreground">Your Active Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan: any) => (
              <ProgramCard key={plan.id} {...plan} />
            ))}
          </div>
        </TabPanel>
        
        {/* Mind Tab */}
        <TabPanel isActive={activeTab === 'mind'}>
          <FeaturedProgram
            title="Mindful Mastery Journey"
            subtitle="Featured Mind Program"
            description="A transformative 6-week mindfulness and mental performance program designed to enhance focus, reduce stress, and unlock your full cognitive potential. Includes daily guided meditations, breathing exercises, and cognitive training techniques."
            progress={65}
            daysCompleted={23}
            totalDays={42}
            href="/account/dashboard/devotion/mind/mindful-mastery"
            image="/images/mind-mastery.jpg"
            startDate="May 18, 2025"
          />
          
          <h2 className="text-2xl font-serif font-light mt-12 mb-6 text-foreground">Your Active Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioCoaching.map((program: any) => (
              <ProgramCard key={program.id} {...program} />
            ))}
          </div>
        </TabPanel>
      </div>
    </motion.div>
  );
}
