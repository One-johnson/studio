'use server';

/**
 * @fileOverview A content moderation AI agent for image analysis.
 *
 * - `moderateImage`: Analyzes an image to determine if it's appropriate for the platform.
 * - `ImageModerationInput`: Input type for the `moderateImage` function.
 * - `ImageModerationOutput`: Return type for the `moderateImage` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ImageModerationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be moderated, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type ImageModerationInput = z.infer<typeof ImageModerationInputSchema>;

const ImageModerationOutputSchema = z.object({
  isAppropriate: z.boolean().describe('Whether or not the image is appropriate for a professional photography portfolio.'),
  reason: z.string().optional().describe('The reason why the image was flagged as inappropriate. This will be empty if the image is appropriate.'),
});

export type ImageModerationOutput = z.infer<typeof ImageModerationOutputSchema>;

export async function moderateImage(input: ImageModerationInput): Promise<ImageModerationOutput> {
  return contentModerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentModerationPrompt',
  input: { schema: ImageModerationInputSchema },
  output: { schema: ImageModerationOutputSchema },
  prompt: `You are a content moderator for a professional photography website called clustergh. Your task is to analyze the provided image and determine if it is appropriate for a general audience and a professional portfolio.

The following content is considered inappropriate:
- Nudity or sexually explicit content
- Graphic violence or gore
- Hate speech or symbols
- Depictions of illegal activities

Analyze the image and set the 'isAppropriate' flag to false if it contains any inappropriate content. If you flag an image, provide a brief, professional reason in the 'reason' field. If the image is appropriate, set 'isAppropriate' to true and leave the reason empty.

Image: {{media url=photoDataUri}}`,
});

const contentModerationFlow = ai.defineFlow(
  {
    name: 'contentModerationFlow',
    inputSchema: ImageModerationInputSchema,
    outputSchema: ImageModerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
