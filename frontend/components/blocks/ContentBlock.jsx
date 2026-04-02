import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

export function ContentBlock({ block }) {
  const columns = block.columns ?? [];

  return (
    <div
      className={`grid gap-8 ${columns.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}
    >
      {columns.map((column, index) => (
        <div key={column.id ?? index}>
          {column.title && (
            <h3 className="mb-4 text-xl font-semibold text-white">
              {column.title}
            </h3>
          )}
          {column.richText && <RichText content={column.richText} />}
          {column.link && (
            <div className="mt-4">
              <LinkButton link={column.link} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
