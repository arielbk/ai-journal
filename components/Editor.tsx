'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { Autosave, useAutosave } from 'react-autosave';

const Editor = ({ entry }) => {
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

  const { mood, subject, summary, negative, color } = analysis;
  const analysisData = [
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    // { name: 'Summary', value: summary },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-ss-lg">
      {/* analysis */}
      <div className="w-full border-l border-white/10 bg-zinc-800">
        <div>
          <ul className="flex">
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-2 border-b border-t border-black/10 px-6 py-4"
              >
                <span className="text-m font-semibold">{item.name}</span>
                <span className="text-right text-white">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`h-1`} style={{ backgroundColor: color }}>
          {isLoading && <div>loading...</div>}
        </div>
      </div>

      <div className="">
        <textarea
          className="h-full w-full resize-none  bg-black p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Editor;
