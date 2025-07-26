
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type GridCell = {
  color: string;
  opacity: number;
};

const HeatmapFlexGrid = () => {
  const rows = 10;
  const cols = 24;
  const colors = [
    'bg-sky-200', 'bg-teal-300', 'bg-yellow-300', 'bg-orange-400', 'bg-red-500'
  ];

  const [gridData, setGridData] = useState<GridCell[][]>([]);

  useEffect(() => {
    const data = Array.from({ length: rows }).map(() =>
      Array.from({ length: cols }).map(() => {
        const randomColorIndex = Math.floor(Math.pow(Math.random(), 2.5) * colors.length);
        const randomOpacity = Math.random() * 0.6 + 0.4;
        return {
          color: colors[randomColorIndex],
          opacity: randomOpacity,
        };
      })
    );
    setGridData(data);
  }, []); // Empty dependency array ensures this runs once on the client after mount

  if (gridData.length === 0) {
    // Render a placeholder or skeleton while waiting for client-side generation
    return (
      <div className="flex flex-col gap-px w-full h-full aspect-[2/1] bg-muted/20 p-1 rounded-md">
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="flex flex-1 gap-px">
            {Array.from({ length: cols }).map((_, cIndex) => (
              <div
                key={cIndex}
                className="flex-1 rounded-sm bg-muted/50"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-px w-full h-full aspect-[2/1] bg-muted/20 p-1 rounded-md">
      {gridData.map((row, rIndex) => (
        <div key={rIndex} className="flex flex-1 gap-px">
          {row.map((cell, cIndex) => (
            <div
              key={cIndex}
              className={cn("flex-1 rounded-sm", cell.color)}
              style={{ opacity: cell.opacity, transition: 'background-color 0.3s ease' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

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
