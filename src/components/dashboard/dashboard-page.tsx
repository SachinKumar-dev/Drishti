"use client"

import React, { useState } from 'react'
import { detectAnomalies } from "@/ai/flows/detect-anomalies"
import { summarizeIncident } from "@/ai/flows/summarize-incident"
import type { Anomaly, IncidentSummary } from '@/lib/types'
import { useToast } from "@/hooks/use-toast"
import { CameraFeedCard } from './camera-feed-card'
import { AlertsCard } from './alerts-card'
import { IncidentSummaryCard } from './incident-summary-card'
import { HeatmapCard } from './heatmap-card'

export function DashboardPage() {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([])
    const [summary, setSummary] = useState<IncidentSummary | null>(null)
    const [isDetecting, setIsDetecting] = useState(false)
    const [isSummarizing, setIsSummarizing] = useState(false)
    const { toast } = useToast()

    const handleDetectAnomalies = async (cameraFeedDataUri: string) => {
        if (!cameraFeedDataUri) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select an image file first.',
            });
            return;
        }
        setIsDetecting(true);
        try {
            const result = await detectAnomalies({ cameraFeedDataUri });
            setAnomalies(prev => [...result.anomalies, ...prev]);
            toast({
                title: 'Analysis Complete',
                description: `${result.anomalies.length} new anomalies detected.`,
            });
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
    };

    const handleSummarizeIncident = async () => {
        setIsSummarizing(true);
        // Mock data for incident summarization
        const mockIncidentData = {
            cameraFeed: "Crowd density increasing rapidly near the main stage. Some individuals are climbing barriers.",
            sensorData: "Loud noise detected at 10:32 PM. Temperature spike in Zone 3.",
            userReports: "User reports smoke near the food court. Another user reports a lost child near Gate B.",
            timeline: "10:30 PM: Crowd surge begins. 10:32 PM: Loud bang. 10:33 PM: Smoke reported."
        };

        try {
            const result = await summarizeIncident(mockIncidentData);
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
                    isLoading={isDetecting}
                    onAnalyze={handleDetectAnomalies}
                />
                <CameraFeedCard
                    title="East Gate - Cam 02"
                    location="Sector B"
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
