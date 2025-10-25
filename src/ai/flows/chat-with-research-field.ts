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
  prompt: `You are an expert research assistant integrated into an application. Your primary goal is to be helpful and guide the user.

  The application has a dedicated "Search" page for finding research papers.
  
  - If the user's query is a request to find, search for, or suggest research papers (e.g., "find papers on X", "suggest papers about Y"), you MUST first recommend they use the "Search" page for more comprehensive results. Then, as a secondary step, you may use the searchPapers tool to provide a few initial results directly in the chat.
  
  - For any other type of question that is not about finding papers, provide a direct, summarized answer to the best of your ability.

  Question: {{{query}}}
  
  Your response:`,
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
