export function Section({
  children,
  className = '',
  containerClassName = '',
  as: Tag = 'section',
  narrow = false,
}) {
  return (
    <Tag className={`py-12 md:py-16 ${className}`}>
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 ${narrow ? 'max-w-4xl' : 'max-w-7xl'} ${containerClassName}`}
      >
        {children}
      </div>
    </Tag>
  );
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
  className = '',
}) {
  return (
    <div
      className={`mb-8 md:mb-12 ${centered ? 'text-center' : ''} ${className}`}
    >
      <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base text-zinc-400">{subtitle}</p>}
    </div>
  );
}
