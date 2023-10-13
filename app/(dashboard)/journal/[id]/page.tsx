import Editor from '@/components/Editor';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getEntry = async (id: string) => {
  const user = await getUserByClerkID();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      analysis: true,
    },
  });
  return entry;
};

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id);

  return (
    <div className="min-h-full w-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
