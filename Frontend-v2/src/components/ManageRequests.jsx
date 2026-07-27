import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuInbox, LuTrash2, LuCircleAlert } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import StatCard from './ui/StatCard';
import Button from './ui/Button';
import ConfirmDialog from './ui/ConfirmDialog';
import FilterChips from './ui/FilterChips';
import RequestCard from './RequestCard';
import { apiFetch } from '../lib/api';
import { URGENCY } from '../lib/constants';

const URGENCY_OPTIONS = [
  { id: 'all', label: 'All' },
  ...URGENCY.map((u) => ({ id: u.id, label: u.label })),
];

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/admin/requests', { auth: true })
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (urgencyFilter !== 'all' && String(r.urgency).toLowerCase() !== urgencyFilter) return false;
      if (q && !`${r.title} ${r.description} ${r.requester?.name}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [requests, search, urgencyFilter]);

  const confirmDelete = async () => {
    const id = deleteTarget._id;
    setDeleteTarget(null);
    setError('');
    try {
      await apiFetch(`/admin/requests/${id}`, { method: 'DELETE', auth: true });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading requests…" />;

  const highCount = requests.filter((r) => String(r.urgency).toLowerCase() === 'high').length;
  const activeCount = requests.filter((r) => String(r.status).toLowerCase() === 'active').length;

  return (
    <div>
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <LuCircleAlert className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total requests" value={requests.length} />
        <StatCard label="Active" value={activeCount} />
        <StatCard label="High urgency" value={highCount} valueClassName="text-primary-600" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or requester…"
            className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-11 pr-5 text-sm outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15"
          />
        </div>
        <FilterChips options={URGENCY_OPTIONS} value={urgencyFilter} onChange={setUrgencyFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={LuInbox} title="No requests found" hint="Try a different search or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((request) => (
            <RequestCard key={request._id} request={request}>
              <Button
                size="sm"
                variant="danger"
                className="mt-3 w-full"
                onClick={() => setDeleteTarget(request)}
              >
                <LuTrash2 className="h-3.5 w-3.5" />
                Delete request
              </Button>
            </RequestCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this request?"
        message={`"${deleteTarget?.title}" by ${deleteTarget?.requester?.name || 'unknown'} will be removed permanently.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageRequests;
