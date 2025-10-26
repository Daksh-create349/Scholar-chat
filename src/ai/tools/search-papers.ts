'use server';
/**
 * @fileOverview A tool for searching for research papers.
 * 
 * - searchPapers - A Genkit tool that searches for research papers using an external API.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PaperSearchSchema = z.object({
    title: z.string(),
    authors: z.array(z.string()),
    url: z.string().url(),
    abstract: z.string(),
});

// New flow to handle the actual fetch call in an unrestricted environment
const searchSemanticScholar = ai.defineFlow(
  {
    name: 'searchSemanticScholar',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(PaperSearchSchema),
  },
  async (input) => {
    const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(input.query)}&fields=title,authors,abstract,url&limit=20`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        // Log the error but return empty array to prevent crashing the main flow
        console.error(`Semantic Scholar API request failed with status ${response.status}`);
        return [];
      }
      const data = await response.json();

      if (!data.data) {
        return [];
      }
      
      const results = data.data
        .filter((paper: any) => paper.title && paper.url && paper.abstract && paper.abstract.trim() !== '')
        .map((paper: any) => ({
          title: paper.title,
          authors: paper.authors ? paper.authors.map((author: any) => author.name) : [],
          url: paper.url,
          abstract: paper.abstract,
        }));

      return results;
    } catch (error) {
      console.error('Error fetching from Semantic Scholar API:', error);
      // Return an empty array or handle the error as appropriate
      return [];
    }
  }
);


export const searchPapers = ai.defineTool(
  {
    name: 'searchPapers',
    description: 'Searches for research papers based on a query.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(PaperSearchSchema),
  },
  async (input) => {
    console.log(`Delegating search for query: ${input.query}`);
    // The tool now calls the flow to perform the search
    return await searchSemanticScholar(input);
  }
);
