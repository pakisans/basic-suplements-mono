'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/constants';
import { Select } from '@/components/ui/Select';

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? '-createdAt';

  function handleChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      label="Sort:"
      options={SORT_OPTIONS}
      value={currentSort}
      onChange={handleChange}
    />
  );
}
