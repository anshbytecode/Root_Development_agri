import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Droplets, SunMedium, Sprout, Camera } from "lucide-react";

interface Activity {
  id: string;
  type: "measurement" | "water" | "light" | "germination" | "photo";
  plant: string;
  description: string;
  time: string;
}

const iconMap = {
  measurement: Ruler,
  water: Droplets,
  light: SunMedium,
  germination: Sprout,
  photo: Camera,
};

const colorMap = {
  measurement: "bg-emerald/10 text-emerald",
  water: "bg-blue-100 text-blue-600",
  light: "bg-amber-100 text-amber-600",
  germination: "bg-leaf/10 text-leaf",
  photo: "bg-secondary text-secondary-foreground",
};

const activities: Activity[] = [
  { id: "1", type: "measurement", plant: "Tomato A1", description: "Root length: 12.5 cm (+1.2 cm)", time: "2 hours ago" },
  { id: "2", type: "water", plant: "Wheat B3", description: "Watered with nutrient solution", time: "4 hours ago" },
  { id: "3", type: "germination", plant: "Corn C2", description: "First roots visible!", time: "6 hours ago" },
  { id: "4", type: "light", plant: "Tomato A2", description: "Adjusted to 14h light cycle", time: "8 hours ago" },
  { id: "5", type: "photo", plant: "Soybean D1", description: "Weekly progress photo taken", time: "1 day ago" },
];

export function RecentActivity() {
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-lg ${colorMap[activity.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.plant}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
