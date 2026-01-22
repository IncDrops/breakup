'use server';
/**
 * @fileOverview A breakup text generation AI agent.
 *
 * - generateBreakupText - A function that handles the breakup text generation process.
 * - GenerateBreakupTextInput - The input type for the generateBreakupText function.
 * - GenerateBreakupTextOutput - The return type for the generateBreakupText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBreakupTextInputSchema = z.object({
  reason: z.string().describe('The reason for the breakup.'),
  persona: z.enum(['toxic', 'hr']).describe('The persona to use for the breakup text.'),
});
export type GenerateBreakupTextInput = z.infer<typeof GenerateBreakupTextInputSchema>;

const GenerateBreakupTextOutputSchema = z.object({
  text_body: z.string().describe('The generated breakup text message.'),
  follow_up_tip: z.string().describe('A follow-up tip related to the breakup.'),
});
export type GenerateBreakupTextOutput = z.infer<typeof GenerateBreakupTextOutputSchema>;

export async function generateBreakupText(input: GenerateBreakupTextInput): Promise<GenerateBreakupTextOutput> {
  return generateBreakupTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBreakupTextPrompt',
  input: {schema: GenerateBreakupTextInputSchema},
  output: {schema: GenerateBreakupTextOutputSchema},
  prompt: `You are a breakup consultant. If persona is 'toxic', write a messy, manipulative text under 280 chars. If persona is 'hr', write a cold, formal termination notice under 280 chars. The reason for the breakup is: {{{reason}}}.`,
});

const generateBreakupTextFlow = ai.defineFlow(
  {
    name: 'generateBreakupTextFlow',
    inputSchema: GenerateBreakupTextInputSchema,
    outputSchema: GenerateBreakupTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
