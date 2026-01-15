import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "emerald" | "leaf" | "terracotta" | "earth";
}

const variantStyles = {
  default: "from-primary/10 to-primary/5 border-primary/20",
  emerald: "from-emerald/10 to-emerald/5 border-emerald/20",
  leaf: "from-leaf/10 to-leaf/5 border-leaf/20",
  terracotta: "from-terracotta/10 to-terracotta/5 border-terracotta/20",
  earth: "from-earth/10 to-earth/5 border-earth/20",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  emerald: "bg-emerald/10 text-emerald",
  leaf: "bg-leaf/10 text-leaf",
  terracotta: "bg-terracotta/10 text-terracotta",
  earth: "bg-earth/10 text-earth",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card className={`glass-card overflow-hidden animate-fade-in border bg-gradient-to-br ${variantStyles[variant]}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold font-display tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 pt-1">
                <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-emerald' : 'text-destructive'}`}>
                  {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconStyles[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
