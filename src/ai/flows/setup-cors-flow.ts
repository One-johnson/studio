// This is a server-side file.
'use server';

/**
 * @fileOverview A flow for configuring CORS on a Google Cloud Storage bucket.
 *
 * - `setupCors`: Applies CORS configuration to the specified bucket.
 * - `SetupCorsInput`: Input type for the `setupCors` function.
 * - `SetupCorsOutput`: Return type for the `setupCors` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GoogleAuth } from 'google-auth-library';

const SetupCorsInputSchema = z.object({
    bucketName: z.string().describe("The name of the Google Cloud Storage bucket (e.g., 'my-bucket')."),
    origin: z.string().describe("The origin URL to allow requests from (e.g., 'https://my-app.com')."),
});

export type SetupCorsInput = z.infer<typeof SetupCorsInputSchema>;

const SetupCorsOutputSchema = z.object({
  success: z.boolean().describe('Whether the CORS configuration was applied successfully.'),
  message: z.string().describe('A message indicating the result of the operation.'),
});

export type SetupCorsOutput = z.infer<typeof SetupCorsOutputSchema>;

export async function setupCors(input: SetupCorsInput): Promise<SetupCorsOutput> {
  return setupCorsFlow(input);
}

const setupCorsFlow = ai.defineFlow(
  {
    name: 'setupCorsFlow',
    inputSchema: SetupCorsInputSchema,
    outputSchema: SetupCorsOutputSchema,
  },
  async ({ bucketName, origin }) => {
    try {
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();

      const corsConfiguration = [
        {
          "origin": [origin],
          "method": ["GET", "PUT", "POST", "DELETE"],
          "responseHeader": ["Content-Type", "access-control-allow-origin"],
          "maxAgeSeconds": 3600
        }
      ];

      const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}?fields=cors`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cors: corsConfiguration }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('CORS setup failed:', response.status, errorBody);
        throw new Error(`Failed to set CORS configuration. Status: ${response.status}. Body: ${errorBody}`);
      }

      return { success: true, message: `CORS configuration updated successfully for bucket ${bucketName}.` };
    } catch (error: any) {
      console.error('Error setting up CORS:', error);
      return { success: false, message: error.message || "An unknown error occurred during CORS setup." };
    }
  }
);
