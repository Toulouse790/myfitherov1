
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

    // Vérifier les préférences et définir des valeurs par défaut si nécessaire
    const validatedPreferences = {
      workoutType: userPreferences.workoutType || 'custom',
      userLevel: userPreferences.userLevel || 'beginner',
      duration: userPreferences.duration || 45,
      location: userPreferences.location || 'home',
      equipment: Array.isArray(userPreferences.equipment) ? userPreferences.equipment : ['minimal'],
      muscleGroups: Array.isArray(userPreferences.muscleGroups) ? userPreferences.muscleGroups : ['full_body']
    };

    console.log("Generating workout with preferences:", validatedPreferences);

    try {
      const openai = new OpenAI({
        apiKey: Deno.env.get('OPENAI_API_KEY')
      });

      // Détermine le nombre d'exercices en fonction du type d'entraînement et de la durée
      let exerciseCount = 4; // Valeur par défaut
      
      if (validatedPreferences.workoutType === 'quick') {
        exerciseCount = 3; // Séance rapide : toujours 3 exercices
      } else if (validatedPreferences.duration) {
        if (validatedPreferences.duration <= 30) {
          exerciseCount = Math.min(3, exerciseCount);
        } else if (validatedPreferences.duration <= 45) {
          exerciseCount = Math.min(5, exerciseCount);
        } else {
          exerciseCount = Math.min(7, exerciseCount);
        }
      }

      const prompt = `En tant qu'expert en fitness, génère un programme d'entraînement personnalisé avec exactement ${exerciseCount} exercices et ces préférences:
      ${JSON.stringify(validatedPreferences, null, 2)}
      
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

      // Appeler l'API OpenAI
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

      // Fallback en cas de problème avec l'API
      if (!response?.choices?.[0]?.message?.content) {
        throw new Error("Réponse invalide de l'API OpenAI");
      }

      try {
        const workout = JSON.parse(response.choices[0].message.content);

        // S'assurer que le nombre d'exercices correspond à la demande
        if (workout.exercises && workout.exercises.length > exerciseCount) {
          workout.exercises = workout.exercises.slice(0, exerciseCount);
        }
        
        // Ajuster la durée en fonction du nombre d'exercices
        if (validatedPreferences.workoutType === 'quick') {
          workout.duration = 25; // Forcer la durée à 25 minutes pour les séances rapides
        }

        return new Response(
          JSON.stringify(workout),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        
        // Retourner un entraînement par défaut
        const fallbackWorkout = {
          exercises: [
            { name: "Pompes", sets: 3, reps: 10, rest: 60 },
            { name: "Squats", sets: 3, reps: 15, rest: 60 },
            { name: "Planche", sets: 3, reps: 30, rest: 45 }
          ],
          duration: validatedPreferences.duration || 30,
          difficulty: validatedPreferences.userLevel || 'beginner',
          description: "Entraînement de base qui cible tout le corps."
        };
        
        return new Response(
          JSON.stringify(fallbackWorkout),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      throw openaiError;
    }
  } catch (error) {
    console.error('Error:', error);
    
    // Retourner un entraînement par défaut en cas d'erreur
    const emergencyFallback = {
      exercises: [
        { name: "Pompes", sets: 3, reps: 10, rest: 60 },
        { name: "Squats", sets: 3, reps: 15, rest: 60 },
        { name: "Planche", sets: 3, reps: 30, rest: 45 }
      ],
      duration: 30,
      difficulty: 'beginner',
      description: "Entraînement de base qui cible tout le corps."
    };
    
    return new Response(
      JSON.stringify(emergencyFallback),
      { 
        status: 200, // Return 200 even on error to prevent UI errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
