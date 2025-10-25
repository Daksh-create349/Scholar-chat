
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
  visualizationData: z.string().optional().describe('Data for visualizing the trends, as a JSON string for a bar chart. The JSON should be an array of objects, each with a "topic" (string) and "count" (number) property. For example: [{"topic": "NLP", "count": 120}]'),
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

Analyze the papers and identify key trends, common themes, and potential connections between the research areas. Provide a summary of your analysis. Also, generate a JSON string for a bar chart that shows the frequency of the top 5-7 most important topics or keywords you identified. The JSON should be an array of objects, each with a "topic" and "count" property. Focus on identifying promising areas for future research.

`,
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
