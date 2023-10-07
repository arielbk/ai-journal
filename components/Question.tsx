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
    <>
      <form className="flex w-full gap-4 py-6" onSubmit={handleSubmit}>
        <input
          disabled={loading}
          onChange={handleChange}
          type="text"
          placeholder="Ask a question"
          className="flex-1 rounded-lg border border-black/20 px-4 py-2 text-lg"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-blue-400 px-4 py-2 text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div>loading...</div>}
      {response && <div>{response}</div>}
    </>
  );
}

export default Question;
