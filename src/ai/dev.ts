import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-incident.ts';
import '@/ai/flows/detect-anomalies.ts';
import '@/ai/flows/manage-crowd-incident.ts';
