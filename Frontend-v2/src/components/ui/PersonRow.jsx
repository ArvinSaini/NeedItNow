import { LuMapPin, LuPhone } from 'react-icons/lu';

const SIZES = {
  card: {
    avatar: 'h-7 w-7 text-[0.65rem]',
    text: 'text-xs text-ink-400',
    name: 'truncate font-semibold text-ink-900',
    details: 'flex flex-wrap items-center gap-x-2',
  },
  dialog: {
    avatar: 'h-8 w-8 text-xs',
    text: 'text-sm text-ink-600',
    name: 'font-semibold text-ink-900',
    details: 'mt-0.5 flex flex-col gap-1 text-xs',
  },
};

/* Shared owner/requester avatar + name + hostel/room + phone block, used on
 * both the card (compact) and the details dialog (roomier). */
const PersonRow = ({ person, size = 'card' }) => {
  const s = SIZES[size] || SIZES.card;
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex flex-none items-center justify-center rounded-full bg-cream-100 font-bold text-cream-800 ${s.avatar}`}
      >
        {(person?.name || '?').charAt(0).toUpperCase()}
      </span>
      <div className={`min-w-0 ${s.text}`}>
        <div className={s.name}>{person?.name || 'Unknown'}</div>
        <div className={s.details}>
          {person?.hostel && (
            <span className="inline-flex items-center gap-1">
              <LuMapPin className="h-3 w-3" />
              Hostel {person.hostel}
              {person?.roomNumber && ` · ${person.roomNumber}`}
            </span>
          )}
          {person?.phone && (
            <span className="inline-flex items-center gap-1">
              <LuPhone className="h-3 w-3" />
              {person.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonRow;
