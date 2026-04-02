export function StatsBlock({ block }) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {(block.items ?? []).map((item, index) => (
        <div
          key={item.id ?? index}
          className="border border-zinc-800 p-6 text-center"
        >
          <div className="text-3xl font-bold text-white">{item.value}</div>
          <div className="mt-2 text-xs font-medium tracking-widest text-zinc-500 uppercase">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
