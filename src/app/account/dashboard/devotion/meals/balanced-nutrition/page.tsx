import React from 'react';

export default function BalancedNutritionPlan() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Balanced Nutrition Plan</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src="/images/meals/balanced.jpg" 
              alt="Balanced Nutrition" 
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
                  <p className="text-sm text-muted-foreground">4 weeks, 3 meals + 2 snacks</p>
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
                  <p className="text-sm text-muted-foreground">Vegetarian, Dairy-Free</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Macronutrient Balance</h3>
                  <p className="text-sm text-muted-foreground">40% Carbs, 30% Protein, 30% Fats</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Program Description</h3>
            <p className="text-muted-foreground mb-6">
              Our Balanced Nutrition plan provides the perfect harmony of macronutrients to fuel your body optimally. 
              This plan is designed for those seeking a sustainable approach to healthy eating that supports energy levels, 
              mental clarity, and overall well-being without restrictive dieting.
            </p>
            
            <h3 className="text-lg font-medium mb-4">What's Included</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>84 balanced meals + 56 snacks (3 meals + 2 snacks per day)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Meal timing and portion control guide</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Flexible meal swapping system</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Grocery shopping lists and meal prep guide</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Nutrition education resources</span>
              </li>
            </ul>
            
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-accent mb-2">Sample Day</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Breakfast:</span>
                  <span>Oatmeal with Nuts & Berries</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Morning Snack:</span>
                  <span>Apple with Almond Butter</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Lunch:</span>
                  <span>Grilled Chicken & Quinoa Bowl</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Afternoon Snack:</span>
                  <span>Greek Yogurt with Granola</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dinner:</span>
                  <span>Baked Cod with Roasted Vegetables</span>
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
