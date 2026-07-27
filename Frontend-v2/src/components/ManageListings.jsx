import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuPackage, LuTrash2, LuCircleAlert } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import StatCard from './ui/StatCard';
import Button from './ui/Button';
import ConfirmDialog from './ui/ConfirmDialog';
import FilterChips from './ui/FilterChips';
import ListingCard from './ListingCard';
import { apiFetch } from '../lib/api';

const TYPE_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'lend', label: 'Lend' },
  { id: 'sell', label: 'Sell' },
];

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/admin/listings', { auth: true })
      .then((data) => {
        if (!cancelled) setListings(data.listings || []);
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
    return listings.filter((l) => {
      if (typeFilter !== 'all' && String(l.type).toLowerCase() !== typeFilter) return false;
      if (q && !`${l.title} ${l.description} ${l.owner?.name}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, search, typeFilter]);

  const confirmDelete = async () => {
    const id = deleteTarget._id;
    setDeleteTarget(null);
    setError('');
    try {
      await apiFetch(`/admin/listings/${id}`, { method: 'DELETE', auth: true });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading listings…" />;

  const lendCount = listings.filter((l) => String(l.type).toLowerCase() === 'lend').length;

  return (
    <div>
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <LuCircleAlert className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total listings" value={listings.length} />
        <StatCard label="For lending" value={lendCount} />
        <StatCard label="For sale" value={listings.length - lendCount} />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or owner…"
            className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-11 pr-5 text-sm outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15"
          />
        </div>
        <FilterChips options={TYPE_OPTIONS} value={typeFilter} onChange={setTypeFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={LuPackage} title="No listings found" hint="Try a different search or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing._id} listing={listing}>
              <Button
                size="sm"
                variant="danger"
                className="mt-3 w-full"
                onClick={() => setDeleteTarget(listing)}
              >
                <LuTrash2 className="h-3.5 w-3.5" />
                Delete listing
              </Button>
            </ListingCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this listing?"
        message={`"${deleteTarget?.title}" by ${deleteTarget?.owner?.name || 'unknown'} will be removed permanently.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageListings;
