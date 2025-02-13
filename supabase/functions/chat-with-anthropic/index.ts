
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Validation des variables d'environnement avec message détaillé
if (!anthropicApiKey) {
  console.error('Configuration error: ANTHROPIC_API_KEY is missing');
  throw new Error('ANTHROPIC_API_KEY is not set');
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Configuration error: Supabase credentials are missing');
  throw new Error('Required Supabase environment variables are not set.');
}

const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function testAnthropicConnection() {
  const testResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Test connection' }]
    }),
  });

  if (!testResponse.ok) {
    const errorData = await testResponse.text();
    console.error('Anthropic connection test failed:', {
      status: testResponse.status,
      statusText: testResponse.statusText,
      error: errorData
    });
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Test de connexion au démarrage
    const isConnected = await testAnthropicConnection();
    if (!isConnected) {
      throw new Error('Failed to establish connection with Anthropic API');
    }

    const body = await req.json();
    console.log('Received request body:', body);

    if (!body || typeof body.content !== 'string' || !body.content.trim()) {
      console.error('Invalid request format:', body);
      return new Response(
        JSON.stringify({ 
          error: 'Format de requête invalide. Le contenu doit être une chaîne non vide.' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { content } = body;
    console.log('Sending request to Anthropic API with content:', content);

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content }]
      }),
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API error:', {
        status: anthropicResponse.status,
        statusText: anthropicResponse.statusText,
        body: errorData
      });

      // Messages d'erreur plus spécifiques selon le code d'erreur
      let errorMessage = 'Service IA temporairement indisponible.';
      if (anthropicResponse.status === 401) {
        errorMessage = 'Erreur d\'authentification avec le service IA. L\'équipe technique a été notifiée.';
        // Log spécifique pour les erreurs d'authentification
        console.error('Authentication failed with provided API key');
      } else if (anthropicResponse.status === 429) {
        errorMessage = 'Limite d\'utilisation du service IA atteinte. Veuillez réessayer dans quelques minutes.';
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorData 
        }), {
          status: anthropicResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await anthropicResponse.json();
    console.log('Received response from Anthropic:', data);

    if (!data.content || !Array.isArray(data.content) || !data.content[0]?.text) {
      console.error('Invalid response format from Anthropic:', data);
      throw new Error('Format de réponse invalide de l\'API Anthropic');
    }

    // Stockage de la conversation avec plus de métadonnées
    try {
      const { error: insertError } = await supabaseClient
        .from('ai_conversations')
        .insert([
          {
            content,
            response: data.content[0].text,
            model: 'claude-3-opus-20240229',
            metadata: { 
              raw_response: data,
              request_timestamp: new Date().toISOString(),
              response_status: 'success'
            }
          }
        ]);

      if (insertError) {
        console.error('Error storing conversation:', insertError);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({ response: data.content[0].text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-anthropic function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue. Notre équipe technique a été notifiée.',
        details: error.message,
        recovery_suggestion: 'Vous pouvez continuer sans les recommandations IA pour le moment.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
