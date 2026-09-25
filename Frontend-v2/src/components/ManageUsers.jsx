import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuUsers, LuCircleAlert } from 'react-icons/lu';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';
import StatCard from './ui/StatCard';
import Badge from './ui/Badge';
import ConfirmDialog from './ui/ConfirmDialog';
import FilterChips from './ui/FilterChips';
import { apiFetch, getUser } from '../lib/api';

const STATUS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'blocked', label: 'Blocked' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const me = getUser();
  const myId = me?.id || me?._id;

  useEffect(() => {
    let cancelled = false;
    apiFetch('/admin/users', { auth: true })
      .then((data) => {
        if (!cancelled) setUsers(data.users || []);
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
    return users.filter((u) => {
      if (statusFilter === 'active' && u.isBlocked) return false;
      if (statusFilter === 'blocked' && !u.isBlocked) return false;
      if (q && !`${u.name} ${u.email} ${u.hostel}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, search, statusFilter]);

  const toggleBlock = async (user) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    setBusyId(user._id);
    setError('');
    try {
      await apiFetch(`/admin/users/${user._id}/${action}`, { method: 'PUT', auth: true });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    const id = deleteTarget._id;
    setDeleteTarget(null);
    setError('');
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE', auth: true });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading users…" />;

  const blockedCount = users.filter((u) => u.isBlocked).length;

  return (
    <div>
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <LuCircleAlert className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Active" value={users.length - blockedCount} />
        <StatCard label="Blocked" value={blockedCount} valueClassName="text-primary-600" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or hostel…"
            className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-11 pr-5 text-sm outline-none transition placeholder:text-ink-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15"
          />
        </div>
        <FilterChips options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={LuUsers} title="No users found" hint="Try a different search or filter." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white shadow-md shadow-ink-900/5">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-ink-50 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-ink-400">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Hostel</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isMe = user._id === myId;
                return (
                  <tr key={user._id} className="border-t border-ink-200">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-cream-100 text-xs font-bold text-cream-800">
                          {(user.name || '?').charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-ink-900">
                            {user.name}
                            {isMe && <span className="ml-1.5 text-xs font-medium text-ink-400">(you)</span>}
                          </div>
                          <div className="truncate text-xs text-ink-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-ink-600">
                      <div
                        className="max-w-40 truncate"
                        title={`${user.hostel ? `Hostel ${user.hostel}` : '—'}${user.roomNumber ? ` · ${user.roomNumber}` : ''}`}
                      >
                        {user.hostel ? `Hostel ${user.hostel}` : '—'}
                        {user.roomNumber && ` · ${user.roomNumber}`}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={user.role === 'admin' ? 'cream' : 'gray'}>{user.role || 'user'}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={user.isBlocked ? 'red' : 'ok'}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleBlock(user)}
                          disabled={isMe || busyId === user._id}
                          className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          disabled={isMe}
                          className="rounded-full border border-primary-200 bg-primary-50/50 px-3.5 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this user?"
        message={`${deleteTarget?.name} (${deleteTarget?.email}) will be removed permanently.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageUsers;
