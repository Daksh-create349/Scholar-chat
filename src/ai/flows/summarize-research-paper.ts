'use server';
/**
 * @fileOverview An AI agent that summarizes a research paper.
 *
 * - summarizeResearchPaper - A function that handles the research paper summarization process.
 * - SummarizeResearchPaperInput - The input type for the summarizeResearchPaper function.
 * - SummarizeResearchPaperOutput - The return type for the summarizeResearchPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResearchPaperInputSchema = z.object({
  paperText: z
    .string()
    .describe("The text content (e.g., abstract) of the research paper to be summarized."),
});
export type SummarizeResearchPaperInput = z.infer<typeof SummarizeResearchPaperInputSchema>;

const SummarizeResearchPaperOutputSchema = z.object({
  keyFindings: z.array(z.string()).describe("A list of the most important findings or results from the paper."),
  implications: z.array(z.string()).describe("A list of the potential implications or significance of the research."),
});
export type SummarizeResearchPaperOutput = z.infer<typeof SummarizeResearchPaperOutputSchema>;

export async function summarizeResearchPaper(input: SummarizeResearchPaperInput): Promise<SummarizeResearchPaperOutput> {
  return summarizeResearchPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResearchPaperPrompt',
  input: {schema: SummarizeResearchPaperInputSchema},
  output: {schema: SummarizeResearchPaperOutputSchema},
  prompt: `You are an expert research analyst tasked with extracting insights from a research paper's abstract.

  Based on the following text, identify:
  1. The key findings or results of the study.
  2. The potential implications or significance of the work.
  
  Present your answer as two distinct lists.

  Research Paper Text: {{{paperText}}}`,
});

const summarizeResearchPaperFlow = ai.defineFlow(
  {
    name: 'summarizeResearchPaperFlow',
    inputSchema: SummarizeResearchPaperInputSchema,
    outputSchema: SummarizeResearchPaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
