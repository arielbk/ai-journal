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
    { name: 'Mood', value: mood },
    { name: 'Subject', value: subject },
    { name: 'Summary', value: summary },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ];

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div>loading...</div>}
        <textarea
          className="h-full w-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="col-span-1 border-l border-black/10">
        <div className={`px-6 py-10`} style={{ backgroundColor: color }}>
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

export default Editor;
