const TONES = {
  ok: 'bg-emerald-50 text-emerald-700',
  gray: 'bg-ink-100 text-ink-600',
  cream: 'bg-cream-100 text-cream-800',
  red: 'bg-primary-50 text-primary-700',
  amber: 'bg-amber-50 text-amber-700',
};

const Badge = ({ tone = 'gray', children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-wider ${TONES[tone] || TONES.gray} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
