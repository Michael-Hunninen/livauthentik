import React from 'react';

export default function HighProteinPlan() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">High Protein Plan</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src="/images/meals/protein.jpg" 
              alt="High Protein Meals" 
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
                  <p className="text-sm text-muted-foreground">4 weeks, 5 meals per day</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Dietary Options</h3>
                  <p className="text-sm text-muted-foreground">Dairy-Free Option</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Protein Target</h3>
                  <p className="text-sm text-muted-foreground">30-40g per meal</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Program Description</h3>
            <p className="text-muted-foreground mb-6">
              Our High Protein plan is designed to support muscle growth, recovery, and satiety through 
              carefully balanced macronutrients. Each meal is packed with high-quality protein sources 
              to help you meet your fitness goals while enjoying delicious, satisfying meals.
            </p>
            
            <h3 className="text-lg font-medium mb-4">What's Included</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>140 high-protein meals and snacks (5 per day)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Macronutrient breakdown for every meal</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Meal timing and portion guidelines</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Supplement recommendations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Pre- and post-workout nutrition guide</span>
              </li>
            </ul>
            
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-accent mb-2">Sample Day</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Meal 1:</span>
                  <span>Greek Yogurt Parfait with Berries</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Meal 2:</span>
                  <span>Grilled Chicken with Quinoa & Veggies</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Meal 3:</span>
                  <span>Protein Shake with Banana</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Meal 4:</span>
                  <span>Turkey & Avocado Wrap</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Meal 5:</span>
                  <span>Baked Salmon with Sweet Potato</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Start 7-Day Free Trial
            </button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              $14.99/month after trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
