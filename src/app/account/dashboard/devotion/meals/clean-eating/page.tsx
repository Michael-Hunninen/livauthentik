'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Utensils, ShoppingBag, BookOpen } from 'lucide-react';

// UI Components
const Button = ({ children, className = '', asChild, ...props }: any) => {
  const Comp = asChild ? 'div' : 'button';
  return (
    <Comp className={`bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-md flex items-center justify-center ${className}`} {...props}>
      {children}
    </Comp>
  );
};

const Progress = ({ value = 0, className = '' }: any) => {
  return (
    <div className={`w-full bg-muted h-1 rounded-full ${className}`}>
      <div className="bg-accent h-full rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  );
};

// Card Components
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`border rounded-lg overflow-hidden ${className}`} {...props}>{children}</div>
);

const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);

const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-4 pt-0 ${className}`} {...props}>{children}</div>
);

const CardFooter = ({ children, className = '', ...props }: any) => (
  <div className={`p-4 pt-0 flex items-center ${className}`} {...props}>{children}</div>
);

const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`font-semibold text-lg ${className}`} {...props}>{children}</h3>
);

const CardDescription = ({ children, className = '', ...props }: any) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>
);

// Tabs Components
const Tabs = ({ children, defaultValue, value, onValueChange, className = '' }: any) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (onValueChange) onValueChange(val);
  };

  // Find the active tab content
  const activeContent = React.Children.toArray(children).find(
    (child: any) => child?.type?.displayName === 'TabsContent' && child.props.value === activeTab
  );

  // Clone children to pass activeTab and onValueChange to TabsList
  const childrenWithProps = React.Children.map(children, (child: any) => {
    if (child?.type?.displayName === 'TabsList') {
      return React.cloneElement(child, {
        activeTab,
        onValueChange: handleTabChange
      });
    }
    return null; // Don't render TabsContent here, we'll render it separately
  });

  return (
    <div className={className}>
      {childrenWithProps}
      {activeContent}
    </div>
  );
};

const TabsList = ({ children, activeTab, onValueChange, className = '' }: any) => (
  <div className={`flex border-b ${className}`}>
    {React.Children.map(children, child => (
      React.cloneElement(child, {
        isActive: child.props.value === activeTab,
        onValueChange: (val: string) => onValueChange(val)
      })
    ))}
  </div>
);

const TabsTrigger = ({ children, value, isActive, onValueChange, className = '' }: any) => (
  <button
    onClick={() => onValueChange(value)}
    className={`px-4 py-2 text-sm font-medium ${isActive 
      ? 'border-b-2 border-accent text-accent' 
      : 'text-muted-foreground hover:text-foreground'}
    ${className}`}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value }: any) => {
  return <div className="py-4">{children}</div>;
};

// Set display names for components
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

// Types
type Meal = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

type Day = {
  day: number;
  meals: Meal;
  complete: boolean;
  notes?: string;
};

type Week = {
  weekNumber: number;
  theme: string;
  complete: boolean;
  days: Day[];
};

// Meal Item Component
const MealItem = ({ time, meal, isActive }: { time: string; meal: string; isActive?: boolean }) => (
  <div className="group">
    <div className="text-xs text-muted-foreground mb-0.5">{time}</div>
    <div className={`text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-foreground'} group-hover:text-accent/90`}>
      {meal}
    </div>
  </div>
);

// Mock data for Clean Eating program
const programData = {
  title: 'Clean Eating Plan',
  description: 'Nourish your body with whole, unprocessed foods in this 4-week program.',
  progress: 45,
  weeks: 4,
  currentWeek: 2,
  currentDay: 3,
  level: 'All Levels',
  dietaryOptions: ['Vegetarian', 'Gluten-Free'],
  overview: 'This program focuses on whole, unprocessed foods to help you establish healthy eating habits, improve digestion, and increase energy levels naturally.'
};

