import { Prisma } from '@prisma/client';

const EntryCard = ({
  entry,
}: {
  entry: Prisma.JournalEntryGetPayload<{ include: { analysis: true } }>;
}) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div
      className={`white flex h-full flex-col overflow-hidden rounded-t-lg border-b-2 bg-zinc-800 shadow`}
      style={{
        borderColor: entry.analysis?.color,
      }}
    >
      <div className="bg-zinc-900 px-4 py-5 text-white">{date}</div>
      <div className="flex-1 px-4 py-5">{entry.analysis?.summary}</div>
      <div className="bg-zinc-900 px-4 py-4 font-semibold capitalize">
        {entry.analysis?.mood}
      </div>
    </div>
  );
};

export default EntryCard;
