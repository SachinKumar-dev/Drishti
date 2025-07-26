"use client";

import Image from "next/image";
import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanSearch, Loader2 } from "lucide-react";

interface CameraFeedCardProps {
  title: string;
  location: string;
  isLoading: boolean;
  onAnalyze: (dataUri: string) => void;
}

export function CameraFeedCard({ title, location, isLoading, onAnalyze }: CameraFeedCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    onAnalyze(dataUrl);
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/50 rounded-md m-6 mt-0">
        <div className="aspect-video w-full relative">
            <Image
              src={previewUrl || "https://placehold.co/600x400.png"}
              alt="Camera feed preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              data-ai-hint="cctv security"
            />
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
         <div className="grid w-full max-w-sm items-center gap-1.5 flex-1">
          <Label htmlFor={`picture-${title}`} className="sr-only">Picture</Label>
          <Input id={`picture-${title}`} type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="text-xs"/>
        </div>
        <Button onClick={handleAnalyzeClick} disabled={isLoading || !dataUrl} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ScanSearch className="mr-2 h-4 w-4" />
          )}
          Analyze
        </Button>
      </CardFooter>
    </Card>
  );
}
