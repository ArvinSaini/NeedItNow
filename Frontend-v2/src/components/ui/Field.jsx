import { useRef, useState } from 'react';
import { LuScissors } from 'react-icons/lu';

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

const PasteWarning = ({ maxLength }) => (
  <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary-600">
    <LuScissors className="h-3 w-3 flex-none" />
    Your text was cut to {maxLength} characters.
  </span>
);

/* Shared by Input/Textarea: the browser silently truncates a paste that would exceed
   `maxLength`, with no native signal that anything was cut. We compute the would-be value
   (current value with the selection replaced by the clipboard text) inside onPaste, before
   the browser applies its own truncation, and flag it if that would overflow. The warning
   stays up through the onChange the paste itself triggers (flagged via a ref, not state, so
   it doesn't trigger a re-render) and clears on the next onChange that isn't from that paste —
   i.e. any subsequent edit, including one after a blur. */
function usePasteTruncation({ maxLength, onPaste, onChange }) {
  const [truncated, setTruncated] = useState(false);
  const justPastedRef = useRef(false);

  const handlePaste = (e) => {
    if (maxLength) {
      const target = e.target;
      const clipboardText = e.clipboardData?.getData('text') ?? '';
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? target.value.length;
      const wouldBeValue = target.value.slice(0, start) + clipboardText + target.value.slice(end);
      if (wouldBeValue.length > maxLength) {
        justPastedRef.current = true;
        setTruncated(true);
      }
    }
    onPaste?.(e);
  };

  const handleChange = (e) => {
    if (justPastedRef.current) {
      justPastedRef.current = false; // this onChange is the paste itself — keep the warning up
    } else if (truncated) {
      setTruncated(false); // any later edit clears it
    }
    onChange?.(e);
  };

  return { truncated, handlePaste, handleChange };
}

export const Input = ({ label, error, counter, className = '', maxLength, onPaste, onChange, ...rest }) => {
  const { truncated, handlePaste, handleChange } = usePasteTruncation({ maxLength, onPaste, onChange });
  return (
    <label className="block text-left">
      {label && <span className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</span>}
      <input className={`${inputClasses} ${className}`} maxLength={maxLength} onPaste={handlePaste} onChange={handleChange} {...rest} />
      {counter && <Counter value={rest.value} maxLength={maxLength} />}
      {truncated && <PasteWarning maxLength={maxLength} />}
      {error && <span className="mt-1 block text-xs font-medium text-primary-600">{error}</span>}
    </label>
  );
};

export const Select = ({ label, error, className = '', children, ...rest }) => (
  <label className="block text-left">
    {label && <span className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</span>}
    <select className={`${inputClasses} ${className}`} {...rest}>
      {children}
    </select>
    {error && <span className="mt-1 block text-xs font-medium text-primary-600">{error}</span>}
  </label>
);

export const Textarea = ({ label, error, counter, className = '', maxLength, onPaste, onChange, ...rest }) => {
  const { truncated, handlePaste, handleChange } = usePasteTruncation({ maxLength, onPaste, onChange });
  return (
    <label className="block text-left">
      {label && <span className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</span>}
      <textarea
        className={`${inputClasses} min-h-28 resize-y ${className}`}
        maxLength={maxLength}
        onPaste={handlePaste}
        onChange={handleChange}
        {...rest}
      />
      {counter && <Counter value={rest.value} maxLength={maxLength} />}
      {truncated && <PasteWarning maxLength={maxLength} />}
      {error && <span className="mt-1 block text-xs font-medium text-primary-600">{error}</span>}
    </label>
  );
};
