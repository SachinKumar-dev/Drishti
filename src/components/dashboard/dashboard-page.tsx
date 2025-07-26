
"use client"

import React, { useState, useCallback } from 'react'
import { manageCrowdIncident } from "@/ai/flows/manage-crowd-incident"
import { summarizeIncident } from "@/ai/flows/summarize-incident"
import type { Anomaly, IncidentSummary } from '@/lib/types'
import { useToast } from "@/hooks/use-toast"
import { CameraFeedCard } from './camera-feed-card'
import { AlertsCard } from './alerts-card'
import { IncidentSummaryCard } from './incident-summary-card'
import { HeatmapCard } from './heatmap-card'

// Placeholder video URLs. Replace with your actual video sources.
const videoSources = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerCrowds.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
]

export function DashboardPage() {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([])
    const [summary, setSummary] = useState<IncidentSummary | null>(null)
    const [isDetecting, setIsDetecting] = useState(false)
    const [isSummarizing, setIsSummarizing] = useState(false)
    const { toast } = useToast()

    const handleDetectAnomalies = useCallback(async (cameraFeedDataUri: string) => {
        if (!cameraFeedDataUri) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not get camera feed.',
            });
            return;
        }
        setIsDetecting(true);
        try {
            const result = await manageCrowdIncident({ cameraFeedDataUri });
            if (result.anomalies.length > 0) {
                // Prepend new anomalies to the list
                setAnomalies(prev => [...result.anomalies, ...prev].slice(0, 50)); // Keep last 50 anomalies
                toast({
                    title: 'Anomaly Detected!',
                    description: result.summary,
                });
            } else {
                 toast({
                    title: 'Analysis Complete',
                    description: `No new anomalies detected.`,
                });
            }
        } catch (error) {
            console.error('Error detecting anomalies:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'Could not analyze the camera feed. Please try again.',
            });
        } finally {
            setIsDetecting(false);
        }
    }, [toast]);

    const handleSummarizeIncident = async () => {
        setIsSummarizing(true);
        
        const anomaliesSummary = anomalies.length > 0 
            ? `Detected anomalies include: ${[...new Set(anomalies.map(a => a.type))].join(', ')}.`
            : "No specific anomalies detected in the recent feeds.";

        const incidentData = {
            cameraFeed: anomaliesSummary,
            sensorData: "Crowd density metrics are stable. No unusual audio spikes.",
            userReports: "No new user reports in the last 15 minutes.",
            timeline: `Analysis performed at ${new Date().toLocaleTimeString()}.`
        };

        try {
            const result = await summarizeIncident(incidentData);
            setSummary(result);
            toast({
                title: 'Incident Summary Generated',
                description: 'The incident has been summarized successfully.',
            });
        } catch (error) {
            console.error('Error summarizing incident:', error);
            toast({
                variant: 'destructive',
                title: 'Summarization Failed',
                description: 'Could not generate the incident summary. Please try again.',
            });
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
            <div className="grid col-span-1 lg:col-span-3 grid-cols-1 sm:grid-cols-2 gap-6">
                <CameraFeedCard
                    title="Main Stage - Cam 01"
                    location="Sector A"
                    videoSrc={videoSources[0]}
                    isLoading={isDetecting}
                    onAnalyze={handleDetectAnomalies}
                />
                <CameraFeedCard
                    title="East Gate - Cam 02"
                    location="Sector B"
                    videoSrc={videoSources[1]}
                    isLoading={isDetecting}
                    onAnalyze={handleDetectAnomalies}
                />
            </div>

            <div className="col-span-1 lg:col-span-2 row-start-2 lg:row-start-1 lg:col-start-4">
                 <AlertsCard anomalies={anomalies} />
            </div>

            <div className="col-span-1 lg:col-span-3">
                <HeatmapCard />
            </div>

            <div className="col-span-1 lg:col-span-2">
                <IncidentSummaryCard
                    summary={summary}
                    isLoading={isSummarizing}
                    onSummarize={handleSummarizeIncident}
                />
            </div>
        </div>
    )
}
