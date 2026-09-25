import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { m } from 'framer-motion';
import {
  LuSearch,
  LuMessagesSquare,
  LuArchive,
  LuClipboardList,
  LuCirclePlus,
  LuMessageCirclePlus,
  LuUsers,
  LuPackage,
  LuInbox,
  LuLogOut,
  LuMenu,
  LuX,
} from 'react-icons/lu';
import Wordmark from './ui/Wordmark';
import ListingsBrowser from './ListingsBrowser';
import RequestsBrowser from './RequestsBrowser';
import MyListings from './MyListings';
import MyRequests from './MyRequests';
import AddListing from './AddListing';
import AddRequest from './AddRequest';
import ManageUsers from './ManageUsers';
import ManageListings from './ManageListings';
import ManageRequests from './ManageRequests';
import { apiFetch, clearSession, getToken, getUser, setSession } from '../lib/api';

const buildTabs = (setActiveTab) => [
  {
    group: 'Browse',
    items: [
      {
        id: 'browseListings',
        label: 'Browse listings',
        icon: LuSearch,
        title: 'Browse listings',
        sub: 'Everything shared across your hostel',
        render: () => <ListingsBrowser />,
      },
      {
        id: 'browseRequests',
        label: 'Browse requests',
        icon: LuMessagesSquare,
        title: 'Browse requests',
        sub: 'What your hostel mates are looking for',
        render: () => <RequestsBrowser />,
      },
    ],
  },
  {
    group: 'My items',
    items: [
      {
        id: 'myListings',
        label: 'My listings',
        icon: LuArchive,
        title: 'My listings',
        sub: 'Items you have shared with the hostel',
        render: () => <MyListings />,
      },
      {
        id: 'myRequests',
        label: 'My requests',
        icon: LuClipboardList,
        title: 'My requests',
        sub: 'Things you have asked for',
        render: () => <MyRequests />,
      },
      {
        id: 'addListing',
        label: 'Add listing',
        icon: LuCirclePlus,
        title: 'Add a listing',
        sub: 'Share something to lend or sell',
        render: () => <AddListing onSuccess={() => setActiveTab('myListings')} />,
      },
      {
        id: 'addRequest',
        label: 'Post request',
        icon: LuMessageCirclePlus,
        title: 'Post a request',
        sub: 'Ask your hostel for what you need',
        render: () => <AddRequest onSuccess={() => setActiveTab('myRequests')} />,
      },
    ],
  },
  {
    group: 'Admin panel',
    adminOnly: true,
    items: [
      {
        id: 'manageUsers',
        label: 'Manage users',
        icon: LuUsers,
        title: 'Manage users',
        sub: 'All registered members',
        render: () => <ManageUsers />,
      },
      {
        id: 'manageListings',
        label: 'Manage listings',
        icon: LuPackage,
        title: 'Manage listings',
        sub: 'Every listing on the platform',
        render: () => <ManageListings />,
      },
      {
        id: 'manageRequests',
        label: 'Manage requests',
        icon: LuInbox,
        title: 'Manage requests',
        sub: 'Every request on the platform',
        render: () => <ManageRequests />,
      },
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser);

  /* Refresh the cached user (role, hostel) and trip the session handler early if the token is dead.
     Non-auth failures (legacy backend, network) keep the cached user. */
  useEffect(() => {
    let cancelled = false;
    apiFetch('/user/me', { auth: true })
      .then((data) => {
        if (cancelled || !data?.user) return;
        setSession(getToken(), data.user);
        setUser(data.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('browseListings');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabGroups = useMemo(
    () => buildTabs(setActiveTab).filter((g) => !g.adminOnly || isAdmin),
    [isAdmin],
  );
  const allTabs = tabGroups.flatMap((g) => g.items);
  const current = allTabs.find((t) => t.id === activeTab) || allTabs[0];

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const selectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Mobile top bar */}
      <div className="sidebar-gradient fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between px-4 lg:hidden">
        <Wordmark variant="onGradient" to="/" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-white hover:bg-white/15"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`sidebar-gradient fixed inset-y-0 left-0 z-20 flex w-64 flex-col px-3.5 py-6 pt-20 transition-transform duration-200 lg:static lg:translate-x-0 lg:pt-6 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="hidden px-2.5 pb-4 lg:block">
          <Wordmark variant="onGradient" to="/" />
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {tabGroups.map((group) => (
            <div key={group.group}>
              <div className="px-3 pb-1.5 pt-4 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/55">
                {group.group}
              </div>
              {group.items.map((tab) => {
                const active = tab.id === current.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? 'bg-cream-200 font-bold text-primary-700 shadow-md shadow-primary-900/25'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 flex-none" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Profile + logout */}
        <div className="mt-4 border-t border-white/20 pt-4">
          <div className="flex items-center gap-2.5 px-2">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-cream-200 font-extrabold text-primary-700">
              {(user?.name || '?').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{user?.name}</div>
              <div className="truncate text-[0.7rem] text-white/60">
                {isAdmin ? 'Admin' : 'Member'}
                {user?.hostel && ` · Hostel ${user.hostel}`}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LuLogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-ink-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-8 lg:pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{current.title}</h1>
          <p className="mt-0.5 text-sm text-ink-400">{current.sub}</p>
        </div>
        <m.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {current.render()}
        </m.div>
      </main>
    </div>
  );
};

export default Dashboard;
