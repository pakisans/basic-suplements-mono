import { BADGE_LABELS } from '@/constants';

const variantClasses = {
  default: 'border border-zinc-700 text-zinc-400',
  sale: 'bg-red-950 border border-red-800 text-red-400',
  new: 'bg-emerald-950 border border-emerald-800 text-emerald-400',
  bestseller: 'bg-amber-950 border border-amber-800 text-amber-400',
  featured: 'bg-zinc-900 border border-white text-white',
  limited: 'bg-orange-950 border border-orange-800 text-orange-400',
  preorder: 'bg-violet-950 border border-violet-800 text-violet-400',
  success: 'bg-emerald-950 border border-emerald-800 text-emerald-400',
  warning: 'bg-amber-950 border border-amber-800 text-amber-400',
  error: 'bg-red-950 border border-red-800 text-red-400',
  info: 'border border-zinc-700 text-zinc-300',
};

export function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium tracking-wide ${variantClasses[variant] ?? variantClasses.default} ${className}`}
    >
      {children}
    </span>
  );
}

export function ProductBadges({ badges, className = '' }) {
  if (!badges?.length) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {badges.map((badge) => (
        <Badge key={badge} variant={badge}>
          {BADGE_LABELS[badge] ?? badge}
        </Badge>
      ))}
    </div>
  );
}
