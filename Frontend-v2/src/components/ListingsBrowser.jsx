import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuPackageOpen } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import FilterChips from './ui/FilterChips';
import ListingCard from './ListingCard';
import { apiFetch } from '../lib/api';
import { CATEGORIES } from '../lib/constants';

const CATEGORY_OPTIONS = [{ id: 'all', label: 'All' }, ...CATEGORIES];
const TYPE_OPTIONS = [
  { id: 'all', label: 'All types' },
  { id: 'lend', label: 'Lend' },
  { id: 'sell', label: 'Sell' },
];

const ListingsBrowser = ({ onCount, initialCategory }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(
    CATEGORIES.some((c) => c.id === initialCategory) ? initialCategory : 'all',
  );
  const [type, setType] = useState('all');

  useEffect(() => {
    let cancelled = false;
    apiFetch('/product')
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

  useEffect(() => {
    if (!loading && onCount) onCount(listings.length);
  }, [loading, listings.length, onCount]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      if (category !== 'all' && String(l.category).toLowerCase() !== category) return false;
      if (type !== 'all' && String(l.type).toLowerCase() !== type) return false;
      if (q && !`${l.title} ${l.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, search, category, type]);

  if (loading) return <Spinner label="Loading listings…" />;

  if (error) {
    return (
      <EmptyState
        icon={LuPackageOpen}
        title="Couldn't load listings"
        hint={error}
      />
    );
  }

  return (
    <div>
      <div className="relative mb-4">
        <LuSearch className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for textbooks, cycles, kettles…"
          className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-5 text-sm text-ink-900 shadow-sm shadow-ink-900/5 outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15"
        />
      </div>

      <div className="mb-2">
        <FilterChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      </div>
      <div className="mb-6">
        <FilterChips options={TYPE_OPTIONS} value={type} onChange={setType} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={LuPackageOpen}
          title="No listings found"
          hint={
            listings.length === 0
              ? 'Nothing has been listed yet — be the first to share something.'
              : 'Try a different search or filter.'
          }
        />
      ) : (
        <div className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsBrowser;
