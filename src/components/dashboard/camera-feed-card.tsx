
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanSearch, Loader2, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraFeedCardProps {
  title: string;
  location: string;
  isLoading: boolean;
  onAnalyze: (dataUri: string) => void;
}

export function CameraFeedCard({ title, location, isLoading, onAnalyze }: CameraFeedCardProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not available.");
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Not Supported",
          description: "Your browser does not support camera access.",
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [toast]);

  const captureFrame = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg");
      }
    }
    return null;
  }, []);

  const handleAnalyzeClick = () => {
    const dataUri = captureFrame();
    if (dataUri) {
      onAnalyze(dataUri);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not capture frame from video feed. The camera may still be initializing.",
      });
    }
  };

  useEffect(() => {
    if (isRealtime && hasCameraPermission && !isLoading) {
      analysisIntervalRef.current = setInterval(() => {
        const dataUri = captureFrame();
        if (dataUri) {
          onAnalyze(dataUri);
        }
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
  }, [isRealtime, hasCameraPermission, isLoading, onAnalyze, captureFrame]);


  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/50 rounded-md m-6 mt-0">
        <div className="aspect-video w-full relative">
          <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md text-white p-4">
              <VideoOff className="h-10 w-10 mb-2" />
              <p className="text-center font-semibold">Camera access denied</p>
              <p className="text-center text-sm">Please enable camera access in your browser settings.</p>
            </div>
          )}
          {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md text-white p-4">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Switch id={`realtime-switch-${title}`} checked={isRealtime} onCheckedChange={setIsRealtime} disabled={!hasCameraPermission || isLoading} />
          <Label htmlFor={`realtime-switch-${title}`}>Real-time</Label>
        </div>
        <Button onClick={handleAnalyzeClick} disabled={isLoading || !hasCameraPermission || isRealtime} className="w-full sm:w-auto">
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