// Mock meal plan data
const mealPlanWeeks = [
  {
    weekNumber: 1,
    theme: 'Pantry Reset',
    complete: true,
    days: [
      { 
        day: 1, 
        meals: {
          breakfast: 'Overnight Oats with Berries',
          lunch: 'Quinoa & Roasted Veggie Bowl',
          dinner: 'Baked Salmon with Steamed Vegetables'
        },
        complete: true,
        notes: 'Prep overnight oats the night before'
      },
      { 
        day: 2, 
        meals: {
          breakfast: 'Greek Yogurt with Nuts & Honey',
          lunch: 'Grilled Chicken Salad',
          dinner: 'Vegetable Stir-Fry with Brown Rice'
        },
        complete: true,
        notes: 'Marinate chicken in advance'
      },
      { 
        day: 3, 
        meals: {
          breakfast: 'Avocado Toast with Poached Eggs',
          lunch: 'Lentil Soup with Whole Grain Bread',
          dinner: 'Grilled Shrimp with Quinoa and Asparagus'
        },
        complete: true,
        notes: 'Use fresh herbs for extra flavor'
      },
      { 
        day: 4, 
        meals: {
          breakfast: 'Smoothie Bowl with Granola',
          lunch: 'Turkey & Avocado Wrap',
          dinner: 'Baked Chicken with Sweet Potatoes'
        },
        complete: true,
        notes: 'Prep smoothie ingredients the night before'
      },
      { 
        day: 5, 
        meals: {
          breakfast: 'Chia Pudding with Fresh Fruit',
          lunch: 'Quinoa Salad with Chickpeas',
          dinner: 'Grilled Fish with Steamed Vegetables'
        },
        complete: true,
        notes: 'Make extra quinoa for meal prep'
      },
      { 
        day: 6, 
        meals: {
          breakfast: 'Scrambled Eggs with Spinach',
          lunch: 'Grilled Chicken Wrap',
          dinner: 'Vegetable Curry with Brown Rice'
        },
        complete: false,
        notes: 'Try adding fresh cilantro to the curry'
      },
      { 
        day: 7, 
        meals: {
          breakfast: 'Omelet with Vegetables',
          lunch: 'Salmon Salad',
          dinner: 'Grilled Steak with Roasted Vegetables'
        },
        complete: false,
        notes: 'Marinate steak for at least 30 minutes'
      },
    ]
  },
  {
    weekNumber: 2,
    theme: 'Meal Prep Essentials',
    complete: false,
    days: [
      { 
        day: 1, 
        meals: {
          breakfast: 'Berry Smoothie',
          lunch: 'Quinoa Salad with Grilled Chicken',
          dinner: 'Baked Cod with Roasted Vegetables'
        },
        complete: true,
        notes: 'Prep quinoa in advance for the week'
      },
      { 
        day: 2, 
        meals: {
          breakfast: 'Avocado Toast with Eggs',
          lunch: 'Turkey & Hummus Wrap',
          dinner: 'Grilled Shrimp with Quinoa'
        },
        complete: true,
        notes: 'Make extra hummus for snacks'
      },
      { 
        day: 3, 
        meals: {
          breakfast: 'Greek Yogurt with Granola',
          lunch: 'Chicken Caesar Salad',
          dinner: 'Vegetable Stir-Fry with Tofu'
        },
        complete: true,
        notes: 'Press tofu for better texture'
      },
      { 
        day: 4, 
        meals: {
          breakfast: 'Oatmeal with Nuts and Berries',
          lunch: 'Grilled Chicken Wrap',
          dinner: 'Baked Salmon with Asparagus'
        },
        complete: true,
        notes: 'Use fresh dill for salmon'
      },
      { 
        day: 5, 
        meals: {
          breakfast: 'Smoothie Bowl',
          lunch: 'Quinoa & Roasted Veggie Bowl',
          dinner: 'Grilled Steak with Sweet Potatoes'
        },
        complete: false,
        notes: 'Marinate steak with garlic and herbs'
      },
      { 
        day: 6, 
        meals: {
          breakfast: 'Scrambled Eggs with Vegetables',
          lunch: 'Grilled Chicken Salad',
          dinner: 'Vegetable Curry with Brown Rice'
        },
        complete: false,
        notes: 'Make extra curry for leftovers'
      },
      { 
        day: 7, 
        meals: {
          breakfast: 'Pancakes with Fresh Fruit',
          lunch: 'Salmon Salad',
          dinner: 'Grilled Chicken with Roasted Vegetables'
        },
        complete: false,
        notes: 'Use seasonal vegetables for roasting'
      },
    ]
  },
  {
    weekNumber: 3,
    theme: 'Balanced Macros',
    complete: false,
    days: [
      { 
        day: 1, 
        meals: {
          breakfast: 'Smoothie Bowl with Granola',
          lunch: 'Turkey & Avocado Wrap',
          dinner: 'Baked Chicken with Sweet Potatoes'
        },
        complete: false,
        notes: 'Add a side of steamed greens'
      },
      { 
        day: 2, 
        meals: {
          breakfast: 'Chia Pudding with Fresh Fruit',
          lunch: 'Quinoa Salad with Chickpeas',
          dinner: 'Grilled Fish with Steamed Vegetables'
        },
        complete: false,
        notes: 'Try different herbs for seasoning'
      },
      { 
        day: 3, 
        meals: {
          breakfast: 'Scrambled Eggs with Spinach',
          lunch: 'Grilled Chicken Wrap',
          dinner: 'Vegetable Curry with Brown Rice'
        },
        complete: false,
        notes: 'Include a variety of colorful vegetables'
      },
      { 
        day: 4, 
        meals: {
          breakfast: 'Omelet with Vegetables',
          lunch: 'Salmon Salad',
          dinner: 'Grilled Steak with Roasted Vegetables'
        },
        complete: false,
        notes: 'Try a new spice rub for the steak'
      },
      { 
        day: 5, 
        meals: {
          breakfast: 'Overnight Oats with Berries',
          lunch: 'Quinoa & Roasted Veggie Bowl',
          dinner: 'Baked Salmon with Steamed Vegetables'
        },
        complete: false,
        notes: 'Add lemon and dill to the salmon'
      },
      { 
        day: 6, 
        meals: {
          breakfast: 'Greek Yogurt with Nuts & Honey',
          lunch: 'Grilled Chicken Salad',
          dinner: 'Vegetable Stir-Fry with Brown Rice'
        },
        complete: false,
        notes: 'Use a variety of colorful bell peppers'
      },
      { 
        day: 7, 
        meals: {
          breakfast: 'Avocado Toast with Poached Eggs',
          lunch: 'Lentil Soup with Whole Grain Bread',
          dinner: 'Grilled Shrimp with Quinoa and Asparagus'
        },
        complete: false,
        notes: 'Add a squeeze of lemon before serving'
      },
    ]
  },
  {
    weekNumber: 4,
    theme: 'Sustain & Maintain',
    complete: false,
    days: [
      { 
        day: 1, 
        meals: {
          breakfast: 'Smoothie Bowl with Granola',
          lunch: 'Turkey & Avocado Wrap',
          dinner: 'Baked Chicken with Sweet Potatoes'
        },
        complete: false,
        notes: 'Meal prep chicken in advance'
      },
      { 
        day: 2, 
        meals: {
          breakfast: 'Chia Pudding with Fresh Fruit',
          lunch: 'Quinoa Salad with Chickpeas',
          dinner: 'Grilled Fish with Steamed Vegetables'
        },
        complete: false,
        notes: 'Try different fish varieties'
      },
      { 
        day: 3, 
        meals: {
          breakfast: 'Scrambled Eggs with Spinach',
          lunch: 'Grilled Chicken Wrap',
          dinner: 'Vegetable Curry with Brown Rice'
        },
        complete: false,
        notes: 'Add coconut milk for creamier curry'
      },
      { 
        day: 4, 
        meals: {
          breakfast: 'Omelet with Vegetables',
          lunch: 'Salmon Salad',
          dinner: 'Grilled Steak with Roasted Vegetables'
        },
        complete: false,
        notes: 'Let steak rest before slicing'
      },
      { 
        day: 5, 
        meals: {
          breakfast: 'Overnight Oats with Berries',
          lunch: 'Quinoa & Roasted Veggie Bowl',
          dinner: 'Baked Salmon with Steamed Vegetables'
        },
        complete: false,
        notes: 'Try different vegetable combinations'
      },
      { 
        day: 6, 
        meals: {
          breakfast: 'Greek Yogurt with Nuts & Honey',
          lunch: 'Grilled Chicken Salad',
          dinner: 'Vegetable Stir-Fry with Brown Rice'
        },
        complete: false,
        notes: 'Use tamari for a gluten-free option'
      },
      { 
        day: 7, 
        meals: {
          breakfast: 'Avocado Toast with Poached Eggs',
          lunch: 'Lentil Soup with Whole Grain Bread',
          dinner: 'Grilled Shrimp with Quinoa and Asparagus'
        },
        complete: false,
        notes: 'Add a squeeze of lime for freshness'
      },
    ]
  }
];

