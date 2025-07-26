'use server';

/**
 * @fileOverview A crowd management AI agent that detects anomalies,
 * identifies appropriate emergency contacts, and dispatches alerts.
 *
 * - manageCrowdIncident - The main agentic flow.
 * - ManageCrowdIncidentInput - The input type for the agent.
 * - ManageCrowdIncidentOutput - The return type for the agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// //////////////////////////////////////////////////////////////////////////////
// Input and Output Schemas
// //////////////////////////////////////////////////////////////////////////////

const ManageCrowdIncidentInputSchema = z.object({
  cameraFeedDataUri: z
    .string()
    .describe(
      "A camera feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ManageCrowdIncidentInput = z.infer<
  typeof ManageCrowdIncidentInputSchema
>;

const ManageCrowdIncidentOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      type: z
        .string()
        .describe('The type of anomaly detected (e.g., smoke, fire, crowd surge).'),
      confidence: z
        .number()
        .describe('The confidence level of the anomaly detection (0-1).'),
      location: z
        .string()
        .describe('The location of the anomaly in the camera feed.'),
      severity: z
        .string()
        .describe('The severity level of the anomaly (e.g., low, medium, high).'),
    })
  ),
  alertsDispatched: z.array(
    z.object({
      contact: z.string().describe('The contact the alert was sent to.'),
      message: z.string().describe('The content of the alert message.'),
    })
  ).describe('A list of alerts that were dispatched.'),
  summary: z.string().describe('A summary of the incident and actions taken.'),
});
export type ManageCrowdIncidentOutput = z.infer<
  typeof ManageCrowdIncidentOutputSchema
>;

// //////////////////////////////////////////////////////////////////////////////
// Tools
// //////////////////////////////////////////////////////////////////////////////

const getEmergencyContacts = ai.defineTool(
  {
    name: 'getEmergencyContacts',
    description: 'Get a list of emergency contacts for a given incident type.',
    inputSchema: z.object({
      incidentType: z
        .string()
        .describe('The type of incident (e.g., "fire", "medical", "security").'),
    }),
    outputSchema: z.object({
      contacts: z.array(z.string()).describe('A list of contact emails or numbers.'),
    }),
  },
  async ({incidentType}) => {
    // In a real-world scenario, this would query a database or an external service.
    // For this demo, we'll return mock data.
    switch (incidentType.toLowerCase()) {
      case 'fire':
      case 'smoke':
        return {contacts: ['fire-dept@example.com', 'venue-safety@example.com']};
      case 'crowd surge':
      case 'security':
        return {contacts: ['security-team@example.com', 'police-liaison@example.com']};
      case 'medical':
        return {contacts: ['paramedics@example.com', 'medical-staff@example.com']};
      default:
        return {contacts: ['operations-center@example.com']};
    }
  }
);

const dispatchAlert = ai.defineTool(
  {
    name: 'dispatchAlert',
    description: 'Sends an alert to a specific contact.',
    inputSchema: z.object({
      contact: z.string().describe('The contact to send the alert to.'),
      message: z.string().describe('The message to send.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
  },
  async ({contact, message}) => {
    // In a real-world scenario, this would integrate with an alerting system
    // like Twilio, SendGrid, or PagerDuty.
    console.log(`ALERT DISPATCHED to ${contact}: ${message}`);
    return {success: true};
  }
);

// //////////////////////////////////////////////////////////////////////////////
// Prompt and Flow
// //////////////////////////////////////////////////////////////////////////////

const agenticPrompt = ai.definePrompt({
  name: 'crowdManagementAgentPrompt',
  input: {schema: ManageCrowdIncidentInputSchema},
  output: {schema: ManageCrowdIncidentOutputSchema},
  tools: [getEmergencyContacts, dispatchAlert],
  prompt: `You are an AI-powered crowd management agent. Your task is to analyze a camera feed for anomalies.

  1.  **Analyze the Feed**: First, carefully examine the provided camera feed for any anomalies like smoke, fire, crowd surges, or medical emergencies.
      - Camera Feed: {{media url=cameraFeedDataUri}}

  2.  **Take Action (If Anomalies Detected)**:
      - If you detect one or more anomalies, you MUST use the provided tools to formulate and execute a response plan.
      - For each distinct anomaly (e.g., a "fire" and a "crowd surge" are distinct), first use the \`getEmergencyContacts\` tool to identify the correct services to notify.
      - Then, for each contact identified, use the \`dispatchAlert\` tool to send a clear, concise, and actionable alert message. The message should include the anomaly type, severity, and location.

  3.  **Summarize**:
      - If anomalies were found, summarize the anomalies you detected and the actions you took (i.e., which alerts were dispatched).
      - If no anomalies are found, state that the situation is normal and no action was needed.

  Your final output must conform to the specified JSON schema.
  `,
});

const manageCrowdIncidentFlow = ai.defineFlow(
  {
    name: 'manageCrowdIncidentFlow',
    inputSchema: ManageCrowdIncidentInputSchema,
    outputSchema: ManageCrowdIncidentOutputSchema,
  },
  async (input) => {
    const {output} = await agenticPrompt(input);
    return output!;
  }
);


export async function manageCrowdIncident(
  input: ManageCrowdIncidentInput
): Promise<ManageCrowdIncidentOutput> {
  return manageCrowdIncidentFlow(input);
}
