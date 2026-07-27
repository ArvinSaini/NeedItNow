import { LuMapPin, LuPhone } from 'react-icons/lu';
import Badge from './ui/Badge';
import { getCategory, getRequestStatus, getUrgency } from '../lib/constants';

const RequestCard = ({ request, children }) => {
  const category = getCategory(request.category);
  const status = getRequestStatus(request.status);
  const urgency = getUrgency(request.urgency);
  const Icon = category.icon;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-md shadow-ink-900/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/10">
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
        <h3 className="font-bold tracking-tight text-ink-900">{request.title}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink-600">{request.description}</p>
        <div className="mt-3 border-t border-dashed border-ink-200 pt-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-100 text-[0.65rem] font-bold text-cream-800">
              {(request.requester?.name || '?').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 text-xs text-ink-400">
              <div className="truncate font-semibold text-ink-900">
                {request.requester?.name || 'Unknown'}
              </div>
              <div className="flex flex-wrap items-center gap-x-2">
                {request.requester?.hostel && (
                  <span className="inline-flex items-center gap-1">
                    <LuMapPin className="h-3 w-3" />
                    Hostel {request.requester.hostel}
                    {request.requester?.roomNumber && ` · ${request.requester.roomNumber}`}
                  </span>
                )}
                {request.requester?.phone && (
                  <span className="inline-flex items-center gap-1">
                    <LuPhone className="h-3 w-3" />
                    {request.requester.phone}
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

export default RequestCard;
