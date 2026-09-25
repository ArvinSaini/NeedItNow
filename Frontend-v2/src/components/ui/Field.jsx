import { useId, useLayoutEffect, useRef, useState } from 'react';
import { LuEye, LuEyeOff, LuScissors } from 'react-icons/lu';

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

const PasteWarning = ({ id, maxLength }) => (
  <span id={id} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary-600">
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

/* Show/hide toggle for password inputs. Each Input owns its own `visible` state, so fields
   toggle independently and always start hidden. Mousedown is prevented so a focused input keeps
   focus, and the selection is restored after the type swap so the caret doesn't jump. Chrome
   resets the caret to 0 once more after the click finishes (before the next frame), so the
   restore runs again in a requestAnimationFrame. */
function usePasswordReveal(inputRef) {
  const [visible, setVisible] = useState(false);
  const selectionRef = useRef(null);

  useLayoutEffect(() => {
    const el = inputRef.current;
    const sel = selectionRef.current;
    if (!el || !sel) return;
    selectionRef.current = null;
    const restore = () => {
      if (document.activeElement === el) el.setSelectionRange(sel.start, sel.end);
    };
    restore();
    const frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [visible, inputRef]);

  const toggle = () => {
    const el = inputRef.current;
    if (el && el.selectionStart != null) selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
    setVisible((v) => !v);
  };

  return { visible, toggle };
}

/* The label is tied to the input with htmlFor/id (not by wrapping) so the eye button can sit
   beside the input without joining its accessible name ("Password", not "Password Show password").
   Hint/warning/error text is linked with aria-describedby instead. */
export const Input = ({ label, error, counter, className = '', maxLength, onPaste, onChange, type, revealable, id, ...rest }) => {
  const { truncated, handlePaste, handleChange } = usePasteTruncation({ maxLength, onPaste, onChange });
  const inputRef = useRef(null);
  const { visible, toggle } = usePasswordReveal(inputRef);
  const autoId = useId();
  const inputId = id ?? autoId;
  const canReveal = revealable ?? type === 'password';
  const inputType = canReveal && visible ? 'text' : type;
  const warningId = truncated ? `${inputId}-warning` : null;
  const errorId = error ? `${inputId}-error` : null;
  const describedBy = [rest['aria-describedby'], warningId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="block text-left">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-ink-600">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          className={`${inputClasses} ${canReveal ? 'pr-12' : ''} ${className}`}
          type={inputType}
          maxLength={maxLength}
          onPaste={handlePaste}
          onChange={handleChange}
          {...rest}
          aria-describedby={describedBy}
        />
        {canReveal && (
          <button
            type="button"
            onClick={toggle}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            aria-controls={inputId}
            className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 outline-none transition hover:text-ink-700 focus-visible:text-primary-600 focus-visible:ring-[3px] focus-visible:ring-primary-500/25"
          >
            {visible ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {counter && <Counter value={rest.value} maxLength={maxLength} />}
      {truncated && <PasteWarning id={warningId} maxLength={maxLength} />}
      {error && (
        <span id={errorId} className="mt-1 block text-xs font-medium text-primary-600">
          {error}
        </span>
      )}
    </div>
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
