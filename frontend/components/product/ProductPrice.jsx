import { CURRENCY } from '@/constants';

function formatPrice(value) {
  if (value === undefined || value === null) return null;
  return new Intl.NumberFormat('sr-RS').format(value);
}

export function ProductPrice({
  price,
  salePrice,
  size = 'md',
  className = '',
}) {
  const inSaleWindow = salePrice !== undefined && salePrice !== null;

  const priceClass = size === 'xl' ? 'text-3xl' : 'text-xl';

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      {inSaleWindow ? (
        <>
          <span className={`font-bold text-white ${priceClass}`}>
            {formatPrice(salePrice)} {CURRENCY.symbol}
          </span>
          <span className="text-sm text-zinc-400 line-through">
            {formatPrice(price)} {CURRENCY.symbol}
          </span>
        </>
      ) : (
        <span className={`font-bold text-white ${priceClass}`}>
          {formatPrice(price)} {CURRENCY.symbol}
        </span>
      )}
    </div>
  );
}
