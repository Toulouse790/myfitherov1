
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.10.2'

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')
});

interface PerformanceMetrics {
  metric_type: string;
  value: number;
  recorded_at: string;
}

serve(async (req) => {
  try {
    const { sport_id, user_id } = await req.json();

    if (!sport_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'sport_id and user_id are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch historical performance data
    const { data: historicalData, error: historicalError } = await supabaseClient
      .from('performance_metrics')
      .select('*')
      .eq('user_id', user_id)
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (historicalError) {
      throw historicalError;
    }

    // Prepare historical data for analysis
    const formattedHistory = historicalData.reduce((acc: Record<string, number[]>, curr: PerformanceMetrics) => {
      if (!acc[curr.metric_type]) {
        acc[curr.metric_type] = [];
      }
      acc[curr.metric_type].push(curr.value);
      return acc;
    }, {});

    // Generate predictions using Claude
    const prompt = `Analyze the following performance metrics and provide predictions for future performance. 
    Historical data by metric type:
    ${JSON.stringify(formattedHistory, null, 2)}
    
    Based on this data, please provide:
    1. Predicted values for each metric
    2. A confidence score (0-100)
    3. Brief explanation of the predictions
    
    Format your response as a JSON object with these exact keys: predictions, confidence_score, explanation`;

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0.5,
      system: "You are a sports performance analysis AI. Analyze performance data and make predictions based on trends and patterns. Always return valid JSON.",
      messages: [{
        role: 'user',
        content: prompt,
      }]
    });

    const analysis = JSON.parse(message.content[0].text);

    // Store prediction in database
    const { error: insertError } = await supabaseClient
      .from('performance_predictions')
      .insert({
        user_id,
        sport_id,
        prediction_data: analysis.predictions,
        confidence_score: analysis.confidence_score,
        metadata: {
          explanation: analysis.explanation,
          generated_at: new Date().toISOString()
        },
        historical_data: formattedHistory
      });

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, data: analysis }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
