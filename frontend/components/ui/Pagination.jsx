import Link from 'next/link';

export function Pagination({ currentPage, totalPages, className = '' }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-2 text-zinc-400">
              …
            </span>
          );
        }

        const href = `?stranica=${page}`;
        const active = page === currentPage;

        return (
          <Link
            key={page}
            href={href}
            className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-xs font-medium transition-colors ${active ? 'border-white bg-white text-black' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white'}`}
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}
