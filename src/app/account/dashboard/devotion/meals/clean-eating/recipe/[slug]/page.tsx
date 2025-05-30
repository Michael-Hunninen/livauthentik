'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Heart, Bookmark, Share2, Utensils, Flame, Carrot, Apple, Droplets } from 'lucide-react';
import Link from 'next/link';

// Mock data - in a real app, this would come from an API or database
const recipeData = {
  'avocado-toast': {
    title: 'Avocado Toast with Poached Eggs',
    image: '/images/avocado-toast.jpg',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '2 large eggs',
      '1 tbsp lemon juice',
      '1 tbsp olive oil',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      'Fresh herbs for garnish (parsley, chives, or dill)'
    ],
    instructions: [
      'Toast the bread until golden brown and crispy.',
      'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl. Add lemon juice, salt, and pepper. Mash with a fork until smooth but still slightly chunky.',
      'Bring a pot of water to a gentle simmer. Add a splash of vinegar (this helps the eggs hold their shape).',
      'Crack each egg into a small bowl or ramekin. Create a gentle whirlpool in the simmering water and carefully slide the eggs in, one at a time.',
      'Poach the eggs for 3-4 minutes for runny yolks, or longer if you prefer them more set.',
      'While the eggs cook, spread the mashed avocado evenly on the toasted bread.',
      'Using a slotted spoon, carefully remove the poached eggs from the water and place them on top of the avocado toast.',
      'Drizzle with olive oil, sprinkle with red pepper flakes (if using), and garnish with fresh herbs.',
      'Serve immediately and enjoy!' 
    ],
    nutrition: {
      calories: 420,
      protein: '14g',
      carbs: '34g',
      fat: '28g',
      fiber: '12g',
      sugar: '3g',
      sodium: '320mg'
    },
    tags: ['breakfast', 'quick', 'vegetarian', 'high-fiber'],
    author: 'LivAuthentik Team',
    date: '2025-05-29'
  }
  // Add more recipes as needed
};

type RecipeParams = {
  slug: string;
};

export default function RecipePage() {
  const params = useParams<RecipeParams>();
  const recipe = recipeData[params.slug as keyof typeof recipeData];
  const [saved, setSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Recipe Not Found</h1>
            <p className="text-muted-foreground mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
            <Link href="/account/dashboard/devotion/meals/clean-eating" className="inline-flex items-center text-accent hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to meal plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/account/dashboard/devotion/meals/clean-eating" 
            className="inline-flex items-center text-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to meal plan
          </Link>
        </div>

        {/* Recipe Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{recipe.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Prep: {recipe.prepTime} min</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Cook: {recipe.cookTime} min</span>
            </div>
            <div className="flex items-center">
              <Utensils className="w-4 h-4 mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
            <div>
              <span className="px-2 py-1 bg-muted rounded-full text-xs">{recipe.difficulty}</span>
            </div>
          </div>

          {/* Recipe Image */}
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-6">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-meal.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Recipe Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-2">
              <button 
                onClick={() => setSaved(!saved)}
                className={`p-2 rounded-full hover:bg-muted transition-colors ${saved ? 'text-red-500' : 'text-muted-foreground'}`}
                aria-label={saved ? 'Remove from saved' : 'Save recipe'}
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-full hover:bg-muted transition-colors ${bookmarked ? 'text-yellow-500' : 'text-muted-foreground'}`}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark recipe'}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground" aria-label="Share recipe">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground">
              By {recipe.author} • {new Date(recipe.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-1"
          >
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-2 mr-2"></span>
                    <span className="text-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>

              {/* Nutrition Info */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">Nutrition (per serving)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Calories</div>
                    <div className="font-medium">{recipe.nutrition.calories}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Protein</div>
                    <div className="font-medium">{recipe.nutrition.protein}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carbs</div>
                    <div className="font-medium">{recipe.nutrition.carbs}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Fat</div>
                    <div className="font-medium">{recipe.nutrition.fat}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Fiber</div>
                    <div className="font-medium">{recipe.nutrition.fiber}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Sugar</div>
                    <div className="font-medium">{recipe.nutrition.sugar}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">TAGS</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-muted text-foreground text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Instructions</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm mr-4 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-foreground">{step}</p>
                </li>
              ))}
            </ol>

            {/* Tips & Notes */}
            <div className="mt-12 bg-muted/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-3">Chef's Tips</h3>
              <ul className="space-y-2 text-foreground/90">
                <li className="flex">
                  <span className="text-accent mr-2">•</span>
                  <span>For extra flavor, try adding crumbled feta or goat cheese on top.</span>
                </li>
                <li className="flex">
                  <span className="text-accent mr-2">•</span>
                  <span>Add a pinch of everything bagel seasoning for an extra flavor kick.</span>
                </li>
                <li className="flex">
                  <span className="text-accent mr-2">•</span>
                  <span>For a vegan version, skip the eggs and add cherry tomatoes or roasted chickpeas.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
