import { SPACER_SIZES } from '@/constants';

export function SpacerBlock({ block }) {
  const height = SPACER_SIZES[block.size] ?? SPACER_SIZES.md;

  if (block.showDivider) {
    return (
      <div style={{ paddingBlock: `calc(${height} / 2)` }} aria-hidden="true">
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="mx-4 h-1 w-1 rotate-45 bg-white/20" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    );
  }

  return <div style={{ height }} aria-hidden="true" />;
}
