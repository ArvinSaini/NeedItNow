import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuLogOut, LuMenu, LuX } from 'react-icons/lu';
import { clearSession } from '../lib/api';
import useSession from '../lib/useSession';
import Wordmark from './ui/Wordmark';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/listings', label: 'Browse' },
  { path: '/requests', label: 'Requests' },
  { path: '/aboutus', label: 'About' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSession();
  const loggedIn = Boolean(token);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <nav className="brand-gradient sticky top-0 z-40 shadow-md shadow-primary-900/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark variant="onGradient" />

        {/* Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'border-b-2 border-white pb-0.5 font-bold text-white'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {loggedIn && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'border-b-2 border-white pb-0.5 font-bold text-white'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          )}
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              <LuLogOut className="h-4 w-4" />
              Log out
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white/85 transition-colors hover:text-white">
              Log in
            </Link>
          )}
          <Link
            to="/signup"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-primary-700 shadow-md shadow-primary-900/20 transition-transform hover:-translate-y-0.5"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-white transition-colors hover:bg-white/15 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <LuX className="h-6 w-6" /> : <LuMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/20 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary-500 text-white'
                    : 'text-ink-600 hover:bg-cream-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {loggedIn && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-600 hover:bg-cream-50"
              >
                Dashboard
              </Link>
            )}
            {loggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-ink-600 hover:bg-cream-50"
              >
                <LuLogOut className="h-4 w-4" />
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-600 hover:bg-cream-50"
              >
                Log in
              </Link>
            )}
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl bg-primary-500 px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
