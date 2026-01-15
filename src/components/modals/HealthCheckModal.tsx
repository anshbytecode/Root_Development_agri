import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAIAnalysis, HealthAssessment } from "@/hooks/useAIAnalysis";
import { Plant, useCreateInsight } from "@/hooks/usePlants";
import { Loader2, HeartPulse, AlertTriangle, ShieldCheck, Pill } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HealthCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plants: Plant[];
}

const statusColors = {
  excellent: "bg-emerald text-primary-foreground",
  good: "bg-leaf text-primary-foreground",
  fair: "bg-amber-500 text-primary-foreground",
  poor: "bg-terracotta text-primary-foreground",
  critical: "bg-destructive text-destructive-foreground",
};

export function HealthCheckModal({ open, onOpenChange, plants }: HealthCheckModalProps) {
  const { assessHealth, isAssessingHealth } = useAIAnalysis();
  const createInsight = useCreateInsight();
  const [selectedPlant, setSelectedPlant] = useState("");
  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);

  const handleAssess = async () => {
    const plant = plants.find(p => p.id === selectedPlant);
    if (!plant) return;
    
    const result = await assessHealth(plant);
    if (result) {
      setAssessment(result);
      
      // Save insights to database
      if (result.earlyWarnings && result.earlyWarnings.length > 0) {
        for (const warning of result.earlyWarnings.slice(0, 3)) {
          await createInsight.mutateAsync({
            plant_id: selectedPlant,
            insight_type: 'health',
            title: 'Health Warning',
            description: warning,
            priority: result.healthScore < 50 ? 'high' : 'medium',
          });
        }
      }
    }
  };

  const resetModal = () => {
    setSelectedPlant("");
    setAssessment(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetModal(); }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-terracotta" />
            AI Health Assessment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {!assessment ? (
            <>
              <div className="space-y-2">
                <Label>Select Plant for Assessment</Label>
                <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name} - Current Health: {plant.health_score}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleAssess}
                variant="emerald"
                disabled={isAssessingHealth || !selectedPlant}
                className="w-full"
              >
                {isAssessingHealth ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing Health...
                  </>
                ) : (
                  <>
                    <HeartPulse className="h-4 w-4 mr-2" />
                    Run Health Check
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Health Score Card */}
              <Card className="p-5 bg-gradient-to-br from-secondary to-secondary/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className={`text-4xl font-bold ${assessment.healthScore >= 80 ? 'text-emerald' : assessment.healthScore >= 50 ? 'text-terracotta' : 'text-destructive'}`}>
                      {assessment.healthScore}
                    </p>
                  </div>
                  <Badge className={statusColors[assessment.healthStatus]}>
                    {assessment.healthStatus.charAt(0).toUpperCase() + assessment.healthStatus.slice(1)}
                  </Badge>
                </div>
                <Progress 
                  value={assessment.healthScore} 
                  variant={assessment.healthScore >= 80 ? "emerald" : assessment.healthScore >= 50 ? "terracotta" : "default"} 
                  size="lg" 
                />
              </Card>
              
              {/* Stress Indicators */}
              {assessment.stressIndicators && assessment.stressIndicators.length > 0 && (
                <Card className="p-4 border-terracotta/30 bg-terracotta/5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-terracotta" />
                    <span className="font-medium text-sm">Stress Indicators Detected</span>
                  </div>
                  <div className="space-y-3">
                    {assessment.stressIndicators.map((indicator, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{indicator.indicator}</span>
                          <Badge variant="outline" className="text-xs">
                            {indicator.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          Cause: {indicator.cause}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {/* Nutrient Analysis */}
              {assessment.nutrientAnalysis && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald" />
                    <span className="font-medium text-sm">Nutrient Analysis</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{assessment.nutrientAnalysis}</p>
                </Card>
              )}
              
              {/* Early Warnings */}
              {assessment.earlyWarnings && assessment.earlyWarnings.length > 0 && (
                <Card className="p-4 border-amber-300/50 bg-amber-50/50">
                  <p className="font-medium text-sm mb-2">⚠️ Early Warnings</p>
                  <ul className="text-sm space-y-1">
                    {assessment.earlyWarnings.map((warning, i) => (
                      <li key={i} className="text-muted-foreground">• {warning}</li>
                    ))}
                  </ul>
                </Card>
              )}
              
              {/* Treatment Recommendations */}
              {assessment.treatmentRecommendations && assessment.treatmentRecommendations.length > 0 && (
                <Card className="p-4 border-emerald/30 bg-emerald/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-emerald" />
                    <span className="font-medium text-sm">Treatment Recommendations</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {assessment.treatmentRecommendations.map((rec, i) => (
                      <li key={i} className="text-muted-foreground">• {rec}</li>
                    ))}
                  </ul>
                </Card>
              )}
              
              <Button variant="outline" onClick={resetModal} className="w-full">
                Assess Another Plant
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
