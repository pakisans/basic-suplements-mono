'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/constants';

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sortiranje') ?? '-createdAt';

  function handleChange(e) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortiranje', e.target.value);
    params.delete('stranica');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="text-xs font-medium tracking-widest text-zinc-600 uppercase whitespace-nowrap"
      >
        Sortiraj:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleChange}
        className="text-xs font-medium border border-zinc-800 bg-black text-zinc-300 px-3 py-2 focus:outline-none focus:border-white"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
