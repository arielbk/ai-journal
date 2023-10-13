import EntryCard from '@/components/EntryCard';
import NewEntryCard from '@/components/NewEntryCard';
import Question from '@/components/Question';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { JournalEntry } from '@prisma/client';
import Link from 'next/link';

const getEntries = async () => {
  const user = await getUserByClerkID({});
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      analysis: true,
    },
  });
  return entries;
};

const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="min-h-full px-10 py-4 max-w-7xl">
      <Question />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
        <NewEntryCard />
        {entries.map((entry: JournalEntry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
