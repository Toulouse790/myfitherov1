
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userPreferences } = await req.json()

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Détermine le nombre d'exercices en fonction du type d'entraînement et de la durée
    let exerciseCount = 4; // Valeur par défaut
    
    if (userPreferences.workoutType === 'quick') {
      exerciseCount = 3; // Séance rapide : toujours 3 exercices
    } else if (userPreferences.duration) {
      if (userPreferences.duration <= 30) {
        exerciseCount = Math.min(3, exerciseCount);
      } else if (userPreferences.duration <= 45) {
        exerciseCount = Math.min(5, exerciseCount);
      } else {
        exerciseCount = Math.min(7, exerciseCount);
      }
    }

    const prompt = `En tant qu'expert en fitness, génère un programme d'entraînement personnalisé avec exactement ${exerciseCount} exercices et ces préférences:
    ${JSON.stringify(userPreferences, null, 2)}
    
    Format de réponse souhaité:
    {
      "exercises": [
        {
          "name": "nom de l'exercice",
          "sets": nombre de séries,
          "reps": nombre de répétitions,
          "rest": temps de repos en secondes
        }
      ],
      "duration": durée estimée en minutes,
      "difficulty": niveau de difficulté,
      "description": description du programme
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un coach sportif expert qui génère des programmes d'entraînement personnalisés."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const workout = JSON.parse(response.choices[0].message.content)

    // S'assurer que le nombre d'exercices correspond à la demande
    if (workout.exercises.length > exerciseCount) {
      workout.exercises = workout.exercises.slice(0, exerciseCount);
    }
    
    // Ajuster la durée en fonction du nombre d'exercices
    if (userPreferences.workoutType === 'quick') {
      workout.duration = 25; // Forcer la durée à 25 minutes pour les séances rapides
    }

    return new Response(
      JSON.stringify(workout),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
