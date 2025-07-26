import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const HeatmapGrid = () => {
    const cells = Array.from({ length: 15 * 30 }); // 15 rows, 30 cols
    const colors = [
      'bg-blue-200', 'bg-green-300', 'bg-yellow-300', 'bg-orange-400', 'bg-red-500'
    ];
  
    return (
      <div className="grid grid-cols-30 grid-rows-15 gap-px w-full h-full aspect-[2/1]">
        {cells.map((_, i) => {
          const randomColorIndex = Math.floor(Math.pow(Math.random(), 2.5) * colors.length);
          const randomOpacity = Math.random() * 0.5 + 0.3;
          return (
            <div
              key={i}
              className={cn("rounded-sm", colors[randomColorIndex])}
              style={{ opacity: randomOpacity }}
            />
          );
        })}
      </div>
    );
  };
  
  // Need to add this to tailwind config for grid-cols-30
  // in theme.extend.gridTemplateColumns: { '30': 'repeat(30, minmax(0, 1fr))' }
  // Since I can't modify tailwind config, I will use a different approach.
  // I will use a flexbox layout to simulate the grid.
  const HeatmapFlexGrid = () => {
      const rows = Array.from({ length: 10 });
      const cols = Array.from({ length: 24 });
      const colors = [
        'bg-sky-200', 'bg-teal-300', 'bg-yellow-300', 'bg-orange-400', 'bg-red-500'
      ];

      return (
        <div className="flex flex-col gap-px w-full h-full aspect-[2/1] bg-muted/20 p-1 rounded-md">
            {rows.map((_, rIndex) => (
                <div key={rIndex} className="flex flex-1 gap-px">
                    {cols.map((_, cIndex) => {
                        const randomColorIndex = Math.floor(Math.pow(Math.random(), 2.5) * colors.length);
                        const randomOpacity = Math.random() * 0.6 + 0.4;
                        return (
                            <div
                                key={cIndex}
                                className={cn("flex-1 rounded-sm", colors[randomColorIndex])}
                                style={{ opacity: randomOpacity, transition: 'background-color 0.3s ease' }}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
      )
  }

export function HeatmapCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Crowd Density Heatmap</CardTitle>
            <Badge variant="secondary" className="bg-green-200 text-green-800">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
            </Badge>
        </div>
        <CardDescription>
          Real-time visualization of crowd distribution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full relative">
            <HeatmapFlexGrid />
            <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-card/70 p-1.5 rounded-md text-xs">
                <span>Low</span>
                <div className="flex h-3">
                    <div className="w-4 bg-sky-200 rounded-l-sm"></div>
                    <div className="w-4 bg-teal-300"></div>
                    <div className="w-4 bg-yellow-300"></div>
                    <div className="w-4 bg-orange-400"></div>
                    <div className="w-4 bg-red-500 rounded-r-sm"></div>
                </div>
                <span>High</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
