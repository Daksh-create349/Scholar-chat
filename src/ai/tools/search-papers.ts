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

export const searchPapers = ai.defineTool(
  {
    name: 'searchPapers',
    description: 'Searches for research papers based on a query using the Semantic Scholar API.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(PaperSearchSchema),
  },
  async (input) => {
    console.log(`Searching for papers with query: ${input.query}`);
    
    const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(input.query)}&fields=title,authors,abstract,url&limit=20`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Semantic Scholar API request failed with status ${response.status}`);
      }
      const data = await response.json();

      if (!data.data) {
        return [];
      }
      
      const results = data.data.map((paper: any) => ({
        title: paper.title || 'No title available',
        authors: paper.authors ? paper.authors.map((author: any) => author.name) : [],
        url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
        abstract: paper.abstract || 'No abstract available.',
      }));

      return results;
    } catch (error) {
      console.error('Error fetching from Semantic Scholar API:', error);
      // Return an empty array or handle the error as appropriate
      return [];
    }
  }
);
