import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken, getUser, SESSION_USER_EVENT } from './api';

const readSession = () => ({ token: getToken(), user: getUser() });

/* Tiny shared "am I logged in" subscription — used by the Navbar (and anywhere else that only
   needs to react to login/logout, not drive its own session polling). Re-reads on:
   - route change, so a redirect right after login/logout (e.g. Dashboard's own logout) is
     picked up even if the event below raced the navigation;
   - SESSION_USER_EVENT, dispatched by setSession/clearSession for same-tab changes (including
     useSessionWatch's periodic re-checks);
   - the `storage` event on the `token` key, for logins/logouts in OTHER tabs. */
export default function useSession() {
  const location = useLocation();
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    setSession(readSession());
  }, [location.pathname]);

  useEffect(() => {
    const refresh = () => setSession(readSession());
    const onStorage = (e) => {
      if (e.key === 'token') refresh();
    };
    window.addEventListener(SESSION_USER_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SESSION_USER_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return session;
}
