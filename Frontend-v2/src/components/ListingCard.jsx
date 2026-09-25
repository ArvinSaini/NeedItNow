import { LuMapPin, LuPhone } from 'react-icons/lu';
import Badge from './ui/Badge';
import { getCategory, getListingStatus, getListingType, formatPrice } from '../lib/constants';

const ListingCard = ({ listing, children }) => {
  const category = getCategory(listing.category);
  const status = getListingStatus(listing.status);
  const type = getListingType(listing.type);
  const Icon = category.icon;
  const isLend = String(listing.type).toLowerCase() === 'lend';
  const price = Number(listing.price) || 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-md shadow-ink-900/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/10">
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
          {price > 0 ? (
            <span className="serif-accent shrink-0 text-lg text-primary-500">₹{formatPrice(price)}</span>
          ) : (
            isLend && <span className="serif-accent shrink-0 text-lg text-emerald-600">Free</span>
          )}
        </h3>
        <p className="mt-1 line-clamp-2 wrap-anywhere flex-1 text-sm text-ink-600">{listing.description}</p>
        <div className="mt-3 border-t border-dashed border-ink-200 pt-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-100 text-[0.65rem] font-bold text-cream-800">
              {(listing.owner?.name || '?').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 text-xs text-ink-400">
              <div className="truncate font-semibold text-ink-900">{listing.owner?.name || 'Unknown'}</div>
              <div className="flex flex-wrap items-center gap-x-2">
                {listing.owner?.hostel && (
                  <span className="inline-flex items-center gap-1">
                    <LuMapPin className="h-3 w-3" />
                    Hostel {listing.owner.hostel}
                    {listing.owner?.roomNumber && ` · ${listing.owner.roomNumber}`}
                  </span>
                )}
                {listing.owner?.phone && (
                  <span className="inline-flex items-center gap-1">
                    <LuPhone className="h-3 w-3" />
                    {listing.owner.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ListingCard;
