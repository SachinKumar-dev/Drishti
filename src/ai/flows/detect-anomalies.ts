'use server';

/**
 * @fileOverview An anomaly detection AI agent for identifying potential threats from camera feeds.
 *
 * - detectAnomalies - A function that handles the anomaly detection process.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  cameraFeedDataUri: z
    .string()
    .describe(
      "A camera feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      type: z.string().describe('The type of anomaly detected (e.g., smoke, fire, crowd surge).'),
      confidence: z.number().describe('The confidence level of the anomaly detection (0-1).'),
      location: z.string().describe('The location of the anomaly in the camera feed.'),
      severity: z.string().describe('The severity level of the anomaly (e.g., low, medium, high).'),
    })
  ).describe('A list of anomalies detected in the camera feed.'),
  summary: z.string().describe('A summary of the anomalies detected in the camera feed.'),
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(input: DetectAnomaliesInput): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an expert security analyst specializing in detecting anomalies from camera feeds.

You will analyze the camera feed and identify any anomalies such as smoke, fire, crowd surges, or unusual behavior.

Use the following camera feed as the primary source of information:

Camera Feed: {{media url=cameraFeedDataUri}}

Based on your analysis, provide a list of anomalies detected, their confidence levels, locations, and severity levels.
Also, provide a summary of the anomalies detected.

Output in JSON format.`,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

