const EmptyState = ({ icon: Icon, title, hint, action }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 bg-ink-50 px-6 py-16 text-center">
    {Icon && (
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-primary-700">
        <Icon className="h-6 w-6" />
      </div>
    )}
    <h3 className="text-lg font-bold text-ink-900">{title}</h3>
    {hint && <p className="max-w-sm text-sm text-ink-400">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
