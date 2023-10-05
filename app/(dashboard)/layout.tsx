import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const links = [
  { href: '', label: 'Home' },
  { href: '/journal', label: 'Journal' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-screen w-screen">
      <aside className="absolute left-0 top-0 h-full w-[200px] border-r border-black/10">
        <div className="px-4 py-8 text-4xl">Ocean</div>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="px-4 py-2 text-xl">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="ml-[200px] h-full">
        <header className="h-[60px] border-b border-black/10">
          <div className="flex h-full w-full items-center justify-end px-6">
            <UserButton />
          </div>
        </header>
        <main className="h-[calc(100vh-60px)]">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
