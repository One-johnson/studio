// This is a server-side file.
'use server';

/**
 * @fileOverview An AI-powered search agent for the photography portfolio.
 *
 * - `searchPhotos`: Finds photos that match a natural language query.
 * - `AiSearchInput`: Input type for the `searchPhotos` function.
 * - `AiSearchOutput`: Return type for the `searchPhotos` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSearchInputSchema = z.object({
  query: z.string().describe("The user's natural language search query."),
  photos: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .describe('The list of available photos to search through.'),
});

export type AiSearchInput = z.infer<typeof AiSearchInputSchema>;

const AiSearchOutputSchema = z.object({
  photoIds: z
    .array(z.string())
    .describe('An array of photo IDs that best match the search query, sorted by relevance.'),
});

export type AiSearchOutput = z.infer<typeof AiSearchOutputSchema>;

export async function searchPhotos(input: AiSearchInput): Promise<AiSearchOutput> {
  return aiSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchPrompt',
  input: { schema: AiSearchInputSchema },
  output: { schema: AiSearchOutputSchema },
  prompt: `You are an intelligent search assistant for the clustergh photography portfolio. Your task is to find photos that match the user's search query from the provided list of photos.

Analyze the user's query: {{{query}}}

Here is the list of available photos with their IDs and titles:
{{#each photos}}
- ID: {{id}}, Title: "{{title}}"
{{/each}}

Return an array of photo IDs that best match the query. The results should be relevant to the query's theme, objects, or concepts. For example, if the query is "peaceful water", photos with titles like "Ocean's Breath" or "Whispering Woods" (if it has a lake) would be good matches. Only return the IDs of the photos that exist in the provided list. If no photos match, return an empty array.

Output your response in JSON format.
`,
});

const aiSearchFlow = ai.defineFlow(
  {
    name: 'aiSearchFlow',
    inputSchema: AiSearchInputSchema,
    outputSchema: AiSearchOutputSchema,
  },
  async (input) => {
    // If the query is empty, return all photos
    if (!input.query.trim()) {
      return { photoIds: input.photos.map(p => p.id) };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
