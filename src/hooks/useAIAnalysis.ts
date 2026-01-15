import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RootAnalysisResult {
  rootLength: number;
  rootDepth: number;
  branchingPattern: string;
  branchingCount: number;
  healthScore: number;
  densityScore: number;
  stressIndicators: string[];
  nutrientEfficiency: string;
  recommendations: string[];
  overallAssessment: string;
}

export interface GrowthPrediction {
  predictions: Array<{
    days: number;
    predictedLength: number;
    confidence: number;
  }>;
  optimalConditions: string;
  growthFactors: string;
  recommendations: string[];
}

export interface HealthAssessment {
  healthScore: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  stressIndicators: Array<{
    indicator: string;
    severity: string;
    cause: string;
  }>;
  nutrientAnalysis: string;
  earlyWarnings: string[];
  treatmentRecommendations: string[];
}

export interface GeneratedInsight {
  type: 'irrigation' | 'fertilization' | 'health' | 'stress';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionItems: string[];
}

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isAssessingHealth, setIsAssessingHealth] = useState(false);

  const analyzeRootImage = async (imageBase64?: string): Promise<RootAnalysisResult | null> => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-root', {
        body: { type: 'analyze-image', imageBase64 }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return null;
      }

      toast.success('Root analysis complete!');
      return data.result as RootAnalysisResult;
    } catch (error) {
      console.error('Error analyzing root:', error);
      toast.error('Failed to analyze root image');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const predictGrowth = async (plantData: any): Promise<GrowthPrediction | null> => {
    setIsPredicting(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-root', {
        body: { type: 'predict-growth', data: plantData }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return null;
      }

      toast.success('Growth prediction generated!');
      return data.result as GrowthPrediction;
    } catch (error) {
      console.error('Error predicting growth:', error);
      toast.error('Failed to predict growth');
      return null;
    } finally {
      setIsPredicting(false);
    }
  };

  const generateInsights = async (plantData: any): Promise<{ insights: GeneratedInsight[] } | null> => {
    setIsGeneratingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-root', {
        body: { type: 'generate-insights', data: plantData }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return null;
      }

      toast.success('Insights generated!');
      return data.result as { insights: GeneratedInsight[] };
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
      return null;
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const assessHealth = async (plantData: any): Promise<HealthAssessment | null> => {
    setIsAssessingHealth(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-root', {
        body: { type: 'health-assessment', data: plantData }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return null;
      }

      toast.success('Health assessment complete!');
      return data.result as HealthAssessment;
    } catch (error) {
      console.error('Error assessing health:', error);
      toast.error('Failed to assess health');
      return null;
    } finally {
      setIsAssessingHealth(false);
    }
  };

  return {
    analyzeRootImage,
    predictGrowth,
    generateInsights,
    assessHealth,
    isAnalyzing,
    isPredicting,
    isGeneratingInsights,
    isAssessingHealth,
  };
}
