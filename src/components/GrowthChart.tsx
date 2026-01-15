import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GrowthDataPoint {
  day: string;
  rootLength: number;
  expected: number;
}

interface GrowthChartProps {
  data: GrowthDataPoint[];
  title?: string;
}

export function GrowthChart({ data, title = "Root Growth Over Time" }: GrowthChartProps) {
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRoot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 55%, 35%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(152, 55%, 35%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(120, 15%, 70%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(120, 15%, 70%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 15%, 85%)" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: 'hsl(150, 15%, 40%)' }}
                axisLine={{ stroke: 'hsl(120, 15%, 85%)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(150, 15%, 40%)' }}
                axisLine={false}
                tickLine={false}
                unit=" cm"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(45, 40%, 99%)',
                  border: '1px solid hsl(120, 15%, 85%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'hsl(150, 25%, 15%)', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="expected"
                stroke="hsl(120, 15%, 70%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#colorExpected)"
                name="Expected"
              />
              <Area
                type="monotone"
                dataKey="rootLength"
                stroke="hsl(152, 55%, 35%)"
                strokeWidth={2}
                fill="url(#colorRoot)"
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald" />
            <span className="text-muted-foreground">Actual Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground" />
            <span className="text-muted-foreground">Expected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
