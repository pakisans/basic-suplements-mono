'use client';

export function CartQuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  compact = false,
}) {
  const buttonPadding = compact ? 'px-2.5 py-1.5' : 'px-3 py-2';

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <button
        type="button"
        onClick={onDecrease}
        className={`${buttonPadding} rounded-full text-sm text-zinc-400 transition-colors hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40`}
        disabled={quantity <= 1}
        aria-label="Smanji količinu"
      >
        -
      </button>
      <span className="min-w-10 px-3 text-center text-sm font-semibold text-white">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={`${buttonPadding} rounded-full text-sm text-zinc-400 transition-colors hover:bg-white/8 hover:text-white`}
        aria-label="Povećaj količinu"
      >
        +
      </button>
    </div>
  );
}
