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

    const prompt = `En tant qu'expert en fitness, génère un programme d'entraînement personnalisé avec ces préférences:
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