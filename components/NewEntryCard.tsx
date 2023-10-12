'use client';

import { createNewEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function NewEntryCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const data = await createNewEntry();
    setLoading(false);
    router.push(`/journal/${data.id}`);
  };

  return (
    <button
      className="cursor-pointer overflow-hidden rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-4 transition-colors hover:bg-zinc-900"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        'Creating...'
      ) : (
        <div className="my-4 text-9xl text-zinc-500">+</div>
      )}
    </button>
  );
}

export default NewEntryCard;
