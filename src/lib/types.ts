import type { ManageCrowdIncidentOutput } from "@/ai/flows/manage-crowd-incident";
import type { SummarizeIncidentOutput } from "@/ai/flows/summarize-incident";

export type Anomaly = ManageCrowdIncidentOutput['anomalies'][number];
export type IncidentSummary = SummarizeIncidentOutput;
