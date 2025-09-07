'use server';
/**
 * @fileOverview An AI agent for generating blog post content.
 *
 * - generateBlogPost - A function that handles the blog post generation process.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the blog post.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo to inspire the blog post, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the blog post.'),
  slug: z.string().describe('A URL-friendly slug for the blog post (e.g., "my-awesome-post").'),
  content: z.string().describe('The full content of the blog post, formatted in HTML.'),
  excerpt: z.string().describe('A short, compelling summary of the blog post (1-2 sentences).'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `You are an expert copywriter and blogger for a professional photography website called SnapVerse. Your task is to write a compelling blog post based on the provided topic.

Topic: {{{topic}}}
{{#if photoDataUri}}
Inspiration Image: {{media url=photoDataUri}}
Use the image as the primary inspiration for the tone, mood, and subject of the post.
{{/if}}

Please generate the following:
1.  A creative and SEO-friendly 'title' for the blog post.
2.  A URL-friendly 'slug'.
3.  A short, engaging 'excerpt' (1-2 sentences).
4.  The full 'content' of the blog post. The content should be well-structured, at least 3 paragraphs long, and formatted in HTML. Use tags like <h2> for subheadings and <p> for paragraphs.

The tone should be professional yet approachable, appealing to potential photography clients. Write with passion and expertise about the art of photography.

Output your response in JSON format.
`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
