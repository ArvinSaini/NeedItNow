const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20" role="status" aria-live="polite">
    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-cream-200 border-t-primary-500" />
    <span className="text-sm text-ink-400">{label}</span>
  </div>
);

export default Spinner;
