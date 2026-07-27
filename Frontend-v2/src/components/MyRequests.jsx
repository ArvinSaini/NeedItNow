import { useEffect, useState } from 'react';
import { LuPencil, LuTrash2, LuClipboardList, LuCircleAlert } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';
import Badge from './ui/Badge';
import ConfirmDialog from './ui/ConfirmDialog';
import { Input, Select, Textarea } from './ui/Field';
import { apiFetch, getUser } from '../lib/api';
import {
  CATEGORIES,
  URGENCY,
  REQUEST_STATUS,
  getCategory,
  getRequestStatus,
  getUrgency,
} from '../lib/constants';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
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
    apiFetch(`/request/user/${userId}`)
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
  }, [userId]);

  const startEdit = (request) => {
    setEditingId(request._id);
    setEditForm({
      title: request.title,
      description: request.description,
      category: String(request.category).toLowerCase(),
      urgency: String(request.urgency).toLowerCase(),
      status: String(request.status).toLowerCase(),
    });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    setSaving(true);
    setError('');
    try {
      await apiFetch(`/request/${id}`, { method: 'PUT', auth: true, body: editForm });
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, ...editForm } : r)));
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
      await apiFetch(`/request/${id}`, { method: 'DELETE', auth: true });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading your requests…" />;

  return (
    <div>
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <LuCircleAlert className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      {requests.length === 0 && !error ? (
        <EmptyState
          icon={LuClipboardList}
          title="You haven't posted any requests"
          hint="Need something? Post a request and let your hostel mates come to you."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => {
            const category = getCategory(request.category);
            const status = getRequestStatus(request.status);
            const urgency = getUrgency(request.urgency);
            const Icon = category.icon;
            const editing = editingId === request._id;

            return (
              <div
                key={request._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-md shadow-ink-900/5"
              >
                {editing ? (
                  <div className="space-y-3 p-4">
                    <Input label="Title" name="title" value={editForm.title} onChange={handleEditChange} />
                    <Textarea
                      label="Details"
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
                      <Select label="Urgency" name="urgency" value={editForm.urgency} onChange={handleEditChange}>
                        {URGENCY.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.label}
                          </option>
                        ))}
                      </Select>
                      <Select label="Status" name="status" value={editForm.status} onChange={handleEditChange}>
                        {Object.entries(REQUEST_STATUS).map(([id, s]) => (
                          <option key={id} value={id}>
                            {s.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => saveEdit(request._id)} disabled={saving} className="flex-1">
                        {saving ? 'Saving…' : 'Save'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-ink-200 bg-gradient-to-br from-cream-50 to-cream-100 px-4 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
                        <Icon className="h-4 w-4" />
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
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(request)} className="flex-1">
                          <LuPencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(request)} className="flex-1">
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
        title="Delete this request?"
        message={`"${deleteTarget?.title}" will be removed permanently.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MyRequests;
