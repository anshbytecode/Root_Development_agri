import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, Droplets, Sun, Calendar } from "lucide-react";

interface PlantCardProps {
  name: string;
  species: string;
  rootLength: number;
  maxRootLength: number;
  stage: "germination" | "seedling" | "vegetative" | "mature";
  daysPlanted: number;
  healthScore: number;
  waterLevel: number;
  lightLevel: number;
}

const stageColors = {
  germination: "bg-terracotta text-terracotta-foreground",
  seedling: "bg-leaf text-primary-foreground",
  vegetative: "bg-emerald text-primary-foreground",
  mature: "bg-primary text-primary-foreground",
};

const stageLabels = {
  germination: "Germination",
  seedling: "Seedling",
  vegetative: "Vegetative",
  mature: "Mature",
};

export function PlantCard({
  name,
  species,
  rootLength,
  maxRootLength,
  stage,
  daysPlanted,
  healthScore,
  waterLevel,
  lightLevel,
}: PlantCardProps) {
  const growthPercentage = (rootLength / maxRootLength) * 100;

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-leaf/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-display">{name}</CardTitle>
            <p className="text-sm text-muted-foreground font-sans">{species}</p>
          </div>
          <Badge className={stageColors[stage]} variant="secondary">
            {stageLabels[stage]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {/* Root Growth Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Sprout className="h-4 w-4 text-emerald" />
              Root Length
            </span>
            <span className="font-medium text-foreground">{rootLength} cm</span>
          </div>
          <Progress value={growthPercentage} variant="emerald" size="default" />
          <p className="text-xs text-muted-foreground text-right">
            {growthPercentage.toFixed(0)}% of expected {maxRootLength} cm
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <Calendar className="h-4 w-4 text-earth mb-1" />
            <span className="text-xs text-muted-foreground">Days</span>
            <span className="font-semibold text-sm">{daysPlanted}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <Droplets className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-xs text-muted-foreground">Water</span>
            <span className="font-semibold text-sm">{waterLevel}%</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <Sun className="h-4 w-4 text-amber-500 mb-1" />
            <span className="text-xs text-muted-foreground">Light</span>
            <span className="font-semibold text-sm">{lightLevel}%</span>
          </div>
        </div>

        {/* Health Score */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Health Score</span>
            <span className={`font-bold ${healthScore >= 80 ? 'text-emerald' : healthScore >= 50 ? 'text-terracotta' : 'text-destructive'}`}>
              {healthScore}/100
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
