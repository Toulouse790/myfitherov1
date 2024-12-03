import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { durationDays, maxBudget, calorieTarget, dietaryRestrictions } = await req.json();
    console.log('Request parameters:', { durationDays, maxBudget, calorieTarget, dietaryRestrictions });

    // Générer un plan de repas basique sans IA
    const mealPlan = generateBasicMealPlan(durationDays, calorieTarget, maxBudget, dietaryRestrictions);

    return new Response(
      JSON.stringify({ mealPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateBasicMealPlan(durationDays: number, calorieTarget: number, maxBudget: number, dietaryRestrictions: string[]) {
  const meals = {
    breakfast: [
      { name: "Porridge aux fruits", calories: 300, proteins: 10, carbs: 45, fats: 8, estimated_cost: 2 },
      { name: "Œufs et toast", calories: 350, proteins: 15, carbs: 30, fats: 12, estimated_cost: 2.5 },
      { name: "Yaourt avec granola", calories: 280, proteins: 12, carbs: 40, fats: 6, estimated_cost: 2 }
    ],
    lunch: [
      { name: "Salade de quinoa", calories: 450, proteins: 18, carbs: 55, fats: 15, estimated_cost: 4 },
      { name: "Sandwich poulet avocat", calories: 500, proteins: 25, carbs: 45, fats: 18, estimated_cost: 5 },
      { name: "Bowl de riz aux légumes", calories: 400, proteins: 15, carbs: 60, fats: 10, estimated_cost: 3.5 }
    ],
    dinner: [
      { name: "Saumon grillé et légumes", calories: 550, proteins: 35, carbs: 30, fats: 25, estimated_cost: 6 },
      { name: "Pâtes aux légumes", calories: 480, proteins: 18, carbs: 70, fats: 12, estimated_cost: 3 },
      { name: "Poulet rôti et patates", calories: 600, proteins: 40, carbs: 45, fats: 20, estimated_cost: 5 }
    ]
  };

  const plan = [];
  const dailyBudget = maxBudget / durationDays;

  for (let day = 0; day < durationDays; day++) {
    const dayMeals = {
      meals: {
        breakfast: meals.breakfast[day % meals.breakfast.length],
        lunch: meals.lunch[day % meals.lunch.length],
        dinner: meals.dinner[day % meals.dinner.length]
      }
    };
    plan.push(dayMeals);
  }

  return plan;
}