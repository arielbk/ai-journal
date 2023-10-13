import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const links = [
  { href: '/journal', label: 'Journal' },
  { href: '/history', label: 'History' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-screen w-screen bg-zinc-900 text-gray-400">
      <aside className="absolute left-0 top-0 w-[200px] border-r border-black/10">
        <Link href="/">
          <div className="mx-6 my-6 text-2xl text-white">🏄 Ocean</div>
        </Link>
        <nav>
          <ul className="px-2">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                <li
                  key={link.href}
                  className="text-l mb-2 rounded-md px-4 py-2 hover:bg-zinc-800"
                >
                  {link.label}{' '}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="ml-[200px] h-full">
        <header className="h-[60px] border-b border-black/10">
          <div className="flex h-full w-full items-center justify-end px-6">
            <UserButton />
          </div>
        </header>
        <main className="min-h-[calc(100vh-60px)] rounded-ss-xl bg-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
