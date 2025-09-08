import { config } from 'dotenv';
config();

import '@/ai/flows/content-moderation-flow.ts';
import '@/ai/flows/generate-caption-flow.ts';
import '@/ai/flows/ai-search-flow.ts';
import '@/ai/flows/generate-service-description-flow.ts';
