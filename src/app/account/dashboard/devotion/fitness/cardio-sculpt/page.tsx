import React from 'react';

export default function CardioSculpt() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Cardio Sculpt</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src="/images/fitness/cardio.jpg" 
              alt="Cardio Sculpt" 
              className="w-full h-auto rounded-lg mb-6"
            />
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-sm text-muted-foreground">6 weeks, 18 sessions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Intensity</h3>
                  <p className="text-sm text-muted-foreground">Intermediate</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Equipment</h3>
                  <p className="text-sm text-muted-foreground">Dumbbells, Resistance Bands, Yoga Mat</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Program Description</h3>
            <p className="text-muted-foreground mb-6">
              High-intensity cardio combined with targeted sculpting exercises to help you burn fat, build lean muscle, 
              and improve your overall fitness level. This program is designed for those who want to take their 
              cardiovascular endurance to the next while toning and strengthening their entire body.
            </p>
            
            <h3 className="text-lg font-medium mb-4">What's Included</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>18 high-energy workout videos</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Printable workout calendar</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Beginner modifications for all fitness levels</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Nutrition guidance and meal planning tips</span>
              </li>
            </ul>
            
            <button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Start 7-Day Free Trial
            </button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              $19.99/month after trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
