import { useEffect, useRef, useState } from 'react';

/* Shared by ListingCard/RequestCard: tells a line-clamped description element whether it is
   actually truncating its text, so the "Full details" link (and card-click-to-open behaviour)
   only appears when there is more to see. Re-measures on resize (ResizeObserver), whenever the
   watched text changes, and once more after webfonts finish loading — font swaps can shift
   line heights enough to change whether text overflows. */
export default function useIsClamped(text) {
  const ref = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const measure = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [text]);

  return [ref, isClamped];
}
