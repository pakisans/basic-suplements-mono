import Link from 'next/link';
import { Fragment } from 'react';

export function Breadcrumbs({ items, className = '' }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <li>
          <Link href="/" className="transition-colors hover:text-white">
            Početna
          </Link>
        </li>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <li>/</li>
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-400">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
