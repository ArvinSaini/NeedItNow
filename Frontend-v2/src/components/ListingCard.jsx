import { useRef, useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import Badge from './ui/Badge';
import DetailsDialog from './ui/DetailsDialog';
import PriceTag from './ui/PriceTag';
import PersonRow from './ui/PersonRow';
import { getCategory, getListingStatus, getListingType } from '../lib/constants';

const ListingCard = ({ listing, children }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const viewDetailsRef = useRef(null);
  const category = getCategory(listing.category);
  const status = getListingStatus(listing.status);
  const type = getListingType(listing.type);
  const Icon = category.icon;
  const isLend = String(listing.type).toLowerCase() === 'lend';
  const price = Number(listing.price) || 0;

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
        <div className="flex h-24 items-center justify-center border-b border-ink-200 bg-gradient-to-br from-cream-50 to-cream-100 text-primary-700">
          <Icon className="h-8 w-8 opacity-90" />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone={type.tone}>{type.label}</Badge>
            <Badge tone="gray">{category.label}</Badge>
          </div>
          <h3 className="flex items-baseline gap-1.5 font-bold tracking-tight text-ink-900">
            <span className="line-clamp-2 wrap-anywhere">{listing.title}</span>
            <PriceTag price={price} isLend={isLend} size="card" />
          </h3>
          <p className="mt-1 line-clamp-2 wrap-anywhere flex-1 text-sm text-ink-600">{listing.description}</p>
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
            <PersonRow person={listing.owner} size="card" />
          </div>
          {children}
        </div>
      </div>

      <DetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        eyebrow={`${type.label} · ${category.label}`}
        title={listing.title}
        returnFocusRef={viewDetailsRef}
      >
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge tone={status.tone}>{status.label}</Badge>
          <Badge tone={type.tone}>{type.label}</Badge>
          <Badge tone="gray">{category.label}</Badge>
        </div>
        <PriceTag price={price} isLend={isLend} size="dialog" as="p" className="mb-3" />
        <p className="whitespace-pre-line wrap-anywhere text-sm text-ink-700">{listing.description}</p>
        <div className="mt-4 border-t border-dashed border-ink-200 pt-4">
          <PersonRow person={listing.owner} size="dialog" />
        </div>
      </DetailsDialog>
    </>
  );
};

export default ListingCard;
