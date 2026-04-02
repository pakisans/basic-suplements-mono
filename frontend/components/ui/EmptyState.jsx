export function EmptyState({ title, description, action }) {
  return (
    <div className="border border-dashed border-zinc-800 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-zinc-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
