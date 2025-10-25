'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding relevant research papers based on keywords.
 *
 * It includes:
 * - `findRelevantPapers`: An exported function that accepts keywords and returns a list of relevant research papers.
 * - `FindRelevantPapersInput`: The input type for the `findRelevantPapers` function, which is a set of keywords.
 * - `FindRelevantPapersOutput`: The output type for the `findRelevantPapers` function, which is a list of paper summaries.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchPapers } from '../tools/search-papers';

const FindRelevantPapersInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords related to the research interest.'),
});
export type FindRelevantPapersInput = z.infer<typeof FindRelevantPapersInputSchema>;

const FindRelevantPapersOutputSchema = z.object({
  papers: z.array(
    z.object({
      title: z.string().describe('The title of the research paper.'),
      summary: z.string().describe('A concise summary of the paper.'),
      url: z.string().url().describe('URL of the research paper.'),
      authors: z.array(z.string()).optional().describe('The authors of the paper.'),
    })
  ).describe('A list of relevant research papers.'),
});
export type FindRelevantPapersOutput = z.infer<typeof FindRelevantPapersOutputSchema>;

export async function findRelevantPapers(input: FindRelevantPapersInput): Promise<FindRelevantPapersOutput> {
  return findRelevantPapersFlow(input);
}

const findRelevantPapersPrompt = ai.definePrompt({
  name: 'findRelevantPapersPrompt',
  input: {schema: FindRelevantPapersInputSchema},
  output: {schema: FindRelevantPapersOutputSchema},
  tools: [searchPapers],
  prompt: `You are an AI research assistant. Your task is to find relevant research papers based on the keywords provided by the user.

  Instructions:
  1. Use the searchPapers tool to search for research papers and articles online based on the given keywords.
  2. For each paper found, extract the title, a concise summary, the URL, and the authors.
  3. Return a JSON array of research papers, each with the fields: title, summary, url, and authors.

  Keywords: {{{keywords}}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const findRelevantPapersFlow = ai.defineFlow(
  {
    name: 'findRelevantPapersFlow',
    inputSchema: FindRelevantPapersInputSchema,
    outputSchema: FindRelevantPapersOutputSchema,
  },
  async input => {
    const {output} = await findRelevantPapersPrompt(input);
    return output!;
  }
);
