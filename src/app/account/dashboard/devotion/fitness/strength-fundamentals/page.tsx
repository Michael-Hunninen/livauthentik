'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Dumbbell, 
  Play, 
  Award,
  TrendingUp,
  FileText,
  BarChart,
  BookOpen
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
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

const TabsContent = ({ children, value }: any) => (
  <div data-value={value}>{children}</div>
);

// Set display names for components
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

// Types
type WorkoutDay = {
  day: number;
  workouts: {
    strength: string;
    mobility: string;
  };
  complete: boolean;
  notes?: string;
};

type Week = {
  weekNumber: number;
  theme: string;
  complete: boolean;
  days: WorkoutDay[];
};

// Types for program data
type ProgramData = {
  title: string;
  description: string;
  duration: string;
  level: string;
  daysPerWeek: number;
  timePerWorkout: string;
  progress: number;
  currentWeek: number;
  nextWorkout: string;
  nextWorkoutType: string;
  currentDay: number;
  overview: string[];
  equipmentNeeded: string[];
  weeks: Week[];
};

// Exercise Component for the daily view
const WorkoutItem = ({ title, sets, reps, isActive }: { title: string; sets?: number; reps?: string; isActive?: boolean }) => {
  return (
    <div className={`flex items-start p-3 rounded-md ${isActive ? 'bg-accent/5' : 'bg-muted/5'}`}>
      <div className="flex-grow">
        <p className={`font-medium ${isActive ? 'text-accent' : 'text-foreground'}`}>{title}</p>
        {sets && reps && (
          <p className="text-xs text-muted-foreground mt-1">{sets} sets × {reps}</p>
        )}
      </div>
      <Dumbbell className={`h-4 w-4 mt-1 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
    </div>
  );
};

// Mock data for Strength Fundamentals program
const programData: ProgramData = {
  title: 'Strength Fundamentals',
  description: 'Build a solid foundation of strength with this 8-week program focusing on proper form and progressive overload.',
  duration: '8 weeks',
  level: 'Beginner to Intermediate',
  daysPerWeek: 4,
  timePerWorkout: '45-60 minutes',
  progress: 37,
  currentWeek: 3,
  nextWorkout: 'Day 3',
  nextWorkoutType: 'Lower Body Strength',
  currentDay: 17,
  overview: [
    '8-week progressive strength program',
    '3-4 workouts per week',
    'Focus on compound movements',
    'Includes mobility and recovery'
  ],
  equipmentNeeded: [
    'Dumbbells or barbell',
    'Resistance bands',
    'Yoga mat',
    'Bench or stable surface',
    'Pull-up bar (or alternative)'
  ],
  weeks: [
    // Week 1
    {
      weekNumber: 1,
      theme: 'Foundations',
      complete: true,
      days: [
        { day: 1, workouts: { strength: 'Full Body A', mobility: 'Recovery' }, complete: true },
        { day: 2, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 3, workouts: { strength: 'Full Body B', mobility: 'Recovery' }, complete: true },
        { day: 4, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 5, workouts: { strength: 'Full Body C', mobility: 'Recovery' }, complete: true },
        { day: 6, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 7, workouts: { strength: 'Rest', mobility: 'Rest' }, complete: true },
      ]
    },
    // Week 2
    {
      weekNumber: 2,
      theme: 'Building Habits',
      complete: true,
      days: [
        { day: 8, workouts: { strength: 'Full Body A', mobility: 'Recovery' }, complete: true },
        { day: 9, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 10, workouts: { strength: 'Full Body B', mobility: 'Recovery' }, complete: true },
        { day: 11, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 12, workouts: { strength: 'Full Body C', mobility: 'Recovery' }, complete: true },
        { day: 13, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 14, workouts: { strength: 'Rest', mobility: 'Rest' }, complete: true },
      ]
    },
    // Week 3 (current week)
    {
      weekNumber: 3,
      theme: 'Progressive Overload',
      complete: false,
      days: [
        { day: 15, workouts: { strength: 'Full Body A', mobility: 'Recovery' }, complete: true },
        { day: 16, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: true },
        { day: 17, workouts: { strength: 'Full Body B', mobility: 'Recovery' }, complete: false },
        { day: 18, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: false },
        { day: 19, workouts: { strength: 'Full Body C', mobility: 'Recovery' }, complete: false },
        { day: 20, workouts: { strength: 'Rest', mobility: 'Active Recovery' }, complete: false },
        { day: 21, workouts: { strength: 'Rest', mobility: 'Rest' }, complete: false },
      ]
    },
    // Week 4
    {
      weekNumber: 4,
      theme: 'Strength Building',
      complete: false,
      days: Array(7).fill(0).map((_, i) => ({
        day: 22 + i,
        workouts: { strength: 'Varies', mobility: 'Varies' },
        complete: false
      }))
    },
    // Weeks 5-8
    ...[5, 6, 7, 8].map(weekNum => ({
      weekNumber: weekNum,
      theme: ['Advanced Techniques', 'Peak Performance', 'Max Strength', 'Final Assessment'][weekNum - 5],
      complete: false,
      days: Array(7).fill(0).map((_, i) => ({
        day: (weekNum - 1) * 7 + 1 + i,
        workouts: { strength: 'Varies', mobility: 'Varies' },
        complete: false
      }))
    }))
  ]
};

// Mock resources for the resources tab
const resources = [
  { 
    title: 'Proper Form Guide', 
    type: 'Video', 
    icon: <Play className="w-5 h-5 text-accent" />,
    description: 'Learn the correct form for all major lifts',
    url: '#'
  },
  { 
    title: 'Warm-up Routine', 
    type: 'Video', 
    icon: <Play className="w-5 h-5 text-accent" />,
    description: '5-minute dynamic warm-up to prevent injuries',
    url: '#'
  },
  { 
    title: 'Nutrition for Strength', 
    type: 'Article', 
    icon: <FileText className="w-5 h-5 text-accent" />,
    description: 'How to fuel your body for optimal performance',
    url: '#'
  },
  { 
    title: 'Recovery Techniques', 
    type: 'Guide', 
    icon: <BookOpen className="w-5 h-5 text-accent" />,
    description: 'Maximize recovery between workouts',
    url: '#'
  },
  { 
    title: 'Progress Tracking', 
    type: 'Tool', 
    icon: <BarChart className="w-5 h-5 text-accent" />,
    description: 'Track your progress and set new goals',
    url: '#'
  }
];

export default function StrengthFundamentals() {
  const [activeTab, setActiveTab] = useState('program');
  const [selectedWeek, setSelectedWeek] = useState(programData.currentWeek);
  
  const currentWeekData = programData.weeks.find(week => week.weekNumber === programData.currentWeek);
  const todayWorkout = currentWeekData?.days.find(day => day.day === programData.currentDay);

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
              <span className="ml-2 text-sm text-muted-foreground">{programData.weeks.length} weeks</span>
            </div>
          </div>

          <Link href={`/account/dashboard/devotion/fitness/strength-fundamentals/day/${programData.currentDay}`}>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Today's Workout
            </Button>
          </Link>
        </div>

        <Card className="mb-6 bg-gradient-to-br from-background to-muted/20 backdrop-blur border-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Week {programData.currentWeek} of {programData.weeks.length}</span>
                <span>{programData.progress}% complete</span>
              </div>
              <Progress value={programData.progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Currently on: <span className="font-medium">Week {programData.currentWeek}, Day {programData.currentDay}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main Content */}
      <div className="space-y-6">
        <Tabs defaultValue="program" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="program">Workout Program</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="program">
            <div className="space-y-6">
              {/* Enhanced Week Selector */}
              <div className="relative">
                <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 px-4">
                  {Array.from({ length: programData.weeks.length }, (_, i) => i + 1).map((weekNum) => {
                    const weekData = programData.weeks.find(w => w.weekNumber === weekNum);
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
                          {weekData && (
                            <div className="text-xs mt-1 font-normal opacity-90">{weekData.theme}</div>
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
                            Week {selectedWeek}: {programData.weeks.find(w => w.weekNumber === selectedWeek)?.theme}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedWeek === programData.currentWeek 
                              ? 'Your current week • In progress' 
                              : selectedWeek < programData.currentWeek 
                                ? `Completed • ${programData.weeks.find(w => w.weekNumber === selectedWeek)?.days.filter(d => d.complete).length}/7 days`
                                : 'Upcoming'}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="border-accent/30 text-accent hover:bg-accent/5 hover:border-accent/50 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Workout Guide
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {programData.weeks.find(w => w.weekNumber === selectedWeek)?.days.map((day) => (
                          <Link 
                            key={day.day}
                            href={`/account/dashboard/devotion/fitness/strength-fundamentals/day/${day.day}`}
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
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Toggle day completion (could be implemented)
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
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium">Strength:</span>
                                <span className="text-xs bg-accent/10 px-2 py-0.5 rounded-full text-accent">
                                  {day.workouts.strength === 'Rest' ? 'Rest Day' : '45 min'}
                                </span>
                              </div>
                              <div className="p-2 rounded-md bg-background border">
                                <p className="text-sm">{day.workouts.strength}</p>
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-xs font-medium">Mobility:</span>
                                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full text-blue-600 dark:text-blue-400">
                                  {day.workouts.mobility === 'Rest' ? 'Rest Day' : '15 min'}
                                </span>
                              </div>
                              <div className="p-2 rounded-md bg-background border">
                                <p className="text-sm">{day.workouts.mobility}</p>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t text-right">
                              <span className="text-xs text-accent font-medium inline-flex items-center">
                                View Details
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
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
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Program Resources</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource, index) => (
                  <Link key={index} href={resource.url} className="block h-full">
                    <Card className="h-full hover:shadow-md transition-shadow border-muted hover:border-accent/30">
                      <CardHeader>
                        <div className="flex items-start">
                          <div className="mr-4 p-2 bg-accent/10 rounded-lg">
                            {resource.icon}
                          </div>
                          <div>
                            <CardTitle>{resource.title}</CardTitle>
                            <span className="inline-block mt-1 text-xs font-medium bg-background px-2 py-1 rounded-full border">
                              {resource.type}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </CardContent>
                      <CardFooter>
                        <span className="text-xs text-accent font-medium inline-flex items-center ml-auto">
                          Access Resource
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Your Progress</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Program Completion</CardTitle>
                  <CardDescription>Track your progress through the 8-week program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{programData.progress}%</span>
                      </div>
                      <Progress value={programData.progress} className="h-2" />
                    </div>
                    
                    <div className="grid gap-4 mt-6 sm:grid-cols-2">
                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Workout Consistency</h3>
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center mr-4">
                            <span className="text-xl font-bold">86%</span>
                          </div>
                          <div className="text-sm">
                            <p>You've completed 19 of 22 scheduled workouts</p>
                            <p className="text-muted-foreground">Great consistency!</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Current Streak</h3>
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mr-4">
                            <span className="text-xl font-bold">5</span>
                          </div>
                          <div className="text-sm">
                            <p>You're on a 5 day streak!</p>
                            <p className="text-muted-foreground">Keep it going!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="rewards">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Your Rewards</h2>
                  <p className="text-muted-foreground">Earn rewards by completing workouts and reaching milestones</p>
                </div>
                <div className="bg-accent/10 px-4 py-2 rounded-full text-sm font-medium text-accent">
                  🏆 2,450 Points
                </div>
              </div>
              
              {/* Reward Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1.5 text-sm font-medium rounded-full bg-accent text-white">All Rewards</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-full bg-muted hover:bg-muted/80 transition-colors">Achievements</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-full bg-muted hover:bg-muted/80 transition-colors">Milestones</button>
                <button className="px-3 py-1.5 text-sm font-medium rounded-full bg-muted hover:bg-muted/80 transition-colors">Exclusive</button>
              </div>
              
              {/* Rewards Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Bronze Badge */}
                <div className="relative group overflow-hidden rounded-2xl border border-muted/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-amber-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-800 flex items-center justify-center text-white text-2xl font-bold">
                        🥉
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Bronze
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Bronze Badge</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete your first 5 workouts</p>
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Earned 2 days ago</span>
                      <span className="flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-yellow-500" />
                        50 XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Silver Badge */}
                <div className="relative group overflow-hidden rounded-2xl border border-muted/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/5 to-gray-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold">
                        🥈
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Silver
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Silver Badge</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete 15 workouts</p>
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>9/15 workouts</span>
                      <span className="flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        100 XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Gold Badge */}
                <div className="relative group overflow-hidden rounded-2xl border border-muted/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold">
                        🥇
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Gold
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Gold Badge</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete 30 workouts</p>
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>9/30 workouts</span>
                      <span className="flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-yellow-500" />
                        250 XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 7-Day Streak */}
                <div className="relative group overflow-hidden rounded-2xl border border-muted/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                        🔥
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        Streak
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">7-Day Streak</h3>
                    <p className="text-sm text-muted-foreground mb-4">Work out 7 days in a row</p>
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>5/7 days</span>
                      <span className="flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-purple-500" />
                        75 XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Early Bird */}
                <div className="relative group overflow-hidden rounded-2xl border border-muted/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                        🌅
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Morning
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Early Bird</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete a workout before 8 AM</p>
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Not started</span>
                      <span className="flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-blue-500" />
                        50 XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Weekend Warrior */}
                <div className="relative group overflow-hidden rounded-2xl border border-muted/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                        💪
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Weekend
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Weekend Warrior</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete a workout on both weekend days</p>
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>1/2 days</span>
                      <span className="flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-green-500" />
                        100 XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Completed Rewards</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="border rounded-xl p-4 bg-muted/10 opacity-75">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-yellow-600/10 flex items-center justify-center text-yellow-600 text-xl mr-3">
                        🎯
                      </div>
                      <div>
                        <h4 className="font-medium">First Workout</h4>
                        <p className="text-xs text-muted-foreground">Completed 2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 bg-muted/10 opacity-75">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 text-xl mr-3">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-medium">Quick Start</h4>
                        <p className="text-xs text-muted-foreground">Completed 1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
