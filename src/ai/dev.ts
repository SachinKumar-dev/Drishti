import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-incident.ts';
import '@/ai/flows/detect-anomalies.ts';