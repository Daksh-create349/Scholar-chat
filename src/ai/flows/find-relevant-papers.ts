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
      abstract: z.string().describe('A concise abstract of the paper.'),
      url: z.string().url().describe('URL of the research paper.'),
      authors: z.array(z.string()).optional().describe('The authors of the paper.'),
    })
  ).describe('A list of relevant research papers.'),
});
export type FindRelevantPapersOutput = z.infer<typeof FindRelevantPapersOutputSchema>;

export async function findRelevantPapers(input: FindRelevantPapersInput): Promise<FindRelevantPapersOutput> {
  return findRelevantPapersFlow(input);
}

const findRelevantPapersFlow = ai.defineFlow(
  {
    name: 'findRelevantPapersFlow',
    inputSchema: FindRelevantPapersInputSchema,
    outputSchema: FindRelevantPapersOutputSchema,
  },
  async (input) => {
    // Directly call the searchPapers tool with the input keywords
    const searchResults = await searchPapers({ query: input.keywords });

    // Format the tool's output to match the flow's output schema
    const papers = searchResults.map(paper => ({
      title: paper.title,
      abstract: paper.abstract,
      url: paper.url,
      authors: paper.authors,
    }));

    return { papers };
  }
);
