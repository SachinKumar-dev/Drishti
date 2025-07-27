import type { ManageCrowdIncidentOutput } from "@/ai/flows/manage-crowd-incident";
import type { SummarizeIncidentOutput } from "@/ai/flows/summarize-incident";

export type Anomaly = ManageCrowdIncidentOutput['anomalies'][number];
export type IncidentSummary = SummarizeIncidentOutput;

export type IncidentStatus = "Pending" | "Acknowledged" | "Escalated" | "Archived";

export type IncidentSource = "QR Report" | "Mock Data";

export type Incident = {
    id: string;
    userName: string;
    location: string;
    details: string;
    timestamp: number; // Use number for Date.now()
    status: IncidentStatus;
    source: IncidentSource;
};
