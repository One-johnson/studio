'use server';

/**
 * @fileOverview An AI agent for generating image titles and descriptions.
 *
 * - `generateCaption`: Generates a title and description for an image.
 * - `GenerateCaptionInput`: Input type for the `generateCaption` function.
 * - `GenerateCaptionOutput`: Return type for the `generateCaption` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be captioned, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateCaptionInput = z.infer<typeof GenerateCaptionInputSchema>;

const GenerateCaptionOutputSchema = z.object({
  title: z.string().describe('A creative and professional title for the image.'),
  description: z.string().describe('A brief, compelling description for the image.'),
});

export type GenerateCaptionOutput = z.infer<typeof GenerateCaptionOutputSchema>;

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  return generateCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPrompt',
  input: { schema: GenerateCaptionInputSchema },
  output: { schema: GenerateCaptionOutputSchema },
  prompt: `You are a professional photographer and content creator for the SnapVerse website. Your task is to analyze the provided image and generate a creative, professional title and a brief, compelling description for it.

The title should be evocative and catchy. The description should be 1-2 sentences and highlight the key elements or mood of the photograph.

Image: {{media url=photoDataUri}}`,
});

const generateCaptionFlow = ai.defineFlow(
  {
    name: 'generateCaptionFlow',
    inputSchema: GenerateCaptionInputSchema,
    outputSchema: GenerateCaptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
