'use server';

/**
 * @fileOverview An AI agent for generating photography service descriptions.
 *
 * - `generateServiceDescription`: Generates a description and features for a photography service.
 * - `GenerateServiceDescriptionInput`: Input type for the `generateServiceDescription` function.
 * - `GenerateServiceDescriptionOutput`: Return type for the `generateServiceDescription` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the photography service (e.g., "Wedding Package", "Portrait Session").'),
  keywords: z.string().optional().describe('Optional comma-separated keywords to guide the AI (e.g., "natural light, outdoor, candid").'),
});

export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling, professional description for the service.'),
  features: z.array(z.string()).describe('A list of 3-5 key features or deliverables for the service.'),
});

export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;

export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateServiceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: { schema: GenerateServiceDescriptionInputSchema },
  output: { schema: GenerateServiceDescriptionOutputSchema },
  prompt: `You are a professional copywriter for the clustergh photography website. Your task is to generate a compelling service description and a list of features for a photography package.

Service Title: {{{title}}}
{{#if keywords}}
Keywords: {{{keywords}}}
{{/if}}

Based on the title and keywords, generate the following:
1.  A professional and enticing 'description' for the service. It should be about 1-2 sentences long.
2.  A list of 3-5 key 'features' that would be included in this package. These should be concise and highlight the value to the client.

For example, if the title is "Newborn Photography", features could include "3-hour in-home session", "Access to props and wraps", "20 high-resolution edited images", and "Online viewing gallery".

Output your response in JSON format.
`,
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: GenerateServiceDescriptionInputSchema,
    outputSchema: GenerateServiceDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
