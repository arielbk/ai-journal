import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-[600px]">
        <h1 className="mb-2 text-6xl">Ocean</h1>
        <p className="mb-12 text-2xl text-white/60">
          Track your mood automatically over time automatically with the power
          of AI
        </p>
        <div>
          <Link
            className="rounded-lg bg-blue-500 px-4 py-2 text-xl transition-colors hover:bg-blue-400"
            href="/journal"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
