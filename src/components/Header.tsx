import { Button } from "@/components/ui/button";
import { Leaf, Plus, Bell } from "lucide-react";

interface HeaderProps {
  onAddPlant: () => void;
}

export function Header({ onAddPlant }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-leaf shadow-glow">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold gradient-text">RootTrack</h1>
            <p className="text-xs text-muted-foreground">AI Growth Monitor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-terracotta rounded-full" />
          </Button>
          <Button variant="emerald" size="default" className="gap-2" onClick={onAddPlant}>
            <Plus className="h-4 w-4" />
            Add Plant
          </Button>
        </div>
      </div>
    </header>
  );
}
