'use client';

export function CartQuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  compact = false,
}) {
  const buttonPadding = compact ? 'px-2.5 py-1.5' : 'px-3 py-2';

  return (
    <div className="inline-flex items-center border border-zinc-800 bg-zinc-950">
      <button
        type="button"
        onClick={onDecrease}
        className={`${buttonPadding} text-sm text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40`}
        disabled={quantity <= 1}
        aria-label="Smanji količinu"
      >
        -
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-medium text-white">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={`${buttonPadding} text-sm text-zinc-400 transition-colors hover:text-white`}
        aria-label="Povećaj količinu"
      >
        +
      </button>
    </div>
  );
}