// Mock resources
const resources = [
  { 
    id: 1, 
    title: 'Meal Prep Guide', 
    type: 'PDF', 
    icon: <BookOpen className="w-5 h-5 text-accent" />,
    description: 'Complete guide to meal prepping for the week.'
  },
  { 
    id: 2, 
    title: 'Shopping List', 
    type: 'PDF', 
    icon: <ShoppingBag className="w-5 h-5 text-accent" />,
    description: 'Weekly grocery shopping list for all ingredients.'
  },
  { 
    id: 3, 
    title: 'Recipe Collection', 
    type: 'PDF', 
    icon: <Utensils className="w-5 h-5 text-accent" />,
    description: 'All recipes from the Clean Eating program.'
  },
];

export default function CleanEatingPlan() {
  const [activeTab, setActiveTab] = useState('plan');
  const [selectedWeek, setSelectedWeek] = useState(programData.currentWeek);
  
  const currentWeekData = mealPlanWeeks.find(week => week.weekNumber === selectedWeek);
  const todayMeals = currentWeekData?.days.find(day => day.day === programData.currentDay);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Program Overview */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/account/dashboard/devotion" className="text-sm text-accent hover:underline flex items-center mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Devotion Experience
            </Link>
            <h1 className="text-3xl font-bold">{programData.title}</h1>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center rounded-md bg-accent/15 px-2 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/20">
                {programData.level}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">{programData.weeks} weeks • {programData.dietaryOptions.join(' • ')}</span>
            </div>
          </div>

          <Button>
            <Utensils className="mr-2 h-4 w-4" />
            Today's Meals
          </Button>
        </div>


      </motion.div>

      {/* Main Content */}
      <div className="space-y-6">
        <Tabs defaultValue="plan" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="plan">
            <div className="space-y-6">
              {/* Enhanced Week Selector */}
              <div className="relative">
                <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 px-4">
                  {Array.from({ length: programData.weeks }, (_, i) => i + 1).map((weekNum) => {
                    const weekData = mealPlanWeeks.find(w => w.weekNumber === weekNum);
                    const isCurrentWeek = weekNum === programData.currentWeek;
                    const isComplete = weekData?.complete;
                    const isSelected = selectedWeek === weekNum;
                    
                    return (
                      <button
                        key={weekNum}
                        onClick={() => setSelectedWeek(weekNum)}
                        className={`relative px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                          isSelected
                            ? 'bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-accent/20'
                            : isComplete
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                            : 'bg-white dark:bg-gray-800 text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="flex items-center">
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                            ) : isCurrentWeek ? (
                              <Circle className="w-4 h-4 mr-2 text-current" />
                            ) : (
                              <Circle className="w-4 h-4 mr-2 text-current opacity-50" />
                            )}
                            <span className="font-semibold">Week {weekNum}</span>
                          </div>
                          {isCurrentWeek && (
                            <div className="text-xs mt-1 font-normal opacity-90">{currentWeekData?.theme}</div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-accent rotate-45 z-0"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
              </div>

              {/* Enhanced Week Overview */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-accent/5 to-accent/10 p-1">
                  <div className="bg-background rounded-lg">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <h3 className="text-xl font-semibold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                            Week {selectedWeek}: {currentWeekData?.theme}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedWeek === programData.currentWeek 
                              ? 'Your current week • In progress' 
                              : selectedWeek < programData.currentWeek 
                                ? `Completed • ${currentWeekData?.days.filter(d => d.complete).length}/7 days`
                                : 'Upcoming'}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-accent/30 text-accent hover:bg-accent/5 hover:border-accent/50 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Shopping List
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {currentWeekData?.days.map((day) => (
                          <Link 
                            key={day.day}
                            href={`/account/dashboard/devotion/meals/clean-eating/day/${day.day}`}
                            className="block h-full"
                          >
                            <div 
                              className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer hover:shadow-md h-full flex flex-col ${
                                day.day === programData.currentDay 
                                  ? 'border-accent/50 bg-gradient-to-br from-accent/5 to-accent/10' 
                                  : 'border-muted hover:border-accent/30'
                              }`}
                            >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className={`font-medium text-sm ${
                                day.day === programData.currentDay 
                                  ? 'text-accent' 
                                  : 'text-foreground'
                              }`}>
                                {day.day === programData.currentDay ? (
                                  <span className="flex items-center">
                                    <span className="flex h-2 w-2 mr-2">
                                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent/75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                    </span>
                                    Today
                                  </span>
                                ) : `Day ${day.day}`}
                              </h4>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle day completion
                                  console.log('Toggle completion for day:', day.day);
                                }}
                                className={`p-1 rounded-full transition-colors ${
                                  day.complete 
                                    ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30' 
                                    : 'text-muted-foreground hover:bg-muted'
                                }`}
                                aria-label={day.complete ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                {day.complete ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                            <div className="space-y-3 flex-grow">
                              <MealItem 
                                time="Breakfast" 
                                meal={day.meals.breakfast} 
                                isActive={day.day === programData.currentDay}
                              />
                              <MealItem 
                                time="Lunch" 
                                meal={day.meals.lunch} 
                                isActive={day.day === programData.currentDay}
                              />
                              <MealItem 
                                time="Dinner" 
                                meal={day.meals.dinner} 
                                isActive={day.day === programData.currentDay}
                              />
                            </div>
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-accent/20 transition-all duration-200 pointer-events-none"></div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
                    <div className="p-2 rounded-md bg-accent/10">
                      {resource.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{resource.title}</CardTitle>
                      <CardDescription>{resource.type}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Nutrition Progress</CardTitle>
                <CardDescription>
                  Track your clean eating journey and see your progress over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Progress charts coming soon</p>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium">Days Completed</h4>
                    <p className="text-2xl font-bold mt-2">10/28</p>
                    <p className="text-xs text-muted-foreground mt-1">35% of program</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium">Meals Logged</h4>
                    <p className="text-2xl font-bold mt-2">24/84</p>
                    <p className="text-xs text-muted-foreground mt-1">28% of meals</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium">Current Streak</h4>
                    <p className="text-2xl font-bold mt-2">5 days</p>
                    <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
