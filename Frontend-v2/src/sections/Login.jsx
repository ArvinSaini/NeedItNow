import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { m } from 'framer-motion';
import { LuArrowRight, LuCircleAlert, LuInfo, LuShieldAlert } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import Wordmark from '../components/ui/Wordmark';
import { apiFetch, setSession } from '../lib/api';

const NOTICES = {
  expired: 'Your session has expired. Please log in again.',
  blocked: "Your account has been blocked by the admin, so you've been logged out.",
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const notice = NOTICES[reason];
  const isBlocked = reason === 'blocked';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/user/login', { method: 'POST', body: form });
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
          className="w-full max-w-sm rounded-3xl border border-ink-200 bg-white p-9 text-center shadow-xl shadow-ink-900/10"
        >
          <div className="flex justify-center">
            <Wordmark variant="light" showText={false} size="lg" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">
            Welcome <span className="serif-accent text-primary-500">back</span>
          </h1>
          <p className="mt-1 text-sm text-ink-400">Log in to your hostel community</p>

          {notice && !error && isBlocked && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left text-sm font-medium text-primary-700">
              <LuShieldAlert className="h-4 w-4 flex-none" />
              {notice}
            </div>
          )}

          {notice && !error && !isBlocked && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-left text-sm font-medium text-cream-800">
              <LuInfo className="h-4 w-4 flex-none" />
              {notice}
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left text-sm font-medium text-primary-700">
              <LuCircleAlert className="h-4 w-4 flex-none" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
              {!loading && <LuArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-5 text-sm text-ink-400">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </m.div>
      </main>
    </div>
  );
};

export default Login;
