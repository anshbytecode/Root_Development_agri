import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeasurement, useLogActivity, useUpdatePlant, Plant } from "@/hooks/usePlants";
import { Loader2, Ruler } from "lucide-react";

interface LogMeasurementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plants: Plant[];
}

export function LogMeasurementModal({ open, onOpenChange, plants }: LogMeasurementModalProps) {
  const createMeasurement = useCreateMeasurement();
  const updatePlant = useUpdatePlant();
  const logActivity = useLogActivity();
  
  const [formData, setFormData] = useState({
    plant_id: "",
    root_length: 0,
    root_depth: 0,
    branching_count: 0,
    density_score: 50,
    health_notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPlant = plants.find(p => p.id === formData.plant_id);
    const previousLength = selectedPlant?.root_length || 0;
    const lengthChange = formData.root_length - previousLength;
    
    await createMeasurement.mutateAsync({
      plant_id: formData.plant_id,
      root_length: formData.root_length,
      root_depth: formData.root_depth || null,
      branching_count: formData.branching_count || null,
      density_score: formData.density_score || null,
      health_notes: formData.health_notes || null,
      image_url: null,
      ai_analysis: null,
      measured_at: new Date().toISOString(),
    });
    
    // Update plant's current root length
    await updatePlant.mutateAsync({
      id: formData.plant_id,
      root_length: formData.root_length,
    });
    
    // Log activity
    await logActivity.mutateAsync({
      plant_id: formData.plant_id,
      activity_type: 'measurement',
      description: `Root length: ${formData.root_length} cm (${lengthChange >= 0 ? '+' : ''}${lengthChange.toFixed(1)} cm)`,
      metadata: { root_length: formData.root_length, change: lengthChange },
    });
    
    setFormData({ plant_id: "", root_length: 0, root_depth: 0, branching_count: 0, density_score: 50, health_notes: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Ruler className="h-5 w-5 text-emerald" />
            Log Measurement
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="plant">Select Plant</Label>
            <Select value={formData.plant_id} onValueChange={(v) => setFormData({ ...formData, plant_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plant" />
              </SelectTrigger>
              <SelectContent>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name} ({plant.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="root_length">Root Length (cm)</Label>
              <Input
                id="root_length"
                type="number"
                step="0.1"
                value={formData.root_length}
                onChange={(e) => setFormData({ ...formData, root_length: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="root_depth">Root Depth (cm)</Label>
              <Input
                id="root_depth"
                type="number"
                step="0.1"
                value={formData.root_depth}
                onChange={(e) => setFormData({ ...formData, root_depth: Number(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branching_count">Branching Count</Label>
              <Input
                id="branching_count"
                type="number"
                value={formData.branching_count}
                onChange={(e) => setFormData({ ...formData, branching_count: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="density_score">Density Score (0-100)</Label>
              <Input
                id="density_score"
                type="number"
                min={0}
                max={100}
                value={formData.density_score}
                onChange={(e) => setFormData({ ...formData, density_score: Number(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="health_notes">Health Notes</Label>
            <Textarea
              id="health_notes"
              value={formData.health_notes}
              onChange={(e) => setFormData({ ...formData, health_notes: e.target.value })}
              placeholder="Observations about root health..."
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="emerald" disabled={createMeasurement.isPending || !formData.plant_id}>
              {createMeasurement.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Measurement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
