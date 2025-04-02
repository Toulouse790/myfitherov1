
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
    let userPreferences = {};
    
    try {
      const body = await req.json();
      userPreferences = body.userPreferences || {};
      console.log("Préférences utilisateur reçues:", userPreferences);
    } catch (parseError) {
      console.error("Erreur de parsing des préférences:", parseError);
      userPreferences = {};
    }

    // Valider les préférences et définir des valeurs par défaut
    const validatedPreferences = {
      workoutType: userPreferences.workoutType || 'custom',
      userLevel: userPreferences.userLevel || 'beginner',
      duration: userPreferences.duration || 45,
      location: userPreferences.location || 'home',
      equipment: Array.isArray(userPreferences.equipment) ? userPreferences.equipment : ['minimal'],
      muscleGroups: Array.isArray(userPreferences.muscleGroups) ? userPreferences.muscleGroups : ['full_body']
    };

    console.log("Generating workout with preferences:", validatedPreferences);

    // Fonction pour générer l'entraînement de secours basé sur les préférences
    const generateBackupWorkout = () => {
      // Déterminer le nombre d'exercices en fonction du type d'entraînement et de la durée
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

      // Sélectionner les exercices en fonction du groupe musculaire
      let exercises = [];
      
      const fullBodyExercises = [
        { name: "Pompes", sets: 3, reps: 10, rest: 60 },
        { name: "Squats", sets: 3, reps: 15, rest: 60 },
        { name: "Planche", sets: 3, reps: 30, rest: 45 },
        { name: "Fentes avant", sets: 3, reps: 12, rest: 60 },
        { name: "Mountain climbers", sets: 3, reps: 20, rest: 30 }
      ];
      
      const upperBodyExercises = [
        { name: "Pompes", sets: 3, reps: 10, rest: 60 },
        { name: "Dips sur chaise", sets: 3, reps: 12, rest: 60 },
        { name: "Élévations latérales", sets: 3, reps: 15, rest: 45 },
        { name: "Pompes diamant", sets: 3, reps: 10, rest: 60 }
      ];
      
      const lowerBodyExercises = [
        { name: "Squats", sets: 3, reps: 15, rest: 60 },
        { name: "Fentes avant", sets: 3, reps: 12, rest: 60 },
        { name: "Élévations de bassin", sets: 3, reps: 15, rest: 45 },
        { name: "Squats sautés", sets: 3, reps: 10, rest: 60 }
      ];
      
      const coreExercises = [
        { name: "Planche", sets: 3, reps: 30, rest: 45 },
        { name: "Crunchs", sets: 3, reps: 20, rest: 30 },
        { name: "Russian twists", sets: 3, reps: 15, rest: 30 },
        { name: "Mountain climbers", sets: 3, reps: 20, rest: 30 }
      ];
      
      // Sélectionner les exercices en fonction du groupe musculaire
      if (validatedPreferences.muscleGroups.includes('upper_body')) {
        exercises = [...exercises, ...upperBodyExercises];
      }
      
      if (validatedPreferences.muscleGroups.includes('lower_body')) {
        exercises = [...exercises, ...lowerBodyExercises];
      }
      
      if (validatedPreferences.muscleGroups.includes('core')) {
        exercises = [...exercises, ...coreExercises];
      }
      
      // Si aucun groupe spécifique n'est sélectionné ou si 'full_body' est sélectionné
      if (exercises.length === 0 || validatedPreferences.muscleGroups.includes('full_body')) {
        exercises = [...fullBodyExercises];
      }
      
      // Limiter au nombre d'exercices calculé
      exercises = exercises.slice(0, exerciseCount);
      
      return {
        exercises: exercises,
        duration: validatedPreferences.duration,
        difficulty: validatedPreferences.userLevel,
        description: `Programme ${validatedPreferences.workoutType} pour un entraînement de ${validatedPreferences.duration} minutes.`
      };
    };

    try {
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      
      if (!apiKey) {
        console.log("Clé API OpenAI manquante, utilisation du programme de secours");
        const backupWorkout = generateBackupWorkout();
        return new Response(
          JSON.stringify(backupWorkout),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const openai = new OpenAI({
        apiKey: apiKey
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

      if (!response?.choices?.[0]?.message?.content) {
        console.error("Réponse invalide de l'API OpenAI");
        const backupWorkout = generateBackupWorkout();
        return new Response(
          JSON.stringify(backupWorkout),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      try {
        const content = response.choices[0].message.content;
        console.log("Réponse OpenAI:", content);
        
        const workout = JSON.parse(content);

        // S'assurer que le format est valide
        if (!workout.exercises || !Array.isArray(workout.exercises)) {
          throw new Error("Format d'exercices invalide");
        }

        // S'assurer que le nombre d'exercices correspond à la demande
        if (workout.exercises.length > exerciseCount) {
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
        console.error("Raw response:", response.choices[0].message.content);
        
        // Retourner un entraînement par défaut
        const backupWorkout = generateBackupWorkout();
        
        return new Response(
          JSON.stringify(backupWorkout),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      
      // Entraînement de secours en cas d'erreur OpenAI
      const backupWorkout = generateBackupWorkout();
      
      return new Response(
        JSON.stringify(backupWorkout),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error général:', error);
    
    // Utiliser une fonction qui génère un entraînement selon les préférences
    // même en cas d'erreur générale
    const emergencyWorkout = {
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
      JSON.stringify(emergencyWorkout),
      { 
        status: 200, // Return 200 even on error to prevent UI errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
