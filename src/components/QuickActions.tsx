import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, SunMedium, Ruler, Sparkles, TrendingUp, HeartPulse } from "lucide-react";

interface QuickActionsProps {
  onLogMeasurement: () => void;
  onWaterPlants: () => void;
  onAIAnalysis: () => void;
  onPredictGrowth: () => void;
  onHealthCheck: () => void;
}

export function QuickActions({ 
  onLogMeasurement, 
  onWaterPlants, 
  onAIAnalysis,
  onPredictGrowth,
  onHealthCheck 
}: QuickActionsProps) {
  const actions = [
    { icon: Ruler, label: "Log Measurement", description: "Record root length", onClick: onLogMeasurement, variant: "glass" as const },
    { icon: Droplets, label: "Water Plants", description: "Log watering", onClick: onWaterPlants, variant: "glass" as const },
    { icon: Sparkles, label: "AI Analysis", description: "Analyze roots", onClick: onAIAnalysis, variant: "emerald" as const },
    { icon: TrendingUp, label: "Predict Growth", description: "AI forecasting", onClick: onPredictGrowth, variant: "leaf" as const },
    { icon: HeartPulse, label: "Health Check", description: "Stress detection", onClick: onHealthCheck, variant: "glass" as const },
    { icon: SunMedium, label: "Conditions", description: "Environment", onClick: () => {}, variant: "glass" as const },
  ];

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto flex-col gap-2 p-4 hover:bg-emerald/10 hover:border-emerald/30 transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5 text-emerald" />
              <div className="text-center">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
