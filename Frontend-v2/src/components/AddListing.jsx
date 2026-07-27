import { useState } from 'react';
import { LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
import Button from './ui/Button';
import { Input, Select, Textarea } from './ui/Field';
import { apiFetch } from '../lib/api';
import { CATEGORIES } from '../lib/constants';

const INITIAL = { title: '', description: '', category: 'books', type: 'lend', price: 0 };

const AddListing = ({ onSuccess }) => {
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
      await apiFetch('/product', {
        method: 'POST',
        auth: true,
        body: { ...form, price: Number(form.price) || 0 },
      });
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
          Listing created! Taking you to your listings…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Engineering Mathematics — Kreyszig"
          required
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Condition, how long you can lend it, pickup details…"
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
          <Select label="Type" name="type" value={form.type} onChange={handleChange}>
            <option value="lend">Lend — let someone borrow it</option>
            <option value="sell">Sell — set a price</option>
          </Select>
        </div>
        <Input
          label={form.type === 'sell' ? 'Price (₹)' : 'Borrowing charge (₹) — leave 0 for free'}
          type="number"
          name="price"
          min="0"
          value={form.price}
          onChange={handleChange}
          required={form.type === 'sell'}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Publishing…' : 'Publish listing'}
        </Button>
      </form>
    </div>
  );
};

export default AddListing;
