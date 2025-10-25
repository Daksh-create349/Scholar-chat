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
    description: 'Searches for research papers based on a query.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(PaperSearchSchema),
  },
  async (input) => {
    // In a real application, you would use a service like Semantic Scholar, arXiv API, etc.
    // For this example, we'll simulate a search.
    console.log(`Searching for papers with query: ${input.query}`);
    
    // This is a simplified mock response.
    const mockResults = [
        {
            title: 'Attention Is All You Need',
            authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
            url: 'https://arxiv.org/abs/1706.03762',
            abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks... We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
        },
        {
            title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
            authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
            url: 'https://arxiv.org/abs/1810.04805',
            abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text...',
        }
    ];

    // Filter results based on query for a more realistic simulation
    const filteredResults = mockResults.filter(paper => 
        paper.title.toLowerCase().includes(input.query.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(input.query.toLowerCase())
    );

    return filteredResults.length > 0 ? filteredResults : mockResults;
  }
);
