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
    const openAiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAiKey) {
      console.error('OpenAI API key is not configured in environment variables');
      throw new Error('Configuration error: OpenAI API key is missing');
    }

    console.log('Request parameters:', { durationDays, maxBudget, calorieTarget });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en nutrition qui génère des plans de repas équilibrés. 
            Génère un plan de repas sur ${durationDays} jours avec un budget maximum de ${maxBudget}€.
            Objectif calorique journalier : ${calorieTarget} calories.
            Restrictions alimentaires : ${dietaryRestrictions.join(', ')}.
            Format de réponse attendu : JSON avec la structure suivante :
            {
              "days": [
                {
                  "dayNumber": 1,
                  "meals": {
                    "breakfast": { "name": "...", "calories": 0, "proteins": 0, "carbs": 0, "fats": 0, "estimated_cost": 0 },
                    "lunch": { "name": "...", "calories": 0, "proteins": 0, "carbs": 0, "fats": 0, "estimated_cost": 0 },
                    "dinner": { "name": "...", "calories": 0, "proteins": 0, "carbs": 0, "fats": 0, "estimated_cost": 0 }
                  }
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    let mealPlan;
    try {
      const content = data.choices[0].message.content;
      mealPlan = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      throw new Error('Failed to parse meal plan from OpenAI response');
    }

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