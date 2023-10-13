import { qa } from '@/utils/ai';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { question } = await request.json();
  const user = await getUserByClerkID();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    include: {
      analysis: true,
    },
  });

  const answer = await qa(question, entries);

  return NextResponse.json({ data: answer });
};
