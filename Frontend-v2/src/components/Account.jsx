import { useState } from 'react';
import { LuCircleAlert, LuCircleCheck, LuKeyRound } from 'react-icons/lu';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Input } from './ui/Field';
import { apiFetch } from '../lib/api';
import { LIMITS } from '../lib/constants';

const INITIAL = { currentPassword: '', newPassword: '', confirmPassword: '' };

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-dashed border-ink-200 pb-3 last:border-0 last:pb-0">
    <dt className="text-ink-400">{label}</dt>
    <dd className="truncate font-medium text-ink-900">{value}</dd>
  </div>
);

const validate = (form) => {
  if (form.newPassword.length < LIMITS.password.min) {
    return `New password must be at least ${LIMITS.password.min} characters.`;
  }
  if (form.newPassword !== form.confirmPassword) return 'New passwords do not match.';
  if (form.newPassword === form.currentPassword) return 'New password must be different from the current one.';
  return '';
};

const Account = ({ user }) => {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiFetch('/user/password', {
        method: 'PUT',
        auth: true,
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      setSuccess('Password updated. Use it the next time you log in.');
      setForm(INITIAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-md shadow-ink-900/5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-cream-100 text-lg font-extrabold text-cream-800">
            {(user?.name || '?').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-ink-900">{user?.name}</div>
            <div className="truncate text-sm text-ink-400">{user?.email}</div>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <Row label="Hostel" value={user?.hostel ? `Hostel ${user.hostel}` : '—'} />
          <Row label="Room" value={user?.roomNumber || '—'} />
          <Row label="Phone" value={user?.phone || '—'} />
          <Row
            label="Role"
            value={<Badge tone={user?.role === 'admin' ? 'cream' : 'gray'}>{user?.role || 'user'}</Badge>}
          />
        </dl>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-md shadow-ink-900/5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <LuKeyRound className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-bold text-ink-900">Change password</h2>
            <p className="text-xs text-ink-400">Pick something only you know.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
            <LuCircleAlert className="h-4 w-4 flex-none" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <LuCircleCheck className="h-4 w-4 flex-none" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <Input
            label="New password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={LIMITS.password.min}
            maxLength={LIMITS.password.max}
            placeholder={`Min. ${LIMITS.password.min} characters`}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Account;
