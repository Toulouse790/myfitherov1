import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Appel à l'API OpenAI pour générer le plan de repas
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
            Inclure un cheat meal par semaine.
            Format de réponse : JSON avec structure par jour et par repas, incluant calories, protéines, glucides, lipides et coût estimé.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const mealPlan = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ mealPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});