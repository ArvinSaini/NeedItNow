import { useState } from 'react';
import { LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
import Button from './ui/Button';
import { Input, Select, Textarea } from './ui/Field';
import { apiFetch } from '../lib/api';
import { CATEGORIES, URGENCY } from '../lib/constants';

const INITIAL = { title: '', description: '', category: 'books', urgency: 'medium' };

const AddRequest = ({ onSuccess }) => {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/request', { method: 'POST', auth: true, body: form });
      setSuccess(true);
      setForm(INITIAL);
      setTimeout(() => onSuccess?.(), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-ink-200 bg-white p-7 shadow-md shadow-ink-900/5">
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <LuCircleAlert className="h-4 w-4 flex-none" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <LuCircleCheck className="h-4 w-4 flex-none" />
          Request posted! Taking you to your requests…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="What do you need?"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Scientific calculator for exam week"
          required
        />
        <Textarea
          label="Details"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="When you need it, for how long, anything specific…"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <Select label="Urgency" name="urgency" value={form.urgency} onChange={handleChange}>
            {URGENCY.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Posting…' : 'Post request'}
        </Button>
      </form>
    </div>
  );
};

export default AddRequest;
