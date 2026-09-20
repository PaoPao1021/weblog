import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
}

export default function Background() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    let frame = 0;
    let litSurface: HTMLElement | null = null;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const move = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (media.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty('--pointer-x', `${(event.clientX / innerWidth) * 100}%`);
        ref.current?.style.setProperty('--pointer-y', `${(event.clientY / innerHeight) * 100}%`);
        const target = (event.target as Element).closest<HTMLElement>(
          '.glass-panel, .glass-window, .hero-app, .search-trigger, .project-card, .note-card'
        );
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
    const reset = () => {
      ref.current?.style.setProperty('--pointer-x', '50%');
      ref.current?.style.setProperty('--pointer-y', '40%');
      litSurface?.style.removeProperty('--light-strength');
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', visibility);

    // Subtle ambient particle canvas
    const canvas = canvasRef.current;
    let animId = 0;

    if (canvas && !media.matches) {
      const ctx = canvas.getContext('2d');
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const resizeCanvas = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resizeCanvas);

      const particleCount = 24;
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.24,
          radius: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.45 + 0.15,
          phase: Math.random() * Math.PI * 2,
        });
      }

      const render = (time: number) => {
        if (document.hidden) {
          animId = requestAnimationFrame(render);
          return;
        }
        ctx?.clearRect(0, 0, width, height);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const color = isDark ? '180, 215, 255' : '90, 135, 185';

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Parallax mouse repulsion
          const dx = pointerX - p.x;
          const dy = pointerY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.x -= (dx / dist) * force * 0.6;
            p.y -= (dy / dist) * force * 0.6;
          }

          // Gentle breathing opacity
          const pulse = Math.sin(time * 0.0012 + p.phase) * 0.15;
          const curAlpha = Math.max(0.05, Math.min(0.65, p.alpha + pulse));

          if (ctx) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${curAlpha})`;
            ctx.fill();
          }
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(frame);
        cancelAnimationFrame(animId);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('resize', resizeCanvas);
        document.documentElement.removeEventListener('pointerleave', reset);
        document.removeEventListener('visibilitychange', visibility);
      };
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return (
    <div className="environment" ref={ref} aria-hidden="true">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="environment-grid" />
      <div className="environment-noise" />
      <div className="cursor-light" />
      <canvas ref={canvasRef} className="environment-particles" />
    </div>
  );
}
