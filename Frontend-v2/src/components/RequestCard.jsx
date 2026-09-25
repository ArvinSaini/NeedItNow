import { useRef, useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import Badge from './ui/Badge';
import DetailsDialog from './ui/DetailsDialog';
import PersonRow from './ui/PersonRow';
import { getCategory, getRequestStatus, getUrgency } from '../lib/constants';

const RequestCard = ({ request, children }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const viewDetailsRef = useRef(null);
  const category = getCategory(request.category);
  const status = getRequestStatus(request.status);
  const urgency = getUrgency(request.urgency);
  const Icon = category.icon;
  const tags = Array.isArray(request.tags) ? request.tags.filter(Boolean) : [];

  // Whole card is a click-to-open-details convenience; any nested button/link
  // (the "View details" button itself, or a future action button) handles
  // its own click and must not also toggle the dialog a second time. A click
  // that ends a text selection (drag-to-select) shouldn't open it either.
  const handleCardClick = (e) => {
    if (e.target.closest('button, a')) return;
    if (window.getSelection?.().toString()) return;
    setDetailsOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-md shadow-ink-900/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/10"
      >
        <div className="flex items-center justify-between border-b border-ink-200 bg-gradient-to-br from-cream-50 to-cream-100 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <Badge tone={urgency.tone}>{urgency.label} urgency</Badge>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone="gray">{category.label}</Badge>
          </div>
          <h3 className="line-clamp-2 wrap-anywhere font-bold tracking-tight text-ink-900">{request.title}</h3>
          <p className="mt-1 line-clamp-2 wrap-anywhere flex-1 text-sm text-ink-600">{request.description}</p>
          <button
            ref={viewDetailsRef}
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="mt-1.5 inline-flex w-fit items-center gap-1 text-xs font-semibold text-primary-600 transition hover:text-primary-700"
          >
            View details
            <LuArrowRight className="h-3 w-3" />
          </button>
          <div className="mt-3 border-t border-dashed border-ink-200 pt-3">
            <PersonRow person={request.requester} size="card" />
          </div>
          {children}
        </div>
      </div>

      <DetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        eyebrow={`${urgency.label} urgency · ${category.label}`}
        title={request.title}
        returnFocusRef={viewDetailsRef}
      >
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge tone={status.tone}>{status.label}</Badge>
          <Badge tone={urgency.tone}>{urgency.label} urgency</Badge>
          <Badge tone="gray">{category.label}</Badge>
        </div>
        <p className="whitespace-pre-line wrap-anywhere text-sm text-ink-700">{request.description}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge key={t} tone="cream">
                {t}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-4 border-t border-dashed border-ink-200 pt-4">
          <PersonRow person={request.requester} size="dialog" />
        </div>
      </DetailsDialog>
    </>
  );
};

export default RequestCard;
