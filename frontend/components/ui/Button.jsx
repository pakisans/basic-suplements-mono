import Link from 'next/link';

const variantClasses = {
  primary: 'bg-white text-black hover:bg-zinc-200 focus:ring-white',
  secondary:
    'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-700 border border-zinc-800',
  outline:
    'border border-white text-white hover:bg-white hover:text-black focus:ring-white',
  ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-900 focus:ring-zinc-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
};

const sizeClasses = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  href,
  children,
  className = '',
  disabled,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium tracking-widest uppercase text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer';

  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {loading && <Spinner />}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function LinkButton({ link, className = '' }) {
  const href = resolveLink(link);
  const isOutline = link.appearance === 'outline';

  const base =
    'group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all';
  const filled = 'bg-white text-black hover:bg-zinc-100';
  const outline =
    'border border-white/20 text-white hover:border-white hover:bg-white hover:text-black';

  return (
    <Link
      href={href}
      className={[base, isOutline ? outline : filled, className].filter(Boolean).join(' ')}
    >
      {link.label}
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}

export function resolveLink(link) {
  if (link.type === 'custom' && link.url) return link.url;

  if (link.reference?.value) {
    const val = link.reference.value;
    const slug = typeof val === 'string' ? val : val.slug;
    const rel = link.reference.relationTo;

    switch (rel) {
      case 'products':
        return `/products/${slug}`;
      case 'categories':
        return `/products/${slug}`;
      case 'brands':
        return `/brands/${slug}`;
      case 'posts':
        return `/blog/${slug}`;
      case 'post-categories':
        return `/blog/category/${slug}`;
      case 'pages':
        return `/${slug}`;
      default:
        return `/${slug}`;
    }
  }

  return '#';
}
