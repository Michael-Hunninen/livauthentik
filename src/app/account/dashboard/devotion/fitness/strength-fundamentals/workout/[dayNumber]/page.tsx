'use client';

import { useState, useEffect, useRef } from 'react';
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
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw
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

// Sound effects
const playSound = (sound: 'start' | 'complete' | 'rest' | 'next') => {
  if (typeof window !== 'undefined') {
    const audio = new Audio();
    audio.volume = 0.5;
    
    switch(sound) {
      case 'start':
        audio.src = '/sounds/start.wav';
        break;
      case 'complete':
        audio.src = '/sounds/complete.wav';
        break;
      case 'rest':
        audio.src = '/sounds/rest.wav';
        break;
      case 'next':
        audio.src = '/sounds/next.wav';
        break;
    }
    
    audio.play().catch(e => console.log('Audio playback failed:', e));
  }
};

// Haptic feedback
const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (navigator.vibrate) {
    const patterns = {
      light: [50],
      medium: [100],
      heavy: [100, 50, 100]
    };
    navigator.vibrate(patterns[type]);
  }
};

// Format seconds to MM:SS
type ExerciseStatus = 'preparing' | 'working' | 'resting' | 'completed';

// Types for workout settings
interface WorkoutSettings {
  // Sound
  soundEnabled: boolean;
  soundVolume: number;
  // Haptics
  hapticsEnabled: boolean;
  // Timer durations (in seconds)
  prepTime: number;
  workTime: number;
  restTime: number;
  // Auto-progression
  autoProgression: boolean;
  autoProgressionDelay: number; // in seconds
  // UI
  darkMode: boolean;
  showExerciseImages: boolean;
  // Voice guidance
  voiceGuidance: boolean;
  voiceGuidanceVolume: number;
  // Countdown
  countdownEnabled: boolean;
  countdownBeep: boolean;
}

// Default settings
const DEFAULT_SETTINGS: WorkoutSettings = {
  soundEnabled: true,
  soundVolume: 70,
  hapticsEnabled: true,
  prepTime: 10,
  workTime: 45,
  restTime: 30,
  autoProgression: true,
  autoProgressionDelay: 2,
  darkMode: false,
  showExerciseImages: true,
  voiceGuidance: true,
  voiceGuidanceVolume: 70,
  countdownEnabled: true,
  countdownBeep: true
};

// Load settings from localStorage or use defaults
const loadSettings = (): WorkoutSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const savedSettings = localStorage.getItem('workoutSettings');
    if (savedSettings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  
  return DEFAULT_SETTINGS;
};

