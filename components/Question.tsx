'use client';

import { askQuestion } from '@/utils/api';
import Link from 'next/link';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';

function Question() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    answer: string;
    relevantEntries: { createdAt: Date; id: string; subject: string }[];
  }>();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await askQuestion(value);
      setResponse(res);
    } catch (err) {
      console.error(err);
    }
    setValue('');
    setLoading(false);
  };

  console.log(response?.relevantEntries);

  return (
    <div className="mb-8">
      <form className="flex w-full gap-3 py-6" onSubmit={handleSubmit}>
        <input
          disabled={loading}
          onChange={handleChange}
          type="text"
          placeholder="Ask a question"
          className="flex-1 rounded-lg border border-black/20 bg-zinc-800 px-4 py-2 text-lg text-white"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-blue-500 px-5 py-3  text-xl font-light text-white transition-all hover:bg-blue-400 hover:drop-shadow-glow disabled:bg-zinc-800"
        >
          Ask
        </button>
      </form>
      {(response || loading) && (
        <div className="mb-8 rounded-lg border border-gray-800 bg-zinc-900 px-6 py-4 text-sm">
          {loading ? (
            'Scanning...'
          ) : (
            <div>
              <p>{response?.answer}</p>
              <h4 className="mb-3 mt-4 text-lg font-semibold text-white">
                Sources
              </h4>
              <ul className="flex flex-col">
                {response?.relevantEntries.map((doc) => (
                  <li key={doc.id} className="mb-2 inline-block">
                    <Link
                      href={`/${doc.id}`}
                      key={doc.id}
                      className="underline hover:text-blue-400"
                    >
                      {doc.subject}
                    </Link>
                    <span className="ml-2 text-zinc-500">
                      - {new Date(doc.createdAt).toLocaleDateString('hr')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Question;
