import { SPACER_SIZES } from '@/constants';

export function SpacerBlock({ block }) {
  return (
    <div
      style={{ height: SPACER_SIZES[block.size] ?? SPACER_SIZES.md }}
      aria-hidden="true"
    />
  );
}
