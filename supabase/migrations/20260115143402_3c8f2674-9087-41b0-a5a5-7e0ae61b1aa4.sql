-- Create plants table
CREATE TABLE public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  root_length DECIMAL(10,2) DEFAULT 0,
  max_root_length DECIMAL(10,2) DEFAULT 30,
  stage TEXT DEFAULT 'germination' CHECK (stage IN ('germination', 'seedling', 'vegetative', 'mature')),
  days_planted INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  water_level INTEGER DEFAULT 50 CHECK (water_level >= 0 AND water_level <= 100),
  light_level INTEGER DEFAULT 50 CHECK (light_level >= 0 AND light_level <= 100),
  soil_type TEXT DEFAULT 'loamy',
  temperature DECIMAL(5,2) DEFAULT 25,
  moisture DECIMAL(5,2) DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create measurements table for tracking root growth over time
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  root_length DECIMAL(10,2) NOT NULL,
  root_depth DECIMAL(10,2),
  branching_count INTEGER,
  density_score INTEGER CHECK (density_score >= 0 AND density_score <= 100),
  health_notes TEXT,
  image_url TEXT,
  ai_analysis TEXT,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create growth predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  predicted_length DECIMAL(10,2) NOT NULL,
  predicted_date DATE NOT NULL,
  confidence DECIMAL(5,2) CHECK (confidence >= 0 AND confidence <= 100),
  conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insights table for AI-generated recommendations
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('irrigation', 'fertilization', 'health', 'stress', 'general')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity log table
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('measurement', 'water', 'light', 'germination', 'photo', 'analysis', 'note')),
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_plants_updated_at
BEFORE UPDATE ON public.plants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables (public access for demo)
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create public access policies for demo purposes
CREATE POLICY "Public read access for plants" ON public.plants FOR SELECT USING (true);
CREATE POLICY "Public insert access for plants" ON public.plants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for plants" ON public.plants FOR UPDATE USING (true);
CREATE POLICY "Public delete access for plants" ON public.plants FOR DELETE USING (true);

CREATE POLICY "Public read access for measurements" ON public.measurements FOR SELECT USING (true);
CREATE POLICY "Public insert access for measurements" ON public.measurements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for measurements" ON public.measurements FOR UPDATE USING (true);
CREATE POLICY "Public delete access for measurements" ON public.measurements FOR DELETE USING (true);

CREATE POLICY "Public read access for predictions" ON public.predictions FOR SELECT USING (true);
CREATE POLICY "Public insert access for predictions" ON public.predictions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for insights" ON public.insights FOR SELECT USING (true);
CREATE POLICY "Public insert access for insights" ON public.insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for insights" ON public.insights FOR UPDATE USING (true);

CREATE POLICY "Public read access for activity_log" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Public insert access for activity_log" ON public.activity_log FOR INSERT WITH CHECK (true);

-- Insert sample plants
INSERT INTO public.plants (name, species, root_length, max_root_length, stage, days_planted, health_score, water_level, light_level, soil_type, temperature, moisture)
VALUES 
  ('Tomato A1', 'Solanum lycopersicum', 12.5, 25, 'vegetative', 28, 92, 75, 85, 'loamy', 24, 65),
  ('Wheat B3', 'Triticum aestivum', 8.2, 15, 'seedling', 14, 88, 60, 90, 'clay', 22, 55),
  ('Corn C2', 'Zea mays', 2.1, 30, 'germination', 5, 95, 80, 70, 'sandy', 26, 70),
  ('Soybean D1', 'Glycine max', 18.5, 20, 'mature', 45, 78, 55, 88, 'loamy', 23, 50);

-- Insert sample measurements
INSERT INTO public.measurements (plant_id, root_length, root_depth, branching_count, density_score, health_notes, measured_at)
SELECT id, 12.5, 8.2, 24, 85, 'Healthy root development', now() - interval '2 hours'
FROM public.plants WHERE name = 'Tomato A1';

INSERT INTO public.measurements (plant_id, root_length, root_depth, branching_count, density_score, health_notes, measured_at)
SELECT id, 11.3, 7.5, 20, 82, 'Good progress', now() - interval '7 days'
FROM public.plants WHERE name = 'Tomato A1';

-- Insert sample activity log
INSERT INTO public.activity_log (plant_id, activity_type, description, created_at)
SELECT id, 'measurement', 'Root length: 12.5 cm (+1.2 cm)', now() - interval '2 hours'
FROM public.plants WHERE name = 'Tomato A1';

INSERT INTO public.activity_log (plant_id, activity_type, description, created_at)
SELECT id, 'water', 'Watered with nutrient solution', now() - interval '4 hours'
FROM public.plants WHERE name = 'Wheat B3';

INSERT INTO public.activity_log (plant_id, activity_type, description, created_at)
SELECT id, 'germination', 'First roots visible!', now() - interval '6 hours'
FROM public.plants WHERE name = 'Corn C2';

-- Insert sample insights
INSERT INTO public.insights (plant_id, insight_type, title, description, priority)
SELECT id, 'irrigation', 'Optimal Watering Time', 'Based on soil moisture levels, water this plant in the next 6 hours for best root absorption.', 'medium'
FROM public.plants WHERE name = 'Tomato A1';

INSERT INTO public.insights (insight_type, title, description, priority)
VALUES ('general', 'Weekly Growth Report', 'Average root growth rate increased by 12% this week across all plants.', 'low');