'use client';

import { createNewEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';

function NewEntryCard() {
  const router = useRouter();

  const handleClick = async () => {
    const data = await createNewEntry();
    router.push(`/journal/${data.id}`);
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={handleClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  );
}

export default NewEntryCard;
