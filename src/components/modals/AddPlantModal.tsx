import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePlant } from "@/hooks/usePlants";
import { Loader2 } from "lucide-react";

interface AddPlantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPlantModal({ open, onOpenChange }: AddPlantModalProps) {
  const createPlant = useCreatePlant();
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    max_root_length: 30,
    soil_type: "loamy",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPlant.mutateAsync({
      name: formData.name,
      species: formData.species,
      root_length: 0,
      max_root_length: formData.max_root_length,
      stage: "germination",
      days_planted: 0,
      health_score: 100,
      water_level: 50,
      light_level: 50,
      soil_type: formData.soil_type,
      temperature: 25,
      moisture: 50,
      notes: formData.notes || null,
    });
    setFormData({ name: "", species: "", max_root_length: 30, soil_type: "loamy", notes: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Plant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Tomato A1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="species">Species</Label>
            <Input
              id="species"
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              placeholder="e.g., Solanum lycopersicum"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_root_length">Expected Max Root Length (cm)</Label>
            <Input
              id="max_root_length"
              type="number"
              value={formData.max_root_length}
              onChange={(e) => setFormData({ ...formData, max_root_length: Number(e.target.value) })}
              min={1}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="soil_type">Soil Type</Label>
            <Select value={formData.soil_type} onValueChange={(v) => setFormData({ ...formData, soil_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="peat">Peat</SelectItem>
                <SelectItem value="chalk">Chalk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="emerald" disabled={createPlant.isPending}>
              {createPlant.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Add Plant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
