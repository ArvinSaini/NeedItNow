import { useEffect, useId, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, m } from 'framer-motion';
import { LuX } from 'react-icons/lu';

/*
 * Shared modal shell for "view full details" dialogs (listings, requests).
 * Mirrors ConfirmDialog's backdrop/panel styling and motion; adds a header
 * with a title + close button and a scrollable body for long content.
 */
const DetailsDialog = ({ open, onClose, title, eyebrow, children }) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [open, onClose]);

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
