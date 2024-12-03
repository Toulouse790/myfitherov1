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

    console.log('Generating meal plan with parameters:', {
      durationDays,
      maxBudget,
      calorieTarget,
      dietaryRestrictions,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
            Format de réponse : JSON avec la structure suivante:
            [
              {
                "day": 1,
                "meals": [
                  {
                    "type": "breakfast|lunch|dinner",
                    "foods": [
                      {
                        "name": "string",
                        "quantity": "number",
                        "unit": "string",
                        "calories": "number",
                        "proteins": "number"
                      }
                    ]
                  }
                ]
              }
            ]`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI');
    }

    let mealPlan;
    try {
      mealPlan = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse meal plan from OpenAI response');
    }

    if (!Array.isArray(mealPlan)) {
      console.error('Meal plan is not an array:', mealPlan);
      throw new Error('Invalid meal plan format');
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
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});