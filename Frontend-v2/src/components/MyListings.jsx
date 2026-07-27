import { useEffect, useState } from 'react';
import { LuPencil, LuTrash2, LuArchive, LuCircleAlert } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';
import Badge from './ui/Badge';
import ConfirmDialog from './ui/ConfirmDialog';
import { Input, Select, Textarea } from './ui/Field';
import { apiFetch, getUser } from '../lib/api';
import {
  CATEGORIES,
  getCategory,
  getListingStatus,
  getListingType,
  LISTING_STATUS,
} from '../lib/constants';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const user = getUser();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) {
      setError('Could not read your account. Please log in again.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiFetch(`/product/owner/${userId}`)
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
  }, [userId]);

  const startEdit = (listing) => {
    setEditingId(listing._id);
    setEditForm({
      title: listing.title,
      description: listing.description,
      category: String(listing.category).toLowerCase(),
      type: String(listing.type).toLowerCase(),
      price: listing.price || 0,
      status: String(listing.status).toLowerCase(),
    });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    setSaving(true);
    setError('');
    try {
      const body = { ...editForm, price: Number(editForm.price) || 0 };
      await apiFetch(`/product/${id}`, { method: 'PUT', auth: true, body });
      setListings((prev) => prev.map((l) => (l._id === id ? { ...l, ...body } : l)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteTarget._id;
    setDeleteTarget(null);
    setError('');
    try {
      await apiFetch(`/product/${id}`, { method: 'DELETE', auth: true });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading your listings…" />;

  return (
    <div>
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <LuCircleAlert className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      {listings.length === 0 && !error ? (
        <EmptyState
          icon={LuArchive}
          title="You haven't listed anything yet"
          hint="Share something you're not using — a book, a kettle, a cycle."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const category = getCategory(listing.category);
            const status = getListingStatus(listing.status);
            const type = getListingType(listing.type);
            const Icon = category.icon;
            const editing = editingId === listing._id;

            return (
              <div
                key={listing._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-md shadow-ink-900/5"
              >
                {editing ? (
                  <div className="space-y-3 p-4">
                    <Input label="Title" name="title" value={editForm.title} onChange={handleEditChange} />
                    <Textarea
                      label="Description"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="min-h-20"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Select label="Category" name="category" value={editForm.category} onChange={handleEditChange}>
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </Select>
                      <Select label="Type" name="type" value={editForm.type} onChange={handleEditChange}>
                        <option value="lend">Lend</option>
                        <option value="sell">Sell</option>
                      </Select>
                      <Select label="Status" name="status" value={editForm.status} onChange={handleEditChange}>
                        {Object.entries(LISTING_STATUS).map(([id, s]) => (
                          <option key={id} value={id}>
                            {s.label}
                          </option>
                        ))}
                      </Select>
                      <Input
                        label={editForm.type === 'sell' ? 'Price (₹)' : 'Price (₹, 0 = free)'}
                        type="number"
                        name="price"
                        min="0"
                        value={editForm.price}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => saveEdit(listing._id)} disabled={saving} className="flex-1">
                        {saving ? 'Saving…' : 'Save'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex h-20 items-center justify-center border-b border-ink-200 bg-gradient-to-br from-cream-50 to-cream-100 text-primary-700">
                      <Icon className="h-7 w-7 opacity-90" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <Badge tone={type.tone}>{type.label}</Badge>
                        <Badge tone="gray">{category.label}</Badge>
                      </div>
                      <h3 className="font-bold tracking-tight text-ink-900">
                        {listing.title}{' '}
                        {Number(listing.price) > 0 ? (
                          <span className="serif-accent text-lg text-primary-500">₹{listing.price}</span>
                        ) : (
                          String(listing.type).toLowerCase() === 'lend' && (
                            <span className="serif-accent text-lg text-emerald-600">Free</span>
                          )
                        )}
                      </h3>
                      <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink-600">{listing.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(listing)} className="flex-1">
                          <LuPencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(listing)} className="flex-1">
                          <LuTrash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this listing?"
        message={`"${deleteTarget?.title}" will be removed permanently.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MyListings;
