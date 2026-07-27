import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuMessageCircleQuestion } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import FilterChips from './ui/FilterChips';
import RequestCard from './RequestCard';
import { apiFetch } from '../lib/api';
import { CATEGORIES, URGENCY } from '../lib/constants';

const CATEGORY_OPTIONS = [{ id: 'all', label: 'All' }, ...CATEGORIES];
const URGENCY_OPTIONS = [
  { id: 'all', label: 'All urgencies' },
  ...URGENCY.map((u) => ({ id: u.id, label: u.label })),
];

const RequestsBrowser = ({ onCount }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [urgency, setUrgency] = useState('all');

  useEffect(() => {
    let cancelled = false;
    apiFetch('/request')
      .then((data) => {
        if (!cancelled) setRequests(data.requests || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && onCount) onCount(requests.length);
  }, [loading, requests.length, onCount]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (category !== 'all' && String(r.category).toLowerCase() !== category) return false;
      if (urgency !== 'all' && String(r.urgency).toLowerCase() !== urgency) return false;
      if (q && !`${r.title} ${r.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [requests, search, category, urgency]);

  if (loading) return <Spinner label="Loading requests…" />;

  if (error) {
    return <EmptyState icon={LuMessageCircleQuestion} title="Couldn't load requests" hint={error} />;
  }

  return (
    <div>
      <div className="relative mb-4">
        <LuSearch className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search requests…"
          className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-5 text-sm text-ink-900 shadow-sm shadow-ink-900/5 outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15"
        />
      </div>

      <div className="mb-2">
        <FilterChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      </div>
      <div className="mb-6">
        <FilterChips options={URGENCY_OPTIONS} value={urgency} onChange={setUrgency} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={LuMessageCircleQuestion}
          title="No requests found"
          hint={
            requests.length === 0
              ? 'No one has posted a request yet.'
              : 'Try a different search or filter.'
          }
        />
      ) : (
        <div className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsBrowser;
