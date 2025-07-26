// Summarizes incident details from various data sources using GenAI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIncidentInputSchema = z.object({
  cameraFeed: z.string().describe('Summary of camera feed.'),
  sensorData: z.string().describe('Summary of sensor data.'),
  userReports: z.string().describe('Summary of user reports.'),
  timeline: z.string().describe('Timeline of events.'),
});

export type SummarizeIncidentInput = z.infer<typeof SummarizeIncidentInputSchema>;

const SummarizeIncidentOutputSchema = z.object({
  summary: z.string().describe('A natural language summary of the incident.'),
  severity: z.string().describe('Classification of the severity of the incident.'),
  affectedAreas: z.string().describe('List of affected areas.'),
  responseActions: z.string().describe('Response actions taken.'),
  recommendations: z.string().describe('Recommendations for further actions.'),
});

export type SummarizeIncidentOutput = z.infer<typeof SummarizeIncidentOutputSchema>;

export async function summarizeIncident(input: SummarizeIncidentInput): Promise<SummarizeIncidentOutput> {
  return summarizeIncidentFlow(input);
}

const summarizeIncidentPrompt = ai.definePrompt({
  name: 'summarizeIncidentPrompt',
  input: {schema: SummarizeIncidentInputSchema},
  output: {schema: SummarizeIncidentOutputSchema},
  prompt: `You are an AI assistant designed to summarize incident details from various data sources.

  Your goal is to provide a concise and accurate summary of the incident, classify its severity, identify affected areas,
  describe response actions taken, and offer recommendations for further actions.

  Here are the data sources:
  Camera Feed: {{{cameraFeed}}}
  Sensor Data: {{{sensorData}}}
  User Reports: {{{userReports}}}
  Timeline: {{{timeline}}}

  Please generate a summary of the incident, classify its severity, identify affected areas, describe response actions taken, and offer recommendations for further actions.`,
});

const summarizeIncidentFlow = ai.defineFlow(
  {
    name: 'summarizeIncidentFlow',
    inputSchema: SummarizeIncidentInputSchema,
    outputSchema: SummarizeIncidentOutputSchema,
  },
  async input => {
    const {output} = await summarizeIncidentPrompt(input);
    return output!;
  }
);
