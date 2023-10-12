'use client';

import { askQuestion } from '@/utils/api';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';

function Question() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const answer = await askQuestion(value);
    setResponse(answer);
    setValue('');
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <form className="flex w-full gap-2 py-6" onSubmit={handleSubmit}>
        <input
          disabled={loading}
          onChange={handleChange}
          type="text"
          placeholder="Ask a question"
          className="flex-1 rounded-lg border border-black/20 bg-zinc-800 px-4 py-2 text-lg text-white"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-blue-500 px-4 py-2 text-lg text-white disabled:bg-zinc-800"
        >
          Ask
        </button>
      </form>
      {(response || loading) && (
        <div className="mb-8 rounded-lg border border-gray-800 px-6 py-4 text-sm">
          {loading ? 'Thinking...' : response}
        </div>
      )}
    </div>
  );
}

export default Question;
