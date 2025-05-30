'use client';

import React, { useState, ReactNode, isValidElement, Children, forwardRef, ForwardedRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FiAward, FiClock, FiHeadphones, FiCoffee, FiCalendar, FiBook, FiPlay, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

// Simple UI component implementations
type ButtonElement = HTMLButtonElement;

type ButtonProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'asChild'>;

const Button = forwardRef<ButtonElement, ButtonProps>(({ 
  children, 
  className = '', 
  asChild = false,
  variant = 'default',
  size = 'default',
  ...props 
}: ButtonProps, ref: ForwardedRef<ButtonElement>) => {
  const Comp = asChild ? 'div' : 'button';
  const variants = {
    default: 'bg-accent hover:bg-accent/90 text-white',
    outline: 'bg-transparent border-2 border-accent text-accent hover:bg-accent/10',
    ghost: 'bg-transparent hover:bg-accent/10 text-accent',
  };
  
  const sizes = {
    sm: 'py-1.5 px-3 text-xs',
    default: 'py-2.5 px-5 text-sm',
    lg: 'py-3 px-6 text-base',
  };
  
  const buttonProps = {
    className: `font-medium transition-all duration-200 ease-in-out rounded-lg flex items-center justify-center gap-2 ${
      variants[variant as keyof typeof variants] || variants.default
    } ${sizes[size as keyof typeof sizes] || sizes.default} ${className}`,
    ...(asChild ? {} : props),
    ref,
  };
  
  return React.createElement(
    Comp,
    {
      ...buttonProps,
      ...(asChild ? {} : { type: 'button' } as const)
    },
    children
  );
});

Button.displayName = 'Button';

// Simple card components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  ...props 
}: CardProps) => (
  <div 
    className={`relative bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${
      hoverable ? 'hover:shadow-lg hover:border-accent/50 hover:-translate-y-1' : ''
    } ${className}`} 
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card/30 pointer-events-none" />
    <div className="relative z-10 h-full flex flex-col">
      {children}
    </div>
  </div>
);
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '', ...props }: CardHeaderProps) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className = '', ...props }: CardContentProps) => (
  <div className={`px-6 py-2 ${className}`} {...props}>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className = '', ...props }: CardFooterProps) => (
  <div className={`p-6 pt-0 mt-auto ${className}`} {...props}>
    <div className="flex items-center">
      {children}
    </div>
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

const CardTitle = ({ children, className = '', ...props }: CardTitleProps) => (
  <h3 className={`text-xl font-bold tracking-tight text-foreground ${className}`} {...props}>
    {children}
  </h3>
);

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

const CardDescription = ({ children, className = '', ...props }: CardDescriptionProps) => (
  <p className={`text-muted-foreground leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

// Enhanced tabs components with better animations and TypeScript types
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TabsContextType {
  activeValue: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ 
  children, 
  defaultValue, 
  value: valueProp, 
  onValueChange, 
  className = '',
  ...props 
}, ref) => {
  const [activeTab, setActiveTab] = React.useState<string>(defaultValue);
  const value = valueProp !== undefined ? valueProp : activeTab;
  
  const handleTabChange = React.useCallback((val: string) => {
    if (valueProp === undefined) {
      setActiveTab(val);
    }
    onValueChange?.(val);
  }, [onValueChange, valueProp]);
  
  const contextValue = React.useMemo(() => ({
    activeValue: value,
    onValueChange: handleTabChange
  }), [value, handleTabChange]);
  
  return (
    <div 
      ref={ref} 
      className={`w-full ${className}`} 
      data-active-tab={value}
      {...props}
    >
      <TabsContext.Provider value={contextValue}>
        {children}
      </TabsContext.Provider>
    </div>
  );
});

Tabs.displayName = 'Tabs';

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be rendered within the Tabs component');
  }
  return context;
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={`relative mb-8 ${className}`}
    role="tablist"
    {...props}
  >
    <div className="flex space-x-1 bg-muted/30 p-1.5 rounded-xl">
      {children}
    </div>
  </div>
));

TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  value: string;
  isActive?: boolean;
  className?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ 
  children, 
  value, 
  className = '',
  ...props 
}, ref) => {
  const context = useTabsContext();
  const isActive = context.activeValue === value;
  
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out relative z-10 ${
        isActive 
          ? 'bg-white text-foreground shadow-sm' 
          : 'text-muted-foreground hover:text-foreground/80'
      } ${className}`}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      <span className="relative z-10">
        {children}
      </span>
      {isActive && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-lg shadow-sm border border-border/20 z-0"
          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
        />
      )}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'style'> {
  children: React.ReactNode;
  value: string;
  isActive?: boolean;
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ 
  children, 
  value, 
  className = '',
  ...props 
}, ref) => {
  const context = useTabsContext();
  const isActive = context.activeValue === value;
  
  if (!isActive) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        data-value={value} 
        className={className}
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        {...props as any}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

TabsContent.displayName = 'TabsContent';

// Set display names for components
TabsContent.displayName = 'TabsContent';
TabsTrigger.displayName = 'TabsTrigger';
TabsList.displayName = 'TabsList';

// Mock data for the Devotion Experience sections
const fitnessPlans = [
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

export default function DevotionExperience() {
  const [activeTab, setActiveTab] = useState('fitness');
  
      const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const handleStartPlan = (type: string, id: string) => {
    let route = '';
    
    switch (type) {
      case 'fitness':
        route = `/account/dashboard/devotion/fitness/${id}`;
        break;
      case 'meal':
        route = `/account/dashboard/devotion/meals/${id}`;
        break;
      case 'coaching':
        route = `/account/dashboard/devotion/coaching/${id}`;
        break;
      default:
        console.error('Unknown plan type:', type);
        return;
    }
    
    // In a real app, you might want to track the plan start or other analytics here
    console.log(`Navigating to: ${route}`);
    
    // Use Next.js router to navigate
    window.location.href = route;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <motion.span 
          className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Premium Content
        </motion.span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
          Devotion Experience
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Transform your body and mind with our exclusive content, designed to help you achieve your wellness goals through personalized fitness, nutrition, and mindset coaching.
        </p>
      </motion.div>

      {/* Featured Program */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        className="mt-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-accent/5 to-accent/25 backdrop-blur border-accent/20 hover:shadow-lg hover:border-accent/30 transition-all duration-300">
          <div className="md:flex">
            <div className="md:w-1/3 bg-accent/10 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                  <FiAward className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Featured Program</h3>
                <p className="text-sm text-muted-foreground">30-Day Transformation Challenge</p>
              </div>
            </div>
            <div className="p-6 md:w-2/3">
              <CardHeader className="p-0 mb-4">
                <CardTitle>30-Day Total Transformation</CardTitle>
                <CardDescription>A holistic approach combining fitness, nutrition, and mindset coaching for maximum results.</CardDescription>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/40 backdrop-blur-sm p-4 rounded-lg border border-border/20">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2 text-accent" />
                    Daily Workouts
                  </h4>
                  <p className="text-xs text-muted-foreground">5 sessions per week, 30-45 min each</p>
                </div>
                <div className="bg-background/40 backdrop-blur-sm p-4 rounded-lg border border-border/20">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FiBook className="w-4 h-4 mr-2 text-accent" />
                    Meal Plans
                  </h4>
                  <p className="text-xs text-muted-foreground">Customizable recipes & shopping lists</p>
                </div>
                <div className="bg-background/40 backdrop-blur-sm p-4 rounded-lg border border-border/20">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FiPlay className="w-4 h-4 mr-2 text-accent" />
                    Audio Coaching
                  </h4>
                  <p className="text-xs text-muted-foreground">Daily motivation & mindset training</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1" variant="default">
                  <Link href="/account/dashboard/devotion/programs/transformation">
                    Start Free Trial
                  </Link>
                </Button>
                <Button asChild className="flex-1" variant="outline">
                  <Link href="/account/dashboard/devotion/programs/transformation/details">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <Tabs 
        defaultValue="fitness" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mt-12"
      >
        <TabsList>
          <TabsTrigger value="fitness">Fitness Plans ({fitnessPlans.length})</TabsTrigger>
          <TabsTrigger value="meals">Meal Plans ({mealPlans.length})</TabsTrigger>
          <TabsTrigger value="coaching">Audio Coaching ({audioCoaching.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="fitness">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300" hoverable>
                  <CardHeader>
                    <div className="aspect-video bg-muted/50 rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${plan.image})` }} />
                    </div>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <FiAward className="mr-1.5 h-4 w-4" />
                        {plan.level}
                      </span>
                      <span className="inline-flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4" />
                        {plan.duration}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartPlan('fitness', plan.id)}
                    >
                      Start Plan
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        {/* Meal Plans Tab */}
        <TabsContent value="meals">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300" hoverable>
                  <CardHeader>
                    <div className="aspect-video bg-muted/50 rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${plan.image})` }} />
                    </div>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4" />
                        {plan.duration}
                      </span>
                      <span className="inline-flex items-center">
                        <FiCoffee className="mr-1.5 h-4 w-4" />
                        {plan.meals} Meals
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartPlan('meal', plan.id)}
                    >
                      Start Plan
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        {/* Audio Coaching Tab */}
        <TabsContent value="coaching">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioCoaching.map((session, index) => (
              <motion.div
                key={session.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300" hoverable>
                  <CardHeader>
                    <div className="aspect-video bg-muted/50 rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${session.image})` }} />
                    </div>
                    <CardTitle>{session.title}</CardTitle>
                    <CardDescription>{session.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4" />
                        {session.duration}
                      </span>
                      <span className="inline-flex items-center">
                        <FiHeadphones className="mr-1.5 h-4 w-4" />
                        {session.episodes} Sessions
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartPlan('coaching', session.id)}
                    >
                      Start Session
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>


    </div>
  );
}
