'use server';

/**
 * @fileOverview Analyzes a collection of research papers to identify emerging trends and connections.
 *
 * - analyzeTrendsInPapers - A function that analyzes research papers and visualizes trends.
 * - AnalyzeTrendsInPapersInput - The input type for the analyzeTrendsInPapers function.
 * - AnalyzeTrendsInPapersOutput - The return type for the analyzeTrendsInPapers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrendsInPapersInputSchema = z.object({
  papers: z
    .array(
      z.object({
        title: z.string().describe('The title of the research paper.'),
        abstract: z.string().describe('The abstract of the research paper.'),
        citations: z.number().optional().describe('The number of citations the paper has.'),
        publicationDate: z.string().optional().describe('The publication date of the paper.'),
        authors: z.array(z.string()).optional().describe('The authors of the paper.'),
      })
    )
    .describe('A collection of research papers to analyze.'),
});

export type AnalyzeTrendsInPapersInput = z.infer<typeof AnalyzeTrendsInPapersInputSchema>;

const AnalyzeTrendsInPapersOutputSchema = z.object({
  trendAnalysis: z.string().describe('An analysis of the emerging trends and connections between the research papers.'),
  visualizationData: z.string().optional().describe('Data for visualizing the trends, such as a JSON format for a graph.'),
});

export type AnalyzeTrendsInPapersOutput = z.infer<typeof AnalyzeTrendsInPapersOutputSchema>;

export async function analyzeTrendsInPapers(
  input: AnalyzeTrendsInPapersInput
): Promise<AnalyzeTrendsInPapersOutput> {
  return analyzeTrendsInPapersFlow(input);
}

const analyzeTrendsInPapersPrompt = ai.definePrompt({
  name: 'analyzeTrendsInPapersPrompt',
  input: {schema: AnalyzeTrendsInPapersInputSchema},
  output: {schema: AnalyzeTrendsInPapersOutputSchema},
  prompt: `You are an expert research analyst. Given a collection of research papers, you will identify emerging trends and connections between them.

Papers:
{{#each papers}}
Title: {{this.title}}
Abstract: {{this.abstract}}
{{#if this.citations}}Citations: {{this.citations}}{{/if}}
{{#if this.publicationDate}}Publication Date: {{this.publicationDate}}{{/if}}
{{#if this.authors}}Authors: {{this.authors}}{{/if}}
---
{{/each}}

Analyze the papers and identify key trends, common themes, and potential connections between the research areas. Provide a summary of your analysis and, if possible, suggest a format for visualizing these trends (e.g., a graph structure in JSON format where nodes are papers and edges represent connections). Focus on identifying promising areas for future research.

Format your output as follows:
Trend Analysis: [your analysis here]
Visualization Data: [JSON data for visualization, if applicable]`,
});

const analyzeTrendsInPapersFlow = ai.defineFlow(
  {
    name: 'analyzeTrendsInPapersFlow',
    inputSchema: AnalyzeTrendsInPapersInputSchema,
    outputSchema: AnalyzeTrendsInPapersOutputSchema,
  },
  async input => {
    const {output} = await analyzeTrendsInPapersPrompt(input);
    return output!;
  }
);
