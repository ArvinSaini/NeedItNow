const StatCard = ({ label, value, sub, valueClassName = '' }) => (
  <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm shadow-ink-900/5">
    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink-400">{label}</div>
    <div className={`font-serif text-4xl tabular-nums leading-tight ${valueClassName}`}>{value}</div>
    {sub && <div className="mt-0.5 text-xs font-medium text-ink-400">{sub}</div>}
  </div>
);

export default StatCard;
