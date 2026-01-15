import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Plant {
  id: string;
  name: string;
  species: string;
  root_length: number;
  max_root_length: number;
  stage: 'germination' | 'seedling' | 'vegetative' | 'mature';
  days_planted: number;
  health_score: number;
  water_level: number;
  light_level: number;
  soil_type: string;
  temperature: number;
  moisture: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Measurement {
  id: string;
  plant_id: string;
  root_length: number;
  root_depth: number | null;
  branching_count: number | null;
  density_score: number | null;
  health_notes: string | null;
  image_url: string | null;
  ai_analysis: string | null;
  measured_at: string;
  created_at: string;
}

export interface Insight {
  id: string;
  plant_id: string | null;
  insight_type: 'irrigation' | 'fertilization' | 'health' | 'stress' | 'general';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  plant_id: string | null;
  activity_type: 'measurement' | 'water' | 'light' | 'germination' | 'photo' | 'analysis' | 'note';
  description: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export function usePlants() {
  return useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Plant[];
    },
  });
}

export function usePlant(id: string) {
  return useQuery({
    queryKey: ['plant', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Plant | null;
    },
    enabled: !!id,
  });
}

export function useMeasurements(plantId?: string) {
  return useQuery({
    queryKey: ['measurements', plantId],
    queryFn: async () => {
      let query = supabase
        .from('measurements')
        .select('*')
        .order('measured_at', { ascending: true });
      
      if (plantId) {
        query = query.eq('plant_id', plantId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Measurement[];
    },
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Insight[];
    },
  });
}

export function useActivityLog() {
  return useQuery({
    queryKey: ['activity_log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as ActivityLog[];
    },
  });
}

export function useCreatePlant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plant: Omit<Plant, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('plants')
        .insert(plant)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast.success('Plant added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add plant: ' + error.message);
    },
  });
}

export function useUpdatePlant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Plant> & { id: string }) => {
      const { data, error } = await supabase
        .from('plants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      queryClient.invalidateQueries({ queryKey: ['plant', data.id] });
      toast.success('Plant updated!');
    },
    onError: (error) => {
      toast.error('Failed to update plant: ' + error.message);
    },
  });
}

export function useCreateMeasurement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (measurement: Omit<Measurement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('measurements')
        .insert(measurement)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
      queryClient.invalidateQueries({ queryKey: ['measurements', data.plant_id] });
      toast.success('Measurement recorded!');
    },
    onError: (error) => {
      toast.error('Failed to record measurement: ' + error.message);
    },
  });
}

export function useLogActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: Omit<ActivityLog, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('activity_log')
        .insert(activity)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity_log'] });
    },
  });
}

export function useCreateInsight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (insight: Omit<Insight, 'id' | 'created_at' | 'is_read'>) => {
      const { data, error } = await supabase
        .from('insights')
        .insert(insight)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}
