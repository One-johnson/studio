// This is a server-side file.
'use server';

/**
 * @fileOverview AI-powered theme customization flow for the SnapVerse website.
 *
 * - `customizeTheme`: Adjusts the color palette and fonts based on current design trends using AI.
 * - `ThemeCustomizationInput`: Input type for the `customizeTheme` function, defining the desired aesthetic.
 * - `ThemeCustomizationOutput`: Return type for the `customizeTheme` function, providing the updated theme configuration.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ThemeCustomizationInputSchema = z.object({
  primaryColor: z.string().describe('The primary color of the theme, in hex format (e.g., #4B0082).'),
  backgroundColor: z.string().describe('The background color of the theme, in hex format (e.g., #F0F0F0).'),
  accentColor: z.string().describe('The accent color of the theme, in hex format (e.g., #D8B4FE).'),
  headlineFont: z.string().describe('The name of the font for headlines (e.g., Belleza).'),
  bodyFont: z.string().describe('The name of the font for body text (e.g., Alegreya).'),
  styleDescription: z.string().optional().describe("Optional description of the desired website aesthetic, which will be used as additional prompt context."),
});

export type ThemeCustomizationInput = z.infer<typeof ThemeCustomizationInputSchema>;

const ThemeCustomizationOutputSchema = z.object({
  updatedPrimaryColor: z.string().describe('The AI-adjusted primary color in hex format.'),
  updatedBackgroundColor: z.string().describe('The AI-adjusted background color in hex format.'),
  updatedAccentColor: z.string().describe('The AI-adjusted accent color in hex format.'),
  updatedHeadlineFont: z.string().describe('The AI-adjusted headline font name.'),
  updatedBodyFont: z.string().describe('The AI-adjusted body font name.'),
  designNotes: z.string().describe('AI-generated notes and suggestions regarding the theme customization.'),
});

export type ThemeCustomizationOutput = z.infer<typeof ThemeCustomizationOutputSchema>;

export async function customizeTheme(input: ThemeCustomizationInput): Promise<ThemeCustomizationOutput> {
  return customizeThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'themeCustomizationPrompt',
  input: { schema: ThemeCustomizationInputSchema },
  output: { schema: ThemeCustomizationOutputSchema },
  prompt: `You are an AI-powered theme customization tool for the SnapVerse photography website. 

Based on current design trends and the following specifications, suggest adjustments to the color palette and fonts to create a modern and visually appealing website theme:

Primary Color: {{{primaryColor}}}
Background Color: {{{backgroundColor}}}
Accent Color: {{{accentColor}}}
Headline Font: {{{headlineFont}}}
Body Font: {{{bodyFont}}}
{{#if styleDescription}}
Style Description: {{{styleDescription}}}
{{/if}}

Provide the adjusted color palette (primary, background, and accent colors in hex format), updated font names for headlines and body text, and any relevant design notes.

Ensure the suggested theme is suitable for a photography portfolio website, emphasizing a clean, modern, and visually engaging design.

Output your values in JSON format.
`,  
});

const customizeThemeFlow = ai.defineFlow(
  {
    name: 'customizeThemeFlow',
    inputSchema: ThemeCustomizationInputSchema,
    outputSchema: ThemeCustomizationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
