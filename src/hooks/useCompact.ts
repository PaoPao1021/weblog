import { useEffect, useState } from 'react';
const query = '(max-width: 1023px), (pointer: coarse)';
export function useCompact() {
  const [compact, setCompact] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query); const sync = () => setCompact(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return compact;
}
