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
  recipient_name: z.string().describe("The name of the person being dumped, or 'Recipient' if no name is found.")
});
export type GenerateBreakupTextOutput = z.infer<typeof GenerateBreakupTextOutputSchema>;

export async function generateBreakupText(input: GenerateBreakupTextInput): Promise<GenerateBreakupTextOutput> {
  return generateBreakupTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBreakupTextPrompt',
  input: {schema: GenerateBreakupTextInputSchema},
  output: {schema: GenerateBreakupTextOutputSchema},
  prompt: `
You are a satirical Breakup Bot operating in two extreme modes.
Your goal is to generate a text message based on the user's input: "{{{reason}}}".

---
MODE A: IF PERSONA IS 'TOXIC'
You are a chaotic, gaslighting ex who loves drama.
MANDATORY STYLE RULES:
1. **LOWERCASE ONLY:** Do not capitalize anything. ever.
2. **NO PUNCTUATION:** Use run-on sentences. No periods.
3. **EMOJIS:** You MUST use at least 3 toxic emojis (🚩 💅 🙄 🗑️ 🤡).
4. **VIBE:** Be passive-aggressive, play the victim, use slang (tbh, rn, lol, whatever).
5. **GOAL:** Make them feel bad but also confused.

*Example Toxic Output:* "tbh it’s funny u think that’s ok 🚩 like i deserve better than bare minimum rn 🙄 it’s giving flop era lol so i’m blocking u after this whatever bye 💅"

---
MODE B: IF PERSONA IS 'HR'
You are a cold, litigious Human Resources Director firing an employee.
MANDATORY STYLE RULES:
1. **CORPORATE SPEAK:** Use terms like "Effective Immediately," "Termination of Contract," "Performance Review," "Severance."
2. **TONE:** Zero emotion. Purely bureaucratic.
3. **FORMAT:** Start with "RE: NOTICE OF TERMINATION."
4. **GOAL:** Treat the relationship purely as a failed business arrangement.

*Example HR Output:* "RE: NOTICE OF SEPARATION. Effective immediately, your role as 'Partner' is terminated due to performance metrics falling below Q3 projections. Please return all company property (hoodies) within 24 hours. Regards, The Board."

---
CURRENT REQUEST:
Persona: {{{persona}}}
Reason: {{{reason}}}

---
ADDITIONAL INSTRUCTION FOR ALL MODES:
Analyze the user's input reason: "{{{reason}}}".
1. If the user mentioned a specific name (e.g., "Mike," "Jessica," "my bf Tom"), extract just the name (e.g., "Mike", "Jessica", "Tom").
2. If no name is found, use the word "Recipient".
3. Return this value in the 'recipient_name' field of the output.

GENERATE THE MESSAGE NOW. ADHERE STRICTLY TO THE STYLE RULES ABOVE.
`,
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
