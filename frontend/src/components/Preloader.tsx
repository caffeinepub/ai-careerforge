import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

interface PreloaderProps {
  onComplete: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  phase: 'scatter' | 'converge' | 'hold' | 'explode';
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<'scatter' | 'converge' | 'hold' | 'explode'>('scatter');
  const [greeting] = useState(getGreeting());
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    if (reducedMotion) {
      setShowText(true);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 600);
      }, 1500);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Generate silhouette target points (human figure shape)
    const silhouettePoints: { x: number; y: number }[] = [];
    const scale = Math.min(W, H) * 0.35;

    // Head
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      silhouettePoints.push({
        x: cx + Math.cos(a) * scale * 0.12,
        y: cy - scale * 0.55 + Math.sin(a) * scale * 0.12,
      });
    }
    // Body
    for (let t = 0; t < 1; t += 0.05) {
      const bodyW = scale * (0.18 - t * 0.06);
      silhouettePoints.push({ x: cx - bodyW, y: cy - scale * 0.4 + t * scale * 0.5 });
      silhouettePoints.push({ x: cx + bodyW, y: cy - scale * 0.4 + t * scale * 0.5 });
    }
    // Arms
    for (let t = 0; t < 1; t += 0.08) {
      silhouettePoints.push({ x: cx - scale * 0.18 - t * scale * 0.22, y: cy - scale * 0.35 + t * scale * 0.3 });
      silhouettePoints.push({ x: cx + scale * 0.18 + t * scale * 0.22, y: cy - scale * 0.35 + t * scale * 0.3 });
    }
    // Legs
    for (let t = 0; t < 1; t += 0.06) {
      silhouettePoints.push({ x: cx - scale * 0.1, y: cy + t * scale * 0.5 });
      silhouettePoints.push({ x: cx + scale * 0.1, y: cy + t * scale * 0.5 });
    }

    const PARTICLE_COUNT = 300;
    const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88'];

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const target = silhouettePoints[i % silhouettePoints.length];
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        targetX: target.x + (Math.random() - 0.5) * 8,
        targetY: target.y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: 'scatter',
      };
    });

    // Phase timeline
    setTimeout(() => { phaseRef.current = 'converge'; }, 800);
    setTimeout(() => { phaseRef.current = 'hold'; setShowText(true); }, 2200);
    setTimeout(() => { phaseRef.current = 'explode'; }, 3200);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 700);
    }, 3800);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, W, H);

      particlesRef.current.forEach(p => {
        const phase = phaseRef.current;

        if (phase === 'scatter') {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        } else if (phase === 'converge') {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.vx += dx * 0.04;
          p.vy += dy * 0.04;
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.x += p.vx;
          p.y += p.vy;

          // Mouse repulsion
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 80) {
            const force = (80 - dist) / 80;
            p.vx += (mdx / dist) * force * 3;
            p.vy += (mdy / dist) * force * 3;
          }
        } else if (phase === 'hold') {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.vx += dx * 0.06;
          p.vy += dy * 0.06;
          p.vx *= 0.85;
          p.vy *= 0.85;
          p.x += p.vx;
          p.y += p.vy;

          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 60) {
            const force = (60 - dist) / 60;
            p.vx += (mdx / dist) * force * 2;
            p.vy += (mdy / dist) * force * 2;
          }
        } else if (phase === 'explode') {
          p.vx += (Math.random() - 0.5) * 2;
          p.vy += (Math.random() - 0.5) * 2 + 0.5;
          p.vx *= 1.05;
          p.vy *= 1.05;
          p.x += p.vx;
          p.y += p.vy;
          p.opacity -= 0.02;
        }

        if (p.opacity <= 0) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9980] flex items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: '#050510' }}
    >
      {!reducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      {showText && (
        <div className="relative z-10 text-center pointer-events-none">
          <div className="font-orbitron text-sm tracking-[0.5em] text-neon-cyan/60 mb-2 animate-in fade-in duration-500">
            {greeting}, Visitor
          </div>
          <div className="font-orbitron text-5xl md:text-7xl font-black tracking-widest neon-text-cyan animate-in fade-in duration-700 delay-200">
            NEXUS
          </div>
          <div className="font-mono text-xs tracking-[0.3em] text-white/40 mt-3 animate-in fade-in duration-700 delay-500">
            INITIALIZING EXPERIENCE...
          </div>
        </div>
      )}

      {reducedMotion && (
        <div className="text-center">
          <div className="font-orbitron text-sm tracking-[0.5em] text-neon-cyan/60 mb-2">{greeting}, Visitor</div>
          <div className="font-orbitron text-5xl font-black tracking-widest neon-text-cyan">NEXUS</div>
          <div className="font-mono text-xs tracking-[0.3em] text-white/40 mt-3">INITIALIZING...</div>
        </div>
      )}
    </div>
  );
}
