import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';

export function Navigation({ navItems = [] }) {
  return (
    <nav className="flex min-w-0 items-center justify-center gap-5 xl:gap-8">
      {navItems.map((item, index) => (
        <Link
          key={item.id ?? index}
          href={resolveLink(item.link)}
          className="shrink-0 whitespace-nowrap text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase transition-colors hover:text-white"
          target={item.link?.newTab ? '_blank' : undefined}
        >
          {item.link?.label}
        </Link>
      ))}
    </nav>
  );
}
