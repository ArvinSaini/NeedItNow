import { useEffect, useRef } from 'react';
import { apiFetch, getToken, setSession } from './api';

const POLL_MS = 15000;

/* App-wide watcher, mounted once inside the router so it runs on every page (public or
   dashboard). While a token exists it periodically re-checks /user/me so a block applied
   elsewhere ends the session (and shows the warning banner) within seconds, not only on the
   next authenticated request. apiFetch already calls endSession() for a blocked/expired
   response, so this hook only needs to trigger the check and swallow anything else. */
export default function useSessionWatch() {
  const checkingRef = useRef(false);

  useEffect(() => {
    const check = () => {
      if (checkingRef.current) return; // never overlap in-flight checks
      const token = getToken();
      if (!token) return;
      checkingRef.current = true;
      apiFetch('/user/me', { auth: true })
        .then((data) => {
          if (data?.user) setSession(getToken(), data.user);
        })
        .catch(() => {
          /* apiFetch already ends the session for blocked/expired; ignore everything else */
        })
        .finally(() => {
          checkingRef.current = false;
        });
    };

    check();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') check();
    }, POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    const onFocus = () => check();

    /* Other tabs: endSession() removes `token` and stamps `sessionEndReason` before it does.
       A normal logout in another tab removes `token` too, but never stamps a reason. */
    const onStorage = (e) => {
      if (e.key !== 'token' || e.newValue) return; // only care about token being removed
      const reason = localStorage.getItem('sessionEndReason');
      if (reason) {
        if (window.location.pathname === '/login' && new URLSearchParams(window.location.search).get('reason') === reason) {
          return; // already showing this exact notice, avoid redirect loop
        }
        window.location.assign(`/login?reason=${reason}`);
      } else if (window.location.pathname === '/dashboard') {
        window.location.assign('/login');
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
}
