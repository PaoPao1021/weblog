import { useEffect, useRef } from 'react';

export default function Background() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    let frame = 0;
    let litSurface: HTMLElement | null = null;
    const move = (event: PointerEvent) => {
      if (media.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty('--pointer-x', `${event.clientX / innerWidth * 100}%`);
        ref.current?.style.setProperty('--pointer-y', `${event.clientY / innerHeight * 100}%`);
        const target = (event.target as Element).closest<HTMLElement>('.glass-panel, .glass-window, .hero-app, .search-trigger, .project-card, .note-card');
        if (litSurface && litSurface !== target) litSurface.style.removeProperty('--light-strength');
        litSurface = target;
        if (target) {
          const rect = target.getBoundingClientRect();
          target.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
          target.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
          target.style.setProperty('--light-strength', '1');
        }
      });
    };
    const visibility = () => ref.current?.classList.toggle('paused', document.hidden);
    const reset = () => { ref.current?.style.setProperty('--pointer-x', '50%'); ref.current?.style.setProperty('--pointer-y', '40%'); litSurface?.style.removeProperty('--light-strength'); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', reset); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <div className="environment" ref={ref} aria-hidden="true"><div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" /><div className="environment-grid" /><div className="environment-noise" /><div className="cursor-light" /></div>;
}
