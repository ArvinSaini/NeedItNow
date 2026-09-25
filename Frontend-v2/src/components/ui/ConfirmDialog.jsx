// eslint-disable-next-line no-unused-vars
import { AnimatePresence, m } from 'framer-motion';
import { LuTriangleAlert } from 'react-icons/lu';
import Button from './Button';

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
        onClick={onCancel}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <LuTriangleAlert className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <p className="mt-1 wrap-anywhere text-sm text-ink-600">{message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </m.div>
      </m.div>
    )}
  </AnimatePresence>
);

export default ConfirmDialog;
