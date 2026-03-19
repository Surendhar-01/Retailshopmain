export function ChartCard({ title, description, children }) {
  return (
    <div className="panel p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}
