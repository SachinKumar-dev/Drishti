import type { DetectAnomaliesOutput } from "@/ai/flows/detect-anomalies";
import type { SummarizeIncidentOutput } from "@/ai/flows/summarize-incident";

export type Anomaly = DetectAnomaliesOutput['anomalies'][number];
export type IncidentSummary = SummarizeIncidentOutput;
