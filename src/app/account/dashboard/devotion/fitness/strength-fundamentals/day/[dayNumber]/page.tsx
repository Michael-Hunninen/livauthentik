'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Dumbbell, 
  Play, 
  Share2, 
  Bookmark, 
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// UI Components
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`border rounded-xl overflow-hidden ${className}`} {...props}>{children}</div>
);

const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
);

const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
);

const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`text-xl font-bold text-foreground ${className}`} {...props}>{children}</h3>
);

const CardDescription = ({ children, className = '', ...props }: any) => (
  <p className={`text-muted-foreground ${className}`} {...props}>{children}</p>
);

// Workout Section Component
const WorkoutSection = ({ 
  title, 
  exercises, 
  time, 
  isActive,
  dayNumber,
  icon: Icon = Dumbbell
}: { 
  title: string; 
  exercises: { name: string; sets: string; reps: string; rest: string; }[];
  time: string;
  isActive?: boolean;
  dayNumber: number;
  icon?: any;
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
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {expanded ? 'Tap to collapse' : 'Tap to view workout details'}
            </p>
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
              <div className="bg-background border rounded-lg p-4">
                <h3 className="text-lg font-bold text-foreground mb-4">Workout Details</h3>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Time: {time}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-3">Exercises</h4>
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="border-b border-border/30 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-foreground">{exercise.name}</h5>
                            <div className="flex space-x-4 mt-1 text-sm text-muted-foreground">
                              <span>Sets: {exercise.sets}</span>
                              <span>Reps: {exercise.reps}</span>
                              <span>Rest: {exercise.rest}</span>
                            </div>
                          </div>
                          <button className="p-2 rounded-full hover:bg-muted/50">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
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
                    <button className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Link 
                    href={`/account/dashboard/devotion/fitness/strength-fundamentals/workout/${dayNumber}`}
                    className="text-sm bg-accent text-white hover:bg-accent/90 px-3 py-1.5 rounded-md flex items-center transition-colors"
                  >
                    Start Workout <Play className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Mock data - in a real app, this would come from an API or database
const getDayData = (weekNumber: number, dayNumber: number) => {
  // This is just sample data - in a real app, you'd fetch this based on the day number
  return {
    day: dayNumber,
    week: weekNumber,
    weekTheme: 'Foundations',
    workouts: {
      strength: 'Full Body Strength',
      mobility: 'Recovery & Mobility'
    },
    complete: false,
    notes: 'Focus on form today. Keep rest periods to 60 seconds between sets.'
  };
};

// Mock exercise data
const workoutData = {
  strength: {
    title: 'Full Body Strength',
    time: '45-60 min',
    exercises: [
      { name: 'Goblet Squat', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Push-up', sets: '3', reps: '8-12', rest: '60s' },
      { name: 'Romanian Deadlift', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Seated Row', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Plank', sets: '3', reps: '30-45s', rest: '30s' }
    ]
  },
  mobility: {
    title: 'Recovery & Mobility',
    time: '20-30 min',
    exercises: [
      { name: 'Foam Rolling', sets: '1', reps: '2 min', rest: '0s' },
      { name: 'Hip Flexor Stretch', sets: '2', reps: '30s/side', rest: '0s' },
      { name: 'Thoracic Extension', sets: '2', reps: '30s', rest: '0s' },
      { name: 'Child\'s Pose', sets: '1', reps: '1 min', rest: '0s' }
    ]
  }
};

export default function DayPlanPage({ params }: { params: { dayNumber: string } }) {
  const [isComplete, setIsComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');
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
              We couldn't find the workout plan for this day. It might have been moved or doesn't exist.
            </p>
            <Link 
              href="/account/dashboard/devotion/fitness/strength-fundamentals" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              Back to Workout Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 border-b border-border/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Link 
                href="/account/dashboard/devotion/fitness/strength-fundamentals" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
                Back to workout plan
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
                  <span>Workout Completed</span>
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
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted/30 rounded-xl max-w-xl mx-auto">
          {[
            { id: 'workouts', label: 'Workouts' },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'progress', label: 'Progress' }
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
          {activeTab === 'workouts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Workouts</CardTitle>
                      <CardDescription>Your training plan for the day</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Total: ~75 min</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <WorkoutSection 
                      title={workoutData.strength.title}
                      exercises={workoutData.strength.exercises}
                      time={workoutData.strength.time}
                      isActive={true}
                      dayNumber={dayNumber}
                      icon={Dumbbell}
                    />
                    
                    <WorkoutSection 
                      title={workoutData.mobility.title}
                      exercises={workoutData.mobility.exercises}
                      time={workoutData.mobility.time}
                      isActive={true}
                      dayNumber={dayNumber}
                      icon={Play}
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
                          <Bookmark className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">Coach's Notes</h3>
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
              className="text-center py-12"
            >
              <h3 className="text-xl font-medium text-foreground mb-2">Nutrition Plan</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Nutrition tracking and meal planning will be available soon. Check back for updates!
              </p>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <h3 className="text-xl font-medium text-foreground mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Track your strength and fitness progress here. Coming soon!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
