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
    const { type, data, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userContent: any[] = [];

    switch (type) {
      case 'analyze-image':
        systemPrompt = `You are an expert agricultural AI specializing in plant root analysis. When given an image of plant roots, analyze and provide:
1. Estimated root length in cm
2. Root depth estimation
3. Branching pattern assessment (sparse, moderate, dense)
4. Root health score (0-100)
5. Any visible stress indicators
6. Nutrient uptake efficiency assessment
7. Actionable recommendations

Respond in JSON format with keys: rootLength, rootDepth, branchingPattern, branchingCount, healthScore, densityScore, stressIndicators (array), nutrientEfficiency, recommendations (array), overallAssessment`;
        
        if (imageBase64) {
          userContent = [
            { type: 'text', text: 'Analyze this root image and provide detailed metrics:' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ];
        } else {
          userContent = [{ type: 'text', text: 'Provide a sample root analysis for demonstration purposes based on a healthy tomato plant root system.' }];
        }
        break;

      case 'predict-growth':
        systemPrompt = `You are an expert agricultural AI specializing in root growth prediction. Based on the plant data provided, predict future root growth under various conditions. Consider soil type, moisture, temperature, and current growth patterns.

Respond in JSON format with keys: predictions (array of {days, predictedLength, confidence}), optimalConditions, growthFactors, recommendations (array)`;
        
        userContent = [{ 
          type: 'text', 
          text: `Predict root growth for the following plant data: ${JSON.stringify(data)}` 
        }];
        break;

      case 'generate-insights':
        systemPrompt = `You are an expert agricultural AI providing actionable insights for farmers and researchers. Based on the plant data, generate specific recommendations for irrigation, fertilization, and crop management.

Respond in JSON format with keys: insights (array of {type: 'irrigation'|'fertilization'|'health'|'stress', title, description, priority: 'low'|'medium'|'high'|'critical', actionItems: array})`;
        
        userContent = [{ 
          type: 'text', 
          text: `Generate actionable insights for this plant data: ${JSON.stringify(data)}` 
        }];
        break;

      case 'health-assessment':
        systemPrompt = `You are an expert agricultural AI specializing in plant health assessment. Analyze the provided data to assess root health, detect early stress indicators, and evaluate nutrient uptake efficiency.

Respond in JSON format with keys: healthScore, healthStatus ('excellent'|'good'|'fair'|'poor'|'critical'), stressIndicators (array of {indicator, severity, cause}), nutrientAnalysis, earlyWarnings (array), treatmentRecommendations (array)`;
        
        userContent = [{ 
          type: 'text', 
          text: `Perform health assessment for: ${JSON.stringify(data)}` 
        }];
        break;

      default:
        throw new Error('Invalid analysis type');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    let parsedResult;
    try {
      parsedResult = JSON.parse(content);
    } catch {
      parsedResult = { rawResponse: content };
    }

    return new Response(JSON.stringify({ success: true, result: parsedResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-root function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
