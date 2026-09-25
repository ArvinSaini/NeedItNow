import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { m } from 'framer-motion';
import { LuArrowRight, LuCircleAlert } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import Wordmark from '../components/ui/Wordmark';
import { apiFetch, setSession } from '../lib/api';
import { EMAIL_PATTERN, EMAIL_MESSAGE } from '../lib/constants';

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: 'Your name', maxLength: 50 },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@college.edu', maxLength: 80 },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters', minLength: 6, maxLength: 64 },
  { name: 'phone', label: 'Phone (10 digits)', type: 'tel', placeholder: '9876543210', inputMode: 'numeric', maxLength: 10 },
  { name: 'hostel', label: 'Hostel', type: 'text', placeholder: 'e.g. Hostel 4', maxLength: 30 },
  { name: 'roomNumber', label: 'Room number', type: 'text', placeholder: 'e.g. 212', maxLength: 8 },
];

/* per-field input sanitizers — block invalid characters as the user types */
const SANITIZERS = {
  name: (v) => v.replace(/[^a-zA-Z\s.'-]/g, ''),
  email: (v) => v.toLowerCase(),
  phone: (v) => v.replace(/\D/g, '').slice(0, 10),
  roomNumber: (v) => v.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 8),
};

const validate = (form) => {
  if (form.name.trim().length < 2) return 'Please enter your full name (at least 2 letters).';
  if (!EMAIL_PATTERN.test(form.email)) return EMAIL_MESSAGE;
  if (form.password.length < 6) return 'Password must be at least 6 characters.';
  if (!/^\d{10}$/.test(form.phone)) return 'Phone number must be exactly 10 digits.';
  if (!form.hostel.trim()) return 'Please enter your hostel.';
  if (!form.roomNumber.trim()) return 'Please enter your room number.';
  return '';
};

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.name, ''])),
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailError = emailTouched && form.email && !EMAIL_PATTERN.test(form.email) ? EMAIL_MESSAGE : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitized = SANITIZERS[name] ? SANITIZERS[name](value) : value;
    if (name === 'email') setEmailTouched(true);
    if (error) setError('');
    setForm({ ...form, [name]: sanitized });
  };

  const handleEmailBlur = () => setEmailTouched(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/user/signup', { method: 'POST', body: form });
      setSession(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="auth-glow flex flex-1 items-center justify-center px-4 py-14">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl rounded-3xl border border-ink-200 bg-white p-9 text-center shadow-xl shadow-ink-900/10"
        >
          <div className="flex justify-center">
            <Wordmark variant="light" showText={false} size="lg" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">
            Join your <span className="serif-accent text-primary-500">hostel</span>
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Create an account and start sharing with your community
          </p>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left text-sm font-medium text-primary-700">
              <LuCircleAlert className="h-4 w-4 flex-none" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <Input
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  onBlur={field.name === 'email' ? handleEmailBlur : undefined}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  minLength={field.minLength}
                  inputMode={field.inputMode}
                  error={field.name === 'email' ? emailError : undefined}
                  required
                />
              ))}
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-6 w-full"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create free account'}
              {!loading && <LuArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-5 text-sm text-ink-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Log in
            </Link>
          </p>
        </m.div>
      </main>
    </div>
  );
};

export default Signup;
