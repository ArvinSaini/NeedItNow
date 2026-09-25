import { useEffect, useId, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, m } from 'framer-motion';
import { LuX } from 'react-icons/lu';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
 * Shared modal shell for "view full details" dialogs (listings, requests).
 * Mirrors ConfirmDialog's backdrop/panel styling and motion; adds a header
 * with a title + close button and a scrollable body for long content.
 */
const DetailsDialog = ({ open, onClose, title, eyebrow, children, returnFocusRef }) => {
  const titleId = useId();
  const panelRef = useRef(null);
  // Read the latest onClose through a ref so the open/close effect below doesn't
  // need it as a dependency — callers pass a fresh inline handler every render,
  // and re-running that effect on every card re-render would relock body scroll,
  // re-add the Esc listener, and yank focus back to the trigger mid-view.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const returnTarget = returnFocusRef?.current || document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      // Minimal focus trap: only intervene at the boundaries, let the browser
      // handle every other Tab/Shift+Tab press normally.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const firstFocusable = panel.querySelector(FOCUSABLE_SELECTOR);
      (firstFocusable || panel).focus();
    });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
      if (returnTarget && typeof returnTarget.focus === 'function') {
        returnTarget.focus();
      }
    };
  }, [open, returnFocusRef]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
          onClick={onClose}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={panelRef}
            tabIndex={-1}
          >
            <div className="flex items-start justify-between gap-3 border-b border-ink-200 px-5 py-4">
              <div className="min-w-0">
                {eyebrow && <p className="eyebrow text-primary-600">{eyebrow}</p>}
                <h3 id={titleId} className="wrap-anywhere text-lg font-bold text-ink-900">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <LuX className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default DetailsDialog;
