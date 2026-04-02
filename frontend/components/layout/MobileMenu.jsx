import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';

export function MobileMenu({ navItems = [] }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none p-2 text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white">
        Meni
      </summary>
      <div className="absolute right-0 mt-2 min-w-52 border border-zinc-800 bg-black p-3 shadow-2xl">
        <div className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <Link
              key={item.id ?? index}
              href={resolveLink(item.link)}
              className="px-3 py-2.5 text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
            >
              {item.link?.label}
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}
