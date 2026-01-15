import { useState } from "react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { PlantCard } from "@/components/PlantCard";
import { GrowthChart } from "@/components/GrowthChart";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { AddPlantModal } from "@/components/modals/AddPlantModal";
import { LogMeasurementModal } from "@/components/modals/LogMeasurementModal";
import { WaterPlantsModal } from "@/components/modals/WaterPlantsModal";
import { AIAnalysisModal } from "@/components/modals/AIAnalysisModal";
import { PredictGrowthModal } from "@/components/modals/PredictGrowthModal";
import { HealthCheckModal } from "@/components/modals/HealthCheckModal";
import { usePlants, useMeasurements } from "@/hooks/usePlants";
import { Sprout, TrendingUp, Droplets, Sun, Loader2 } from "lucide-react";
import heroRoots from "@/assets/hero-roots.jpg";

const Index = () => {
  const { data: plants, isLoading: plantsLoading } = usePlants();
  const { data: measurements } = useMeasurements();
  
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showLogMeasurement, setShowLogMeasurement] = useState(false);
  const [showWaterPlants, setShowWaterPlants] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showPredictGrowth, setShowPredictGrowth] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(false);

  // Calculate stats
  const totalPlants = plants?.length || 0;
  const avgGrowthRate = plants?.length 
    ? (plants.reduce((sum, p) => sum + Number(p.root_length), 0) / plants.length / 7).toFixed(1)
    : "0";
  const avgWaterLevel = plants?.length
    ? Math.round(plants.reduce((sum, p) => sum + p.water_level, 0) / plants.length)
    : 0;
  const avgLightLevel = plants?.length
    ? Math.round(plants.reduce((sum, p) => sum + p.light_level, 0) / plants.length)
    : 0;

  // Generate growth chart data from measurements
  const growthData = measurements?.slice(-7).map((m, i) => ({
    day: `Day ${i + 1}`,
    rootLength: Number(m.root_length),
    expected: Number(m.root_length) * 1.05,
  })) || [
    { day: "Day 1", rootLength: 0.5, expected: 0.5 },
    { day: "Day 7", rootLength: 2.1, expected: 2.0 },
    { day: "Day 14", rootLength: 4.8, expected: 5.0 },
    { day: "Day 21", rootLength: 8.2, expected: 8.5 },
    { day: "Day 28", rootLength: 12.5, expected: 12.0 },
  ];

  if (plantsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddPlant={() => setShowAddPlant(true)} />
      
      {/* Hero Section */}
      <section className="relative h-[280px] overflow-hidden">
        <img src={heroRoots} alt="Plant roots" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="container relative h-full flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-3 animate-fade-in">
            AI-Powered Root Tracking
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-md animate-fade-in" style={{ animationDelay: "100ms" }}>
            Analyze growth patterns, predict development, and get actionable insights for your agricultural research.
          </p>
        </div>
      </section>

      <main className="container py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Plants" value={totalPlants} subtitle="Active tracking" icon={Sprout} trend={{ value: 12, label: "this week" }} variant="emerald" />
          <StatsCard title="Avg. Growth Rate" value={`${avgGrowthRate} cm`} subtitle="Per week" icon={TrendingUp} trend={{ value: 8, label: "vs last week" }} variant="leaf" />
          <StatsCard title="Water Level" value={`${avgWaterLevel}%`} subtitle="Average" icon={Droplets} variant="default" />
          <StatsCard title="Light Coverage" value={`${avgLightLevel}%`} subtitle="Average" icon={Sun} variant="terracotta" />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GrowthChart data={growthData} />
            <section>
              <h3 className="text-xl font-display font-semibold mb-4">Active Plants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plants?.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    name={plant.name}
                    species={plant.species}
                    rootLength={Number(plant.root_length)}
                    maxRootLength={Number(plant.max_root_length)}
                    stage={plant.stage as any}
                    daysPlanted={plant.days_planted}
                    healthScore={plant.health_score}
                    waterLevel={plant.water_level}
                    lightLevel={plant.light_level}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <QuickActions
              onLogMeasurement={() => setShowLogMeasurement(true)}
              onWaterPlants={() => setShowWaterPlants(true)}
              onAIAnalysis={() => setShowAIAnalysis(true)}
              onPredictGrowth={() => setShowPredictGrowth(true)}
              onHealthCheck={() => setShowHealthCheck(true)}
            />
            <RecentActivity />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-secondary/30 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>RootTrack • AI-Powered Agricultural Growth Monitoring</p>
          <p className="mt-1">Built for Agrithon 2025</p>
        </div>
      </footer>

      {/* Modals */}
      <AddPlantModal open={showAddPlant} onOpenChange={setShowAddPlant} />
      <LogMeasurementModal open={showLogMeasurement} onOpenChange={setShowLogMeasurement} plants={plants || []} />
      <WaterPlantsModal open={showWaterPlants} onOpenChange={setShowWaterPlants} plants={plants || []} />
      <AIAnalysisModal open={showAIAnalysis} onOpenChange={setShowAIAnalysis} />
      <PredictGrowthModal open={showPredictGrowth} onOpenChange={setShowPredictGrowth} plants={plants || []} />
      <HealthCheckModal open={showHealthCheck} onOpenChange={setShowHealthCheck} plants={plants || []} />
    </div>
  );
};

export default Index;
