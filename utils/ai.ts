import { Analysis, JournalEntry } from '@prisma/client';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import {
  RunnablePassthrough,
  RunnableSequence,
} from 'langchain/schema/runnable';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import z from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .min(-10)
      .max(10)
      .describe(
        'sentiment of the entry from -10 to 10, where -10 is extremely negative, and 10 is extremely positive',
      ),
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

export const qa = async (
  question: string,
  entries: (JournalEntry & { analysis: Analysis | null })[],
) => {
  // initialise the llm
  const model = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' });
  const docs = entries
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0;
    })
    .map((entry) => {
      return new Document({
        pageContent: entry.content,
        metadata: {
          id: entry.id,
          createdAt: entry.createdAt,
          subject: entry.analysis?.subject,
        },
      });
    });
  const serializeDocs = (docs: Array<Document>) =>
    docs
      .map((doc) => `Date: ${doc.metadata.createdAt}\n\n${doc.pageContent}`)
      .join('\n\n------\n\n');

  // create a vector store from the docs
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
  );
  const vectorStoreRetriever = vectorStore.asRetriever();

  // create a system and human prompt
  const SYSTEM_TEMPLATE = `Use the following of my journal entries to answer the question at the end.
If you don't know the answer or do not have an asnwer, just say that you don't know, don't try to make up an answer.
You will only get the relevant entries so do no refer to 'first' or 'second' entries.
If possible, mention the specific date of the entry you refer to.
------
{context}`;
  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate('{question}'),
  ];
  const prompt = ChatPromptTemplate.fromMessages(messages);

  // sequential chain
  const chain = RunnableSequence.from([
    {
      // Extract the "question" field from the input object and pass it to the retriever as a string
      sourceDocuments: RunnableSequence.from([
        (input) => input.question,
        vectorStoreRetriever,
      ]),
      question: (input) => input.question || 'I do not have a question',
    },
    {
      // Pass the source documents through unchanged so that we can return them directly in the final result
      sourceDocuments: (previousStepResult) =>
        previousStepResult.sourceDocuments,
      question: (previousStepResult) => previousStepResult.question,
      context: (previousStepResult) =>
        serializeDocs(previousStepResult.sourceDocuments),
    },
    {
      result: prompt.pipe(model).pipe(new StringOutputParser()),
      sourceDocuments: (previousStepResult) =>
        previousStepResult.sourceDocuments,
    },
  ]);

  const answer = await chain.invoke({ question });
  const relevantEntries = answer.sourceDocuments.map((doc: Document) => ({
    id: doc.metadata.id,
    createdAt: doc.metadata.createdAt,
    subject: doc.metadata.subject,
  }));
  return { answer: answer.result, relevantEntries };
};
