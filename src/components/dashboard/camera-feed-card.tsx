
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScanSearch, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraFeedCardProps {
  title: string;
  location: string;
  videoSrc: string;
  isLoading: boolean;
  onAnalyze: (dataUri: string) => void;
}

export function CameraFeedCard({ title, location, videoSrc, isLoading, onAnalyze }: CameraFeedCardProps) {
  const [isRealtime, setIsRealtime] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) { // Ensure video has enough data to play
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
            return canvas.toDataURL("image/jpeg");
        } catch (error) {
            console.error("Error converting canvas to data URL:", error);
            toast({
                variant: "destructive",
                title: "Capture Error",
                description: "Could not capture frame. The video source might have security restrictions (CORS).",
            });
            return null;
        }
      }
    }
    return null;
  }, [toast]);

  const handleAnalyzeClick = () => {
    const dataUri = captureFrame();
    if (dataUri) {
      onAnalyze(dataUri);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not capture frame from video feed. The video may not be loaded yet.",
      });
    }
  };

  useEffect(() => {
    if (isRealtime && !isLoading) {
      analysisIntervalRef.current = setInterval(() => {
        handleAnalyzeClick();
      }, 5000); // Analyze every 5 seconds
    } else {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isRealtime, isLoading, handleAnalyzeClick]);


  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/50 rounded-md m-6 mt-0">
        <div className="aspect-video w-full relative">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover rounded-md"
            loop
            muted
            autoPlay
            playsInline
            crossOrigin="anonymous" // Important for capturing frames from external sources
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Switch id={`realtime-switch-${title}`} checked={isRealtime} onCheckedChange={setIsRealtime} disabled={isLoading} />
          <Label htmlFor={`realtime-switch-${title}`}>Real-time</Label>
        </div>
        <Button onClick={handleAnalyzeClick} disabled={isLoading || isRealtime} className="w-full sm:w-auto">
          {isLoading && !isRealtime ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ScanSearch className="mr-2 h-4 w-4" />
          )}
          Analyze Once
        </Button>
      </CardFooter>
    </Card>
  );
}
