import { loadQARefineChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import z from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('The mood of the journal entry author.'),
    subject: z.string().describe('A subject for the journal entry.'),
    summary: z.string().describe('A short summary of the journal entry.'),
    negative: z
      .boolean()
      .describe('Whether the journal entry contains negative emotions.'),
    color: z
      .string()
      .describe('A hex color code to represent the vibe of the entry.'),
  }),
);

const getPrompt = async (content: string) => {
  const formattedInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Always format your response to match the format instructions. \n{formattedInstructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { formattedInstructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyze = async (content: string) => {
  const input = await getPrompt(content);
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  const result = await model.call(input);

  try {
    return parser.parse(result);
  } catch (err) {
    console.error(err);
  }
};

// here we create the vector in memory every time a question is asked
// todo: every time a journal is added or modified, store it in a vector db also
export const qa = async (question, entries) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  const chain = new loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);

  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
