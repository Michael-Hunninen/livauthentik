'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Pause, Headphones, BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, Save } from 'lucide-react';

// Simple UI components since we don't have access to the actual UI library
const Button = ({ children, className = '', variant = 'default', ...props }: any) => {
  const variants = {
    default: 'bg-accent hover:bg-accent/90 text-white',
    outline: 'border border-accent/30 text-accent hover:bg-accent/10',
    ghost: 'hover:bg-accent/10 text-accent',
    link: 'text-accent hover:underline underline-offset-4 p-0',
  };
  return (
    <button className={`py-2 px-4 rounded-md flex items-center justify-center transition-colors ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }: any) => (
  <div className={`border rounded-lg overflow-hidden ${className}`} {...props}>{children}</div>
);

const Textarea = ({ className = '', ...props }: any) => (
  <textarea 
    className={`w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
    {...props}
  />
);

// Mock data for the audio coaching program
const programData = {
  title: 'Morning Motivation',
  description: 'Start your day with intention and purpose.',
  episodes: 28,
  completedEpisodes: 14,
  totalDurationMinutes: 350,
  progress: 50, // percentage
};

const episodes = [
  {
    id: 1,
    title: 'Awakening Your Purpose',
    description: 'Begin your journey with setting your intentions for the program.',
    duration: '12:45',
    completed: true,
    journalPrompt: 'What are three specific areas of your life where you want to see growth in the next 30 days?'
  },
  {
    id: 2,
    title: 'Gratitude Practice',
    description: 'Learn how gratitude can transform your mindset and start your day positively.',
    duration: '10:30',
    completed: true,
    journalPrompt: "List five things you're grateful for today that you typically take for granted."
  },
  {
    id: 3,
    title: 'Creating Morning Rituals',
    description: 'Establish powerful morning routines that set you up for success.',
    duration: '15:20',
    completed: false,
    journalPrompt: 'Describe your ideal morning routine and how it would make you feel to complete it every day.'
  },
  {
    id: 4,
    title: 'Visualizing Success',
    description: 'Use visualization techniques to program your mind for achievement.',
    duration: '11:15',
    completed: false,
    journalPrompt: 'Visualize and describe in detail where you want to be one year from now.'
  },
  {
    id: 5,
    title: 'Mind-Body Connection',
    description: 'Understand how physical movement influences your mental state.',
    duration: '14:30',
    completed: false,
    journalPrompt: 'What physical sensations do you notice when you feel motivated versus when you feel stuck?'
  }
];

export default function MorningMotivationCoaching() {
  const [activeEpisode, setActiveEpisode] = useState(episodes[0]);
  const [journalEntry, setJournalEntry] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control the audio playback
  };

  const handleSaveJournal = () => {
    // In a real app, this would save the journal entry
    alert('Journal entry saved!');
  };

  const nextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === activeEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setActiveEpisode(episodes[currentIndex + 1]);
      setJournalEntry('');
      setAudioProgress(0);
      setIsPlaying(false);
    }
  };

  const prevEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === activeEpisode.id);
    if (currentIndex > 0) {
      setActiveEpisode(episodes[currentIndex - 1]);
      setJournalEntry('');
      setAudioProgress(0);
      setIsPlaying(false);
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
        <div className="mb-6">
          <Link href="/account/dashboard/devotion" className="text-sm text-accent hover:underline flex items-center mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Devotion Experience
          </Link>
          <h1 className="text-3xl font-bold">{programData.title}</h1>
          <p className="text-muted-foreground mt-1">{programData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-background to-muted/20 backdrop-blur border-muted/20">
            <div className="flex items-center">
              <Headphones className="h-5 w-5 text-accent mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Episodes</p>
                <p className="font-medium">{programData.completedEpisodes} of {programData.episodes}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-background to-muted/20 backdrop-blur border-muted/20">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-accent mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Journal Entries</p>
                <p className="font-medium">{programData.completedEpisodes} entries</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-background to-muted/20 backdrop-blur border-muted/20">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-accent mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="font-medium">{Math.floor(programData.totalDurationMinutes / 60)}h {programData.totalDurationMinutes % 60}m</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Audio Player Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="mb-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-accent/5 to-accent/20 backdrop-blur border-accent/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={prevEpisode} disabled={activeEpisode.id === 1} className="h-8 w-8 p-0 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h3 className="text-lg font-medium">Episode {activeEpisode.id}</h3>
                <p className="text-sm text-muted-foreground">{activeEpisode.title}</p>
              </div>
              <Button variant="ghost" onClick={nextEpisode} disabled={activeEpisode.id === episodes.length} className="h-8 w-8 p-0 rounded-full">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-32 h-32 rounded-full bg-accent/30 flex items-center justify-center mb-4 cursor-pointer hover:bg-accent/40 transition-colors"
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12 text-white" />
                ) : (
                  <Play className="h-12 w-12 text-white ml-2" />
                )}
              </div>
              
              <div className="w-full mb-2">
                <div className="w-full h-1 bg-accent/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${audioProgress}%` }}></div>
                </div>
              </div>
              
              <div className="w-full flex justify-between text-sm text-muted-foreground">
                <span>00:00</span>
                <span>{activeEpisode.duration}</span>
              </div>
            </div>
            
            <p className="text-sm">{activeEpisode.description}</p>
          </div>
        </Card>
      </motion.div>

      {/* Journaling Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">Today's Journal Prompt</h2>
          <div className="text-sm flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Day {activeEpisode.id}</span>
          </div>
        </div>
        
        <Card className="p-6 bg-gradient-to-br from-background to-muted/20 backdrop-blur border-muted/20">
          <p className="mb-4 italic text-muted-foreground">{activeEpisode.journalPrompt}</p>
          <Textarea 
            value={journalEntry}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJournalEntry(e.target.value)}
            rows={8}
            placeholder="Start writing your thoughts here..."
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button className="flex items-center" onClick={handleSaveJournal}>
              <Save className="h-4 w-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Episode List */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="mt-10"
      >
        <h2 className="text-xl font-bold mb-4">All Episodes</h2>
        <div className="space-y-2">
          {episodes.map((episode) => (
            <Card 
              key={episode.id}
              className={`p-4 cursor-pointer hover:bg-muted/10 transition-colors ${episode.id === activeEpisode.id ? 'bg-accent/5 border-accent/30' : ''}`}
              onClick={() => {
                setActiveEpisode(episode);
                setJournalEntry('');
                setAudioProgress(0);
                setIsPlaying(false);
              }}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center mr-4">
                  {episode.completed ? (
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Play className="h-4 w-4 text-muted-foreground ml-0.5" />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Episode {episode.id}: {episode.title}</h4>
                    <span className="text-xs text-muted-foreground">{episode.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{episode.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
