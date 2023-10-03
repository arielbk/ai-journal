'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { Autosave, useAutosave } from 'react-autosave';

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);

  useAutosave({
    data: value,
    onSave: async (_value: string) => {
      setIsLoading(true);
      const updated = await updateEntry(entry.id, _value);
      setIsLoading(false);
    },
    interval: 2000,
  });
  return (
    <div className="h-full w-full">
      {isLoading && <div>loading...</div>}
      <textarea
        className="h-full w-full p-8 text-xl outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Editor;
