import type { ComponentProps } from 'react';
import { useDesktopMotion } from '../../hooks/useDesktopMotion';

/** Keep the hit area fixed; light, shadows and icons provide pointer feedback. */
export function MotionButton({ children, className = '', onPointerMove, ...props }: ComponentProps<'button'>) {
  const enabled = useDesktopMotion();
  return <button {...props} className={`motion-control ${className}`}
    onPointerMove={event => {
      onPointerMove?.(event);
      if (!enabled || event.pointerType !== 'mouse') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--press-x', `${event.clientX - bounds.left}px`);
      event.currentTarget.style.setProperty('--press-y', `${event.clientY - bounds.top}px`);
    }}
  >{children}</button>;
}