// Save settings to localStorage
const saveSettings = (settings: WorkoutSettings) => {
  try {
    localStorage.setItem('workoutSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

interface ExerciseState {
  status: ExerciseStatus;
  currentSet: number;
  timeRemaining: number;
  isPaused: boolean;
}

const ExerciseCard = ({ 
  name, 
  sets: totalSets, 
  reps, 
  rest, 
  isActive, 
  isCompleted, 
  onComplete,
  onNextExercise,
  onPrevExercise,
  onExerciseComplete
}: { 
  name: string; 
  sets: string; 
  reps: string; 
  rest: string; 
  isActive: boolean; 
  isCompleted: boolean;
  onComplete: () => void;
  onNextExercise: () => void;
  onPrevExercise: () => void;
  onExerciseComplete: () => void;
}) => {
  const [state, setState] = useState<ExerciseState>({
    status: 'preparing',
    currentSet: 1,
    timeRemaining: 5, // 5s preparation time
    isPaused: false
  });
  
  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();
  const totalSetsNum = parseInt(totalSets, 10);
  const restTime = parseInt(rest, 10) || 60; // Default to 60s if not specified
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle timer logic
  useEffect(() => {
    if (!isActive || state.isPaused) return;
    
    if (state.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else {
      // Time's up, handle state transition
      if (state.status === 'preparing') {
        // Start working set
        playSound('start');
        hapticFeedback('medium');
        setState(prev => ({
          ...prev,
          status: 'working',
          timeRemaining: 90 // 1m30s for work set
        }));
      } else if (state.status === 'working' && state.currentSet < totalSetsNum) {
        // Start rest period
        playSound('rest');
        hapticFeedback('light');
        setState(prev => ({
          ...prev,
          status: 'resting',
          timeRemaining: restTime
        }));
      } else if (state.status === 'resting' || 
                (state.status === 'working' && state.currentSet >= totalSetsNum)) {
        // Move to next set or complete exercise
        if (state.currentSet >= totalSetsNum) {
          // Exercise complete
          playSound('complete');
          hapticFeedback('heavy');
          onExerciseComplete();
          return;
        } else {
          // Next set
          playSound('next');
          hapticFeedback('light');
          setState(prev => ({
            status: 'working',
            currentSet: prev.currentSet + 1,
            timeRemaining: 90, // 1m30s for work set
            isPaused: false
          }));
        }
      }
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.timeRemaining, state.status, state.currentSet, isActive, state.isPaused, totalSetsNum, restTime]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = undefined;
      }
    };
  }, []);
  
  const handlePauseResume = () => {
    setState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };
  
  const getStatusText = () => {
    switch(state.status) {
      case 'preparing':
        return 'Get Ready';
      case 'working':
        return `Set ${state.currentSet} of ${totalSets}`;
      case 'resting':
        return `Rest After Set ${state.currentSet}`;
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };
  
  const getProgressPercentage = () => {
    if (state.status === 'preparing') return 0;
    if (state.status === 'completed') return 100;
    
    const totalTime = state.status === 'working' ? 90 : restTime;
    return ((totalTime - state.timeRemaining) / totalTime) * 100;
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${isActive ? 'border-accent/50 bg-accent/5' : 'border-border/30'} ${state.status === 'completed' ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`font-medium ${isActive ? 'text-accent' : 'text-foreground'}`}>
            {name}
          </h4>
          <div className="flex space-x-4 mt-1 text-sm text-muted-foreground">
            <span>Sets: {totalSets}</span>
            <span>Reps: {reps}</span>
            <span>Rest: {rest}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onComplete}
            className={`p-2 rounded-full ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-muted/50 text-muted-foreground'}`}
          >
            {isCompleted ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {isActive && (
        <div className="mt-3 pt-3 border-t border-border/20">
          <div className="text-center mb-3">
            <div className="text-lg font-medium text-foreground">
              {getStatusText()}
            </div>
            <div className="text-3xl font-bold my-2">
              {formatTime(state.timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground">
              {state.status === 'working' ? 'Work' : state.status === 'resting' ? 'Rest' : 'Get Ready'}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-3">
            <button 
              onClick={onPrevExercise}
              className="p-2 rounded-full hover:bg-muted/50 disabled:opacity-30"
              disabled={state.currentSet === 1 && state.status === 'preparing'}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handlePauseResume}
              className="p-4 rounded-full bg-accent text-white hover:bg-accent/90 flex items-center justify-center w-14 h-14"
            >
              {state.isPaused ? <Play className="w-6 h-6 ml-0.5" /> : <Pause className="w-6 h-6" />}
            </button>
            
            <button 
              onClick={onNextExercise}
              className="p-2 rounded-full hover:bg-muted/50"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-1000 ease-linear"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Mock data - in a real app, this would come from an API or database
const getWorkoutData = (dayNumber: number) => {
  // This is just sample data - in a real app, you'd fetch this based on the day number
  const allWorkouts = [
    // Day 1
    {
      day: 1,
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
    // Add more days as needed
  ];

  // Default to day 1 if day number is out of range
  return allWorkouts[dayNumber - 1] || allWorkouts[0];
};

export default function WorkoutPage({ params }: { params: { dayNumber: string } }) {
  const dayNumber = parseInt(params.dayNumber, 10);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<WorkoutSettings>(loadSettings());
  const [tempSettings, setTempSettings] = useState<WorkoutSettings>(settings);
  const [exerciseStatus, setExerciseStatus] = useState<Record<number, boolean>>({});
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedTimerRef = useRef<NodeJS.Timeout>();
  
  const workout = getWorkoutData(dayNumber);
  
  // Apply settings when they change
  useEffect(() => {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save settings when they change
    saveSettings(settings);
  }, [settings]);

  // Start/stop elapsed time counter when exercise starts/ends
  useEffect(() => {
    if (currentExercise < workout.exercises.length && !workoutComplete) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
    }
    
    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [currentExercise, workoutComplete]);
  
  const handleExerciseComplete = (index: number) => {
    setExerciseStatus(prev => ({
      ...prev,
      [index]: true
    }));
    
    // Move to next exercise after a short delay
    setTimeout(() => {
      if (currentExercise < workout.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
      } else {
        // Last exercise completed
        setWorkoutComplete(true);
        setShowCompleteModal(true);
      }
    }, 1500); // Short delay before moving to next exercise
  };
  
  const handleNextExercise = () => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };
  
  const handlePrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleCompleteExercise = (index: number) => {
    if (completedExercises.includes(index)) {
      setCompletedExercises(completedExercises.filter(i => i !== index));
    } else {
      setCompletedExercises([...completedExercises, index]);
    }
  };

  const progress = (currentExercise / (workout.exercises.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-accent/5 to-accent/10 border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/account/dashboard/devotion/fitness/strength-fundamentals/day/${dayNumber}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
              Back to Day {dayNumber}
            </Link>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  setTempSettings(settings);
                  setShowSettings(!showSettings);
                }}
                className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setSettings(prev => ({
                    ...prev,
                    soundEnabled: !prev.soundEnabled
                  }));
                }}
                className={`p-2 rounded-full hover:bg-muted/50 ${settings.soundEnabled ? 'text-foreground' : 'text-muted-foreground/50'}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {workout.title}
            </h1>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{workout.time}</span>
              <span className="mx-2">•</span>
              <span>Day {dayNumber}</span>
            </div>
          </div>
          
          <div className="mt-6 h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground text-right">
            {currentExercise + 1} of {workout.exercises.length} exercises
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="space-y-4">
          {workout.exercises.map((exercise: any, index: number) => (
            <ExerciseCard
              key={index}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              rest={exercise.rest}
              isActive={index === currentExercise}
              isCompleted={completedExercises.includes(index)}
              onComplete={() => handleCompleteExercise(index)}
              onNextExercise={handleNextExercise}
              onPrevExercise={handlePrevExercise}
              onExerciseComplete={() => handleExerciseComplete(index)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevExercise}
            disabled={currentExercise === 0}
            className={`p-3 rounded-full ${currentExercise === 0 ? 'text-muted-foreground/30' : 'text-foreground hover:bg-muted/50'}`}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">
              {currentExercise + 1}<span className="text-muted-foreground">/{workout.exercises.length}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedExercises.length} of {workout.exercises.length} completed
            </div>
          </div>
          
          <button
            onClick={handleNextExercise}
            disabled={currentExercise === workout.exercises.length - 1}
            className={`p-3 rounded-full ${currentExercise === workout.exercises.length - 1 ? 'text-muted-foreground/30' : 'text-foreground hover:bg-muted/50'}`}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/30 py-4 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">
              Exercise {currentExercise + 1} of {workout.exercises.length}
            </div>
            <div className="text-sm font-medium">
              {formatTime(elapsedTime)}
            </div>
          </div>
          
          <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${((currentExercise) / workout.exercises.length) * 100}%` }}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <button 
              onClick={handlePrevExercise}
              disabled={currentExercise === 0}
              className={`p-2 rounded-full ${currentExercise === 0 ? 'text-muted-foreground/30' : 'text-foreground hover:bg-muted/50'}`}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              className="px-6 py-3 rounded-full bg-accent text-white hover:bg-accent/90 flex items-center space-x-2 min-w-[180px] justify-center"
              onClick={currentExercise < workout.exercises.length - 1 ? handleNextExercise : () => setShowCompleteModal(true)}
            >
              {currentExercise === workout.exercises.length - 1 ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Finish Workout</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Next Exercise</span>
                </>
              )}
            </button>
            
            <div className="w-8"></div> {/* Spacer for flex alignment */}
          </div>
        </div>
      </div>
      
      {/* Workout Complete Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div 
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-card border border-border/30 rounded-2xl p-8 max-w-md w-full text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Great job completing Day {dayNumber}'s workout in {formatTime(elapsedTime)}.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{workout.exercises.length}</div>
                  <div className="text-sm text-muted-foreground">Exercises</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {workout.exercises.reduce((total, ex) => total + parseInt(ex.sets), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Sets</div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link
                  href={`/account/dashboard/devotion/fitness/strength-fundamentals`}
                  className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Back to Workout Plan
                </Link>
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCurrentExercise(0);
                    setElapsedTime(0);
                    setExerciseStatus({});
                    setWorkoutComplete(false);
                  }}
                  className="px-6 py-3 border border-border/30 rounded-lg font-medium hover:bg-muted/50 transition-colors"
                >
                  Restart Workout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              className="max-w-md mx-auto bg-card border border-border/30 rounded-2xl p-6 my-8 relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/50"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Workout Settings
              </h2>
              
              <div className="space-y-8">
                {/* Sound Settings */}
                <div>
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Volume2 className="w-5 h-5 mr-2 text-accent" />
                    Sound Settings
                  </h3>
                  <div className="space-y-4 pl-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Enable Sound</div>
                        <div className="text-sm text-muted-foreground">Sound effects for workout events</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={tempSettings.soundEnabled}
                          onChange={(e) => setTempSettings({...tempSettings, soundEnabled: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-muted-foreground/20 rounded-full peer peer-checked:bg-accent/80 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                    
                    <div className={`space-y-2 ${!tempSettings.soundEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Volume</span>
                        <span className="text-sm font-medium">{tempSettings.soundVolume}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={tempSettings.soundVolume}
                        onChange={(e) => setTempSettings({...tempSettings, soundVolume: parseInt(e.target.value)})}
                        className="w-full h-2 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-accent"
                        disabled={!tempSettings.soundEnabled}
                      />
                    </div>
                  </div>
                </div>

                {/* Timer Settings */}
                <div className="pt-4 border-t border-border/20">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent" />
                    Timer Settings
                  </h3>
                  <div className="space-y-4 pl-1">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Preparation Time</span>
                        <span className="text-sm font-medium">{tempSettings.prepTime}s</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        step="5"
                        value={tempSettings.prepTime}
                        onChange={(e) => setTempSettings({...tempSettings, prepTime: parseInt(e.target.value)})}
                        className="w-full h-2 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Work Time</span>
                        <span className="text-sm font-medium">{tempSettings.workTime}s</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        step="5"
                        value={tempSettings.workTime}
                        onChange={(e) => setTempSettings({...tempSettings, workTime: parseInt(e.target.value)})}
                        className="w-full h-2 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Rest Time</span>
                        <span className="text-sm font-medium">{tempSettings.restTime}s</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="180" 
                        step="5"
                        value={tempSettings.restTime}
                        onChange={(e) => setTempSettings({...tempSettings, restTime: parseInt(e.target.value)})}
                        className="w-full h-2 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Workout Settings */}
                <div className="pt-4 border-t border-border/20 space-y-4">
                  <h3 className="font-medium text-lg mb-2 flex items-center">
                    <Dumbbell className="w-5 h-5 mr-2 text-accent" />
                    Workout Settings
                  </h3>
                  
                  <div className="space-y-4 pl-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto Progression</div>
                        <div className="text-sm text-muted-foreground">Automatically start next set</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={tempSettings.autoProgression}
                          onChange={(e) => setTempSettings({...tempSettings, autoProgression: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-muted-foreground/20 rounded-full peer peer-checked:bg-accent/80 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Haptic Feedback</div>
                        <div className="text-sm text-muted-foreground">Vibrate on exercise changes</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={tempSettings.hapticsEnabled}
                          onChange={(e) => setTempSettings({...tempSettings, hapticsEnabled: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-muted-foreground/20 rounded-full peer peer-checked:bg-accent/80 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-muted-foreground">Toggle dark theme</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={tempSettings.darkMode}
                          onChange={(e) => setTempSettings({...tempSettings, darkMode: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-muted-foreground/20 rounded-full peer peer-checked:bg-accent/80 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-border/20 flex justify-between">
                <button 
                  className="px-4 py-2 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setTempSettings(settings);
                    setShowSettings(false);
                  }}
                >
                  Cancel
                </button>
                <div className="space-x-3">
                  <button 
                    className="px-4 py-2 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
                    onClick={() => setTempSettings(DEFAULT_SETTINGS)}
                  >
                    Reset to Defaults
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
                    onClick={() => {
                      setSettings(tempSettings);
                      setShowSettings(false);
                    }}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
