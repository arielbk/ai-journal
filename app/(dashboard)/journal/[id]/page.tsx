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
  });
  return entry;
};

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id);

  const analysisData = [
    { name: 'Summary', value: '' },
    { name: 'Subject', value: '' },
    { name: 'Mood', value: '' },
    { name: 'Negative', value: false },
  ];

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className="bg-blue-300 px-6 py-10">
          <h3 className="text-2xl">Analysis</h3>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="px-2 py-4 text-lg font-semibold">
                  {item.name}
                </span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
