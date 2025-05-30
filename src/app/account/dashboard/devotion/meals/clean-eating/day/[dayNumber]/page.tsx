'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Check, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Droplets, 
  Moon, 
  Plus, 
  Minus,
  Share2, 
  Sun, 
  Sunrise, 
  Utensils, 
  ShoppingBag, 
  Heart, 
  Bookmark, 
  Clock as ClockIcon, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Carrot, 
  Apple, 
  Beef, 
  Zap,
  ArrowRight 
} from 'lucide-react';

// UI Components
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`font-bold text-2xl bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }: any) => (
  <p className={`text-muted-foreground text-sm ${className}`} {...props}>
    {children}
  </p>
);

// Nutrition Badge Component
const NutritionBadge = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
  <div className="flex flex-col items-center p-3 bg-muted/20 rounded-lg">
    <Icon className="w-5 h-5 text-accent mb-1" />
    <span className="font-medium text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

// Meal Section Component
const MealSection = ({ 
  time, 
  meal, 
  isActive,
  icon: Icon = Utensils,
  image = "https://placehold.co/600x400/eeeeee/cccccc?text=Meal+Image",
  instructions = ["No instructions provided"],
  prepTime = 15,
  cookTime = 30,
  nutrition = { calories: 320, protein: '24g', carbs: '45g', fat: '12g' }
}: { 
  time: string; 
  meal: string; 
  isActive?: boolean;
  icon?: any;
  image?: string;
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}) => {
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  return (
    <motion.div 
      className="mb-6 bg-muted/5 rounded-xl overflow-hidden border border-border/50"
      initial={false}
      animate={{ 
        borderColor: expanded ? 'hsl(var(--border))' : 'hsl(var(--border)/0.5)',
      }}
    >
      <button 
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-accent/10 mr-3">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{time}</h3>
            <p className="text-sm text-muted-foreground">{expanded ? 'Tap to collapse' : 'Tap to view meal details'}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              {/* Meal Image */}
              <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                <img 
                  src={image} 
                  alt={meal} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Meal+Image';
                  }}
                />
              </div>
              
              <div className="bg-background border rounded-lg p-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{meal}</h3>
                
                {/* Recipe Details */}
                <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Prep: {prepTime} min</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Cook: {cookTime} min</span>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-2">Instructions</h4>
                  <ol className="space-y-2 text-sm">
                    {instructions.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="font-bold text-accent mr-2">{index + 1}.</span>
                        <span className="text-foreground/90">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                {/* Recipe Actions */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      className={`p-2 rounded-full hover:bg-muted/50 transition-colors ${saved ? 'text-red-500' : 'text-muted-foreground'}`}
                      onClick={() => setSaved(!saved)}
                    >
                      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      className={`p-2 rounded-full hover:bg-muted/50 transition-colors ${bookmarked ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      onClick={() => setBookmarked(!bookmarked)}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Link 
                    href={`/account/dashboard/devotion/meals/clean-eating/recipe/avocado-toast`}
                    className="text-sm text-accent hover:underline flex items-center"
                  >
                    Full recipe <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              {/* Nutrition Info */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <NutritionBadge icon={Flame} value={`${nutrition.calories}`} label="Cal" />
                <NutritionBadge icon={Carrot} value={nutrition.protein} label="Protein" />
                <NutritionBadge icon={Apple} value={nutrition.carbs} label="Carbs" />
                <NutritionBadge icon={Droplets} value={nutrition.fat} label="Fat" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Mock data - in a real app, you'd fetch this based on the day number
const getDayData = (weekNumber: number, dayNumber: number) => {
  // This is a simplified version - you'd want to fetch the actual data
  // based on the week and day numbers from your data source
  const week = mealPlanWeeks.find((w: Week) => w.weekNumber === weekNumber);
  if (!week) return null;
  
  const day = week.days.find((d: Day) => d.day === dayNumber);
  if (!day) return null;
  
  return {
    ...day,
    weekTheme: week.theme
  };
};

// Define types to match the main page
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

// Mock data - this should match your main page's data structure
const mealPlanWeeks: Week[] = [
  // Week 1
  {
    weekNumber: 1,
    theme: 'Pantry Reset',
    complete: true,
    days: [
      {
        day: 1,
        meals: {
          breakfast: 'Oatmeal with berries and nuts',
          lunch: 'Quinoa salad with mixed vegetables',
          dinner: 'Grilled chicken with steamed broccoli'
        },
        complete: true,
        notes: 'Prep overnight oats for tomorrow'
      },
      // Add more days as needed
    ]
  },
  // Add more weeks as needed
];

// Shopping List Item Component
const ShoppingListItem = ({ name, amount, category, checked = false }: { name: string, amount: string, category: string, checked?: boolean }) => {
  const [isChecked, setIsChecked] = useState(checked);
  
  return (
    <div className="flex items-center p-3 hover:bg-muted/30 rounded-lg transition-colors">
      <button 
        onClick={() => setIsChecked(!isChecked)}
        className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 flex items-center justify-center ${
          isChecked ? 'bg-accent border-accent' : 'border-muted-foreground/30'
        }`}
      >
        {isChecked && <Check className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm truncate ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {name}
        </p>
        <div className="flex items-center mt-0.5">
          <span className="text-xs text-muted-foreground mr-2">{amount}</span>
          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{category}</span>
        </div>
      </div>
      <button className="p-1 text-muted-foreground hover:text-foreground">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

// Progress Ring Component
const ProgressRing = ({ value, size = 120, strokeWidth = 8 }: { value: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-accent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground">Daily Goal</span>
      </div>
    </div>
  );
};

export default function DayPlanPage({ params }: { params: { dayNumber: string } }) {
  const [isComplete, setIsComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('meals');
  const dayNumber = parseInt(params.dayNumber, 10);
  const weekNumber = Math.ceil(dayNumber / 7);
  const dayData = getDayData(weekNumber, dayNumber);

  if (!dayData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Day Not Found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We couldn't find the meal plan for this day. It might have been moved or doesn't exist.
            </p>
            <Link 
              href="/account/dashboard/devotion/meals/clean-eating" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              Back to Meal Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock shopping list data
  const shoppingList = [
    { id: 1, name: 'Chicken breast', amount: '2 lbs', category: 'Meat' },
    { id: 2, name: 'Quinoa', amount: '1 cup', category: 'Grains' },
    { id: 3, name: 'Mixed vegetables', amount: '3 cups', category: 'Produce' },
    { id: 4, name: 'Olive oil', amount: '2 tbsp', category: 'Pantry' },
  ];

  // Nutrition data
  const nutritionData = {
    calories: { current: 1850, goal: 2200 },
    protein: { current: 120, goal: 150 },
    carbs: { current: 180, goal: 250 },
    fat: { current: 55, goal: 70 },
  };

  const progress = Math.round((nutritionData.calories.current / nutritionData.calories.goal) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 border-b border-border/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Link 
                href="/account/dashboard/devotion/meals/clean-eating" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
                Back to meal plan
              </Link>
              
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                  Week {weekNumber}
                </span>
                <span className="text-sm text-muted-foreground">
                  {dayData.weekTheme}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Day {dayNumber}
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <button 
              onClick={() => setIsComplete(!isComplete)}
              className={`mt-4 md:mt-0 inline-flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                isComplete 
                  ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' 
                  : 'bg-accent hover:bg-accent/90 text-white'
              }`}
            >
              {isComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span>Day Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 mr-2" />
                  <span>Mark as Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted/30 rounded-xl max-w-xl mx-auto">
          {[
            { id: 'meals', label: 'Meals' },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'shopping', label: 'Shopping List' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'meals' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Meals</CardTitle>
                      <CardDescription>Your nutrition plan for the day</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Total: ~45 min prep time</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <MealSection 
                      time="Breakfast" 
                      meal={dayData.meals.breakfast} 
                      isActive={true}
                      icon={Sunrise}
                    />
                    <MealSection 
                      time="Lunch" 
                      meal={dayData.meals.lunch} 
                      isActive={true}
                      icon={Sun}
                    />
                    <MealSection 
                      time="Dinner" 
                      meal={dayData.meals.dinner} 
                      isActive={true}
                      icon={Moon}
                    />
                  </div>
                  
                  {dayData.notes && (
                    <motion.div 
                      className="mt-8 p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent mr-3 mt-0.5">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">Chef's Notes</h3>
                          <p className="text-muted-foreground">{dayData.notes}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Daily Nutrition</CardTitle>
                  <CardDescription>Your complete nutritional breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6">
                    <ProgressRing value={progress} />
                    <p className="mt-6 text-sm text-muted-foreground">
                      {nutritionData.calories.current} of {nutritionData.calories.goal} calories
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Protein</span>
                        <span className="text-sm font-medium">{nutritionData.protein.current}g</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (nutritionData.protein.current / nutritionData.protein.goal) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((nutritionData.protein.current / nutritionData.protein.goal) * 100)}% of daily goal
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Carbs</span>
                        <span className="text-sm font-medium">{nutritionData.carbs.current}g</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (nutritionData.carbs.current / nutritionData.carbs.goal) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((nutritionData.carbs.current / nutritionData.carbs.goal) * 100)}% of daily goal
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Fat</span>
                        <span className="text-sm font-medium">{nutritionData.fat.current}g</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (nutritionData.fat.current / nutritionData.fat.goal) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((nutritionData.fat.current / nutritionData.fat.goal) * 100)}% of daily goal
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Fiber</span>
                        <span className="text-sm font-medium">24g</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: '80%' }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        80% of daily goal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Water Intake</CardTitle>
                    <CardDescription>Stay hydrated throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center py-4">
                      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                        <div className="absolute w-full h-full rounded-full bg-muted/30 flex items-center justify-center">
                          <Droplets className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="text-center z-10">
                          <span className="text-3xl font-bold">5</span>
                          <span className="text-muted-foreground">/8</span>
                          <p className="text-sm text-muted-foreground">glasses</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <button 
                            key={i}
                            className={`h-2 rounded-full ${
                              i <= 5 ? 'bg-blue-500' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Meal Timing</CardTitle>
                    <CardDescription>Your eating schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 py-2">
                      {[
                        { time: '8:00 AM', meal: 'Breakfast', completed: true },
                        { time: '12:30 PM', meal: 'Lunch', completed: true },
                        { time: '3:00 PM', meal: 'Snack', completed: false },
                        { time: '7:00 PM', meal: 'Dinner', completed: false },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">
                            {item.time}
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${
                                item.completed ? 'bg-green-500' : 'bg-muted-foreground/30'
                              }`} />
                              <span className={`text-sm ${
                                item.completed ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {item.meal}
                              </span>
                            </div>
                          </div>
                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Shopping List</CardTitle>
                      <CardDescription>Ingredients needed for today's meals</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border/50">
                    {shoppingList.map((item) => (
                      <ShoppingListItem 
                        key={item.id}
                        name={item.name}
                        amount={item.amount}
                        category={item.category}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <h3 className="font-medium mb-3">Recently Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Almond milk', 'Honey', 'Chia seeds', 'Cinnamon'].map((item, i) => (
                        <button 
                          key={i}
                          className="px-3 py-1.5 text-sm bg-muted/50 hover:bg-muted rounded-full transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
