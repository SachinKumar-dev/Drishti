
'use server';

/**
 * @fileOverview An incident reporting AI agent that alerts security and escalates if necessary.
 *
 * - reportIncident - The main agentic flow for handling user-reported incidents.
 * - ReportIncidentInput - The input type for the agent.
 * - ReportIncidentOutput - The return type for the agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// //////////////////////////////////////////////////////////////////////////////
// Input and Output Schemas
// //////////////////////////////////////////////////////////////////////////////

const ReportIncidentInputSchema = z.object({
  userName: z.string().describe('The name of the person reporting the incident.'),
  incidentDetails: z.string().describe('The details of the incident being reported.'),
  location: z.string().describe('The location of the incident (can be coordinates or a description).'),
});
export type ReportIncidentInput = z.infer<typeof ReportIncidentInputSchema>;

const ReportIncidentOutputSchema = z.object({
  alertId: z.string().describe('A unique ID for the dispatched alert.'),
  escalationStatus: z.string().describe('The final status of the alert (e.g., "Acknowledged", "Escalated").'),
  summary: z.string().describe('A summary of the actions taken by the AI agent.'),
});
export type ReportIncidentOutput = z.infer<typeof ReportIncidentOutputSchema>;

// //////////////////////////////////////////////////////////////////////////////
// Tools
// //////////////////////////////////////////////////////////////////////////////

const dispatchSecurityAlert = ai.defineTool(
  {
    name: 'dispatchSecurityAlert',
    description: 'Dispatches an alert to the nearest security personnel and waits for acknowledgment.',
    inputSchema: z.object({
      location: z.string().describe('The location of the incident.'),
      details: z.string().describe('The details of the incident.'),
      userName: z.string().describe('The name of the reporter.'),
    }),
    outputSchema: z.object({
      alertId: z.string().describe('A unique ID for the alert.'),
      acknowledged: z.boolean().describe('Whether the security personnel acknowledged the alert within 5 minutes.'),
    }),
  },
  async ({ location, details, userName }) => {
    // This is a simulation. In a real application, this would:
    // 1. Find the nearest security personnel based on location.
    // 2. Send a push notification/alert to their device.
    // 3. Start a 5-minute timer.
    // 4. Return true if acknowledged, false if timed out.
    
    const alertId = `ALERT-${Date.now()}`;
    console.log(`DISPATCHING: Alert ${alertId} to security near ${location}.`);
    console.log(`DETAILS: ${details} (Reported by: ${userName})`);

    // Simulate the 5-minute wait. We'll use a random outcome for this demo.
    const acknowledged = Math.random() > 0.3; // 70% chance of acknowledgment
    
    if (acknowledged) {
        console.log(`SUCCESS: Alert ${alertId} was acknowledged by security.`);
    } else {
        console.log(`TIMEOUT: Alert ${alertId} was NOT acknowledged within 5 minutes.`);
    }

    return { alertId, acknowledged };
  }
);

const escalateToAdmin = ai.defineTool(
  {
    name: 'escalateToAdmin',
    description: 'Escalates an unacknowledged security alert to the admin/command center.',
    inputSchema: z.object({
      alertId: z.string().describe('The ID of the alert to escalate.'),
      details: z.string().describe('The details of the original incident.'),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ alertId, details }) => {
    // In a real application, this would send a high-priority alert to a central dashboard or admin.
    console.log(`ESCALATING: Alert ${alertId} is being escalated to the admin command center.`);
    console.log(`ESCALATION DETAILS: ${details}`);
    return { success: true };
  }
);

// //////////////////////////////////////////////////////////////////////////////
// Prompt and Flow
// //////////////////////////////////////////////////////////////////////////////

const incidentReportAgentPrompt = ai.definePrompt({
  name: 'incidentReportAgentPrompt',
  input: {schema: ReportIncidentInputSchema},
  output: {schema: ReportIncidentOutputSchema},
  tools: [dispatchSecurityAlert, escalateToAdmin],
  prompt: `You are an AI security dispatcher. A user has just reported an incident via a QR code scan.

  Your task is to:
  1.  **Dispatch an Immediate Alert**: Use the \`dispatchSecurityAlert\` tool with the user's name, location, and the incident details.
  2.  **Analyze the Acknowledgment**:
      - If the tool output indicates the alert was acknowledged (\`acknowledged: true\`), your job is done for the initial response.
      - If the alert was NOT acknowledged (\`acknowledged: false\`), you MUST immediately escalate the situation.
  3.  **Escalate if Necessary**: If escalation is required, use the \`escalateToAdmin\` tool, passing the original alert ID and details.
  4.  **Summarize Actions**: Provide a final summary of the steps you took. For example, "Security was alerted and acknowledged the incident," or "The initial alert was not acknowledged and has been escalated to the admin command center."

  User Name: {{{userName}}}
  Location: {{{location}}}
  Incident Details: {{{incidentDetails}}}
  
  Execute the plan and provide the final output in the specified JSON format.
  `,
});

const reportIncidentFlow = ai.defineFlow(
  {
    name: 'reportIncidentFlow',
    inputSchema: ReportIncidentInputSchema,
    outputSchema: ReportIncidentOutputSchema,
  },
  async (input) => {
    const {output} = await incidentReportAgentPrompt(input);
    return output!;
  }
);


export async function reportIncident(
  input: ReportIncidentInput
): Promise<ReportIncidentOutput> {
  return reportIncidentFlow(input);
}
