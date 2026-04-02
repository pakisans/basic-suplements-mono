import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';

export function Navigation({ navItems = [] }) {
  return (
    <nav className="flex items-center gap-8">
      {navItems.map((item, index) => (
        <Link
          key={item.id ?? index}
          href={resolveLink(item.link)}
          className="text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
          target={item.link?.newTab ? '_blank' : undefined}
        >
          {item.link?.label}
        </Link>
      ))}
    </nav>
  );
}
