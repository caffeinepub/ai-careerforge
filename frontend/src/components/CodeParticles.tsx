import { useEffect, useRef } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

const CODE_CHARS = ['0', '1', '{', '}', '<', '>', '/', ';', '=', '(', ')', 'fn', 'if', '&&', '||', '=>'];

interface Particle {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  color: string;
  size: number;
}

export default function CodeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88'];
    const PARTICLE_COUNT = 60;

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.3 + Math.random() * 0.7,
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 10 + Math.random() * 6,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        p.y -= p.speed;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        }

        ctx.font = `${p.size}px 'Space Mono', monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fillText(p.char, p.x, p.y);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}
