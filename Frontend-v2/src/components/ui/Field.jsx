const inputClasses =
  'w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15';

/* "n / max" hint shown when a field opts in with `counter` and has a maxLength */
const Counter = ({ value, maxLength }) => {
  if (!maxLength || typeof value !== 'string') return null;
  const atLimit = value.length >= maxLength;
  return (
    <span className={`mt-1 block text-right text-[0.68rem] tabular-nums ${atLimit ? 'text-primary-600' : 'text-ink-400'}`}>
      {value.length}/{maxLength}
    </span>
  );
};

export const Input = ({ label, error, counter, className = '', ...rest }) => (
  <label className="block text-left">
    {label && <span className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</span>}
    <input className={`${inputClasses} ${className}`} {...rest} />
    {counter && <Counter value={rest.value} maxLength={rest.maxLength} />}
    {error && <span className="mt-1 block text-xs font-medium text-primary-600">{error}</span>}
  </label>
);

export const Select = ({ label, error, className = '', children, ...rest }) => (
  <label className="block text-left">
    {label && <span className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</span>}
    <select className={`${inputClasses} ${className}`} {...rest}>
      {children}
    </select>
    {error && <span className="mt-1 block text-xs font-medium text-primary-600">{error}</span>}
  </label>
);

export const Textarea = ({ label, error, counter, className = '', ...rest }) => (
  <label className="block text-left">
    {label && <span className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</span>}
    <textarea className={`${inputClasses} min-h-28 resize-y ${className}`} {...rest} />
    {counter && <Counter value={rest.value} maxLength={rest.maxLength} />}
    {error && <span className="mt-1 block text-xs font-medium text-primary-600">{error}</span>}
  </label>
);
