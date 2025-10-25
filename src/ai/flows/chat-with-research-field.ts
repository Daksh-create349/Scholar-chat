// src/ai/flows/chat-with-research-field.ts
'use server';
/**
 * @fileOverview An AI agent to chat with a research field and provide summarized, up-to-date answers.
 *
 * - chatWithResearchField - A function that handles the conversation with a research field.
 * - ChatWithResearchFieldInput - The input type for the chatWithResearchField function.
 * - ChatWithResearchFieldOutput - The return type for the chatWithResearchField function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchPapers } from '../tools/search-papers';

const ChatWithResearchFieldInputSchema = z.object({
  query: z.string().describe('The question about the research field.'),
});
export type ChatWithResearchFieldInput = z.infer<typeof ChatWithResearchFieldInputSchema>;

const ChatWithResearchFieldOutputSchema = z.object({
  answer: z.string().describe('The summarized and up-to-date answer to the question.'),
});
export type ChatWithResearchFieldOutput = z.infer<typeof ChatWithResearchFieldOutputSchema>;

export async function chatWithResearchField(input: ChatWithResearchFieldInput): Promise<ChatWithResearchFieldOutput> {
  return chatWithResearchFieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithResearchFieldPrompt',
  input: {schema: ChatWithResearchFieldInputSchema},
  output: {schema: ChatWithResearchFieldOutputSchema},
  tools: [searchPapers],
  prompt: `You are an expert in research and can provide summarized, up-to-date answers to questions about any research field.

  If the user asks you to find or suggest research papers, you should tell them that you can search for them and that they can also use the "Search" page for more detailed results. Then, use the searchPapers tool to find relevant papers and present them.
  
  For all other questions, provide a direct, summarized answer.

  Question: {{{query}}}

  Answer: `,
});

const chatWithResearchFieldFlow = ai.defineFlow(
  {
    name: 'chatWithResearchFieldFlow',
    inputSchema: ChatWithResearchFieldInputSchema,
    outputSchema: ChatWithResearchFieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
