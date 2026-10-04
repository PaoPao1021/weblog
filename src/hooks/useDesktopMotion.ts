import { useEffect, useState } from 'react';

const query = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function useDesktopMotion() {
  const [enabled, setEnabled] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setEnabled(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return enabled;
}
