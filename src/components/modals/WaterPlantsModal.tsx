import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdatePlant, useLogActivity, Plant } from "@/hooks/usePlants";
import { Loader2, Droplets } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface WaterPlantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plants: Plant[];
}

export function WaterPlantsModal({ open, onOpenChange, plants }: WaterPlantsModalProps) {
  const updatePlant = useUpdatePlant();
  const logActivity = useLogActivity();
  
  const [selectedPlant, setSelectedPlant] = useState("");
  const [waterLevel, setWaterLevel] = useState(75);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updatePlant.mutateAsync({
        id: selectedPlant,
        water_level: waterLevel,
      });
      
      await logActivity.mutateAsync({
        plant_id: selectedPlant,
        activity_type: 'water',
        description: `Watered to ${waterLevel}% capacity`,
        metadata: { water_level: waterLevel },
      });
      
      setSelectedPlant("");
      setWaterLevel(75);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Water Plants
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Select Plant</Label>
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plant" />
              </SelectTrigger>
              <SelectContent>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name} - Current: {plant.water_level}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Water Level</Label>
              <span className="text-sm font-medium text-emerald">{waterLevel}%</span>
            </div>
            <Slider
              value={[waterLevel]}
              onValueChange={([v]) => setWaterLevel(v)}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dry</span>
              <span>Optimal</span>
              <span>Saturated</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting || !selectedPlant}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Log Watering
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
