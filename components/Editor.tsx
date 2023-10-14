'use client';

import { updateEntry } from '@/utils/api';
import { Prisma } from '@prisma/client';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';

const Loader = () => {
  return (
    <div role="status">
      <div className="border-3 h-8 w-8 rounded-full border-t-blue-500" />
    </div>
  );
};

const Editor = ({
  entry,
}: {
  entry: Prisma.JournalEntryGetPayload<{ include: { analysis: true } }>;
}) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  useAutosave({
    data: value,
    onSave: async (_value: string) => {
      setIsLoading(true);
      const data = await updateEntry(entry.id, _value);
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
    interval: 2000,
  });

  const analysisData = [
    { name: 'Subject', value: analysis?.subject },
    { name: 'Mood', value: analysis?.mood },
    { name: 'Negative', value: analysis?.negative ? 'True' : 'False' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-ss-lg bg-zinc-950">
      {/* analysis */}
      <div className="w-full border-l border-white/10 bg-zinc-800">
        <ul className="flex">
          {analysisData.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-2 border-b border-t border-black/10 px-6 py-4"
            >
              <span className="text-m font-semibold text-zinc-400">
                {item.name}
              </span>
              <span className="text-right text-white">{item.value}</span>
            </li>
          ))}
        </ul>
        {!isLoading && (
          <div className="absolute right-2 top-3">
            <Loader />
          </div>
        )}
        <div className={`h-1`} style={{ backgroundColor: analysis?.color }} />
      </div>

      <textarea
        className="h-full w-full max-w-4xl resize-none bg-zinc-950 p-8 text-xl text-gray-200 outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Editor;
