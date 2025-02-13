
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Validation des variables d'environnement
if (!anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY is not set');
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Required Supabase environment variables are not set.');
}

const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validation des données d'entrée
    const body = await req.json();
    console.log('Received request body:', body);

    if (!body || typeof body.content !== 'string' || !body.content.trim()) {
      console.error('Invalid request format:', body);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format. Content must be a non-empty string.' 
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
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      }),
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API error:', {
        status: anthropicResponse.status,
        statusText: anthropicResponse.statusText,
        body: errorData
      });
      throw new Error(`Anthropic API error: ${anthropicResponse.status} ${anthropicResponse.statusText}`);
    }

    const data = await anthropicResponse.json();
    console.log('Received response from Anthropic:', data);

    // Validation de la réponse
    if (!data.content || !Array.isArray(data.content) || !data.content[0]?.text) {
      console.error('Invalid response format from Anthropic:', data);
      throw new Error('Invalid response format from Anthropic API');
    }

    // Stockage de la conversation
    try {
      const { error: insertError } = await supabaseClient
        .from('ai_conversations')
        .insert([
          {
            content,
            response: data.content[0].text,
            model: 'claude-3-opus-20240229',
            metadata: { raw_response: data }
          }
        ]);

      if (insertError) {
        console.error('Error storing conversation:', insertError);
        // On continue même si l'insertion échoue
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // On continue même si l'insertion échoue
    }

    return new Response(
      JSON.stringify({ response: data.content[0].text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-anthropic function:', error);
    
    // Message d'erreur utilisateur plus descriptif
    const userMessage = error.message.includes('Anthropic API error') 
      ? 'Service IA temporairement indisponible. Veuillez réessayer.'
      : 'Une erreur est survenue lors du traitement de votre demande.';

    return new Response(
      JSON.stringify({ 
        error: userMessage,
        details: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
