
"use client";

import { useState, useRef, useCallback } from "react";
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
import { ScanSearch, Loader2, Upload, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadFeedCardProps {
  title: string;
  location: string;
  isLoading: boolean;
  onAnalyze: (dataUri: string) => void;
}

export function UploadFeedCard({ title, location, isLoading, onAnalyze }: UploadFeedCardProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setVideoSrc(url);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select a valid video file.",
        });
      }
    }
  };

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) {
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
            description: "Could not capture frame from the uploaded video.",
          });
          return null;
        }
      }
    }
    return null;
  }, [toast]);

  const handleAnalyzeClick = () => {
    if (!file || !videoSrc) {
      toast({
        variant: "destructive",
        title: "No Video Selected",
        description: "Please upload a video file to analyze.",
      });
      return;
    }
    const dataUri = captureFrame();
    if (dataUri) {
      onAnalyze(dataUri);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not capture frame. The video may not be loaded yet.",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/50 rounded-md m-6 mt-0">
        {videoSrc ? (
          <div className="aspect-video w-full relative">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover rounded-md"
              controls
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-10">
            <Video className="h-12 w-12 mb-4" />
            <p className="font-semibold">No video selected</p>
            <p className="text-sm">Upload a video file to begin analysis.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-4 items-center">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="video-upload" className="sr-only">Upload Video</Label>
          <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="cursor-pointer"/>
        </div>
        <Button onClick={handleAnalyzeClick} disabled={isLoading || !videoSrc} className="w-full sm:w-auto">
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
