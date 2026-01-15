import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAIAnalysis, GrowthPrediction } from "@/hooks/useAIAnalysis";
import { Plant } from "@/hooks/usePlants";
import { Loader2, TrendingUp, Target, Lightbulb } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PredictGrowthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plants: Plant[];
}

export function PredictGrowthModal({ open, onOpenChange, plants }: PredictGrowthModalProps) {
  const { predictGrowth, isPredicting } = useAIAnalysis();
  const [selectedPlant, setSelectedPlant] = useState("");
  const [prediction, setPrediction] = useState<GrowthPrediction | null>(null);

  const handlePredict = async () => {
    const plant = plants.find(p => p.id === selectedPlant);
    if (!plant) return;
    
    const result = await predictGrowth(plant);
    if (result) {
      setPrediction(result);
    }
  };

  const selectedPlantData = plants.find(p => p.id === selectedPlant);
  
  const chartData = prediction?.predictions?.map(p => ({
    day: `Day ${p.days}`,
    predicted: p.predictedLength,
    confidence: p.confidence,
  })) || [];

  const resetModal = () => {
    setSelectedPlant("");
    setPrediction(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetModal(); }}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-leaf" />
            AI Growth Prediction
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {!prediction ? (
            <>
              <div className="space-y-2">
                <Label>Select Plant to Predict</Label>
                <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name} - {plant.species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPlantData && (
                <Card className="p-4 bg-secondary/30">
                  <p className="text-sm font-medium mb-2">Current Status</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Root Length:</span>
                      <p className="font-semibold">{selectedPlantData.root_length} cm</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Days Planted:</span>
                      <p className="font-semibold">{selectedPlantData.days_planted}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stage:</span>
                      <p className="font-semibold capitalize">{selectedPlantData.stage}</p>
                    </div>
                  </div>
                </Card>
              )}
              
              <Button
                onClick={handlePredict}
                variant="emerald"
                disabled={isPredicting || !selectedPlant}
                className="w-full"
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Prediction...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Predict Growth
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Prediction Chart */}
              {chartData.length > 0 && (
                <Card className="p-4">
                  <p className="text-sm font-medium mb-4">Predicted Growth Trajectory</p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(85, 55%, 45%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(85, 55%, 45%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 15%, 85%)" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis unit=" cm" tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="predicted"
                          stroke="hsl(85, 55%, 45%)"
                          fill="url(#colorPredicted)"
                          name="Predicted Length"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
              
              {/* Optimal Conditions */}
              {prediction.optimalConditions && (
                <Card className="p-4 border-emerald/30 bg-emerald/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-emerald" />
                    <span className="font-medium text-sm">Optimal Conditions</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{prediction.optimalConditions}</p>
                </Card>
              )}
              
              {/* Growth Factors */}
              {prediction.growthFactors && (
                <Card className="p-4">
                  <p className="text-sm font-medium mb-2">Key Growth Factors</p>
                  <p className="text-sm text-muted-foreground">{prediction.growthFactors}</p>
                </Card>
              )}
              
              {/* Recommendations */}
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <Card className="p-4 border-leaf/30 bg-leaf/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-leaf" />
                    <span className="font-medium text-sm">Recommendations</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {prediction.recommendations.map((rec, i) => (
                      <li key={i} className="text-muted-foreground">• {rec}</li>
                    ))}
                  </ul>
                </Card>
              )}
              
              <Button variant="outline" onClick={resetModal} className="w-full">
                Predict Another
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
