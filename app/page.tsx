import { auth } from '@clerk/nextjs';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  let href = userId ? '/journal' : '/new-user';

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white">
      <video
        src="https://www.shutterstock.com/shutterstock/videos/1092713723/preview/stock-footage-amazing-top-down-aerial-view-of-the-powerful-deep-blue-ocean-waves-during-the-monsoon-season.webm"
        className="absolute z-0 min-h-full w-auto min-w-full max-w-none"
        autoPlay
        muted
        loop
      />
      <div className="absolute z-0 min-h-full w-auto min-w-full max-w-none bg-black/90" />
      <main className="z-10 w-full max-w-[600px]">
        <h1 className="hover:drop-shadow-glow mb-4 text-7xl font-light">
          Ocean
        </h1>
        <h2 className="mb-16 text-2xl font-light text-white/60">
          Discover patterns, gain insights, and build a happier, more balanced
          life
        </h2>
        <Link
          className="hover:drop-shadow-glow rounded-lg bg-blue-500  px-5 py-3 text-xl font-light transition-all hover:bg-blue-400"
          href={href}
        >
          Get started
        </Link>
      </main>
    </div>
  );
}
