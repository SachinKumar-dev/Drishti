
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
import { ScanSearch, Loader2, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
      // Ensure we're on the client-side
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API is not available in this environment.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
          duration: 10000,
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
    if (isRealtime && hasCameraPermission) {
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
  }, [isRealtime, hasCameraPermission, onAnalyze, captureFrame]);


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
              <p className="text-center text-sm">Please enable camera access in your browser settings and refresh the page.</p>
            </div>
          )}
          {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md text-white p-4">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="mt-2 text-sm">Waiting for camera permission...</p>
            </div>
          )}
        </div>
        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature. You may need to
                grant permissions in your browser's settings.
              </AlertDescription>
            </Alert>
          )}
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
