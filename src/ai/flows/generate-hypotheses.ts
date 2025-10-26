
'use server';

/**
 * @fileOverview An AI agent that analyzes research text to generate novel hypotheses.
 *
 * - generateHypotheses - A function that analyzes text to generate research questions and hypotheses.
 * - GenerateHypothesesInput - The input type for the generateHypotheses function.
 * - GenerateHypothesesOutput - The return type for the generateHypotheses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHypothesesInputSchema = z.object({
  researchText: z
    .string()
    .describe(
      "A block of text containing research abstracts, a summary of a field, or a description of a research area."
    ),
});
export type GenerateHypothesesInput = z.infer<typeof GenerateHypothesesInputSchema>;

const GenerateHypothesesOutputSchema = z.object({
    researchQuestions: z.array(z.string()).describe("A list of novel research questions based on potential gaps or unexplored areas in the provided text."),
    testableHypotheses: z.array(z.string()).describe("A list of specific, testable hypotheses that could be investigated in future research."),
});
export type GenerateHypothesesOutput = z.infer<typeof GenerateHypothesesOutputSchema>;

export async function generateHypotheses(
  input: GenerateHypothesesInput
): Promise<GenerateHypothesesOutput> {
  return generateHypothesesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHypothesesPrompt',
  input: {schema: GenerateHypothesesInputSchema},
  output: {schema: GenerateHypothesesOutputSchema},
  prompt: `You are an expert research scientist with a talent for identifying novel research directions. Your task is to analyze the provided research text and generate new ideas.

Based on the text below, identify:
1.  Potential gaps, unexplored intersections, or unanswered questions in the current literature.
2.  A list of novel research questions that arise from these gaps.
3.  A list of specific, testable hypotheses that could form the basis of a new study.

Aim for creativity and feasibility. The goal is to inspire the user's next research project.

Research Text:
{{{researchText}}}
`,
});

const generateHypothesesFlow = ai.defineFlow(
  {
    name: 'generateHypothesesFlow',
    inputSchema: GenerateHypothesesInputSchema,
    outputSchema: GenerateHypothesesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
