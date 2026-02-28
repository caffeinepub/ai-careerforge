import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../hooks/useCursorContext';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  opacity: number;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const smoothPosRef = useRef({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailIdRef = useRef(0);
  const { cursorState } = useCursor();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Add trail point in hero section
      if (cursorState === 'orb') {
        const id = trailIdRef.current++;
        setTrail(prev => [
          ...prev.slice(-12),
          { x: e.clientX, y: e.clientY, id, opacity: 1 }
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorState]);

  useEffect(() => {
    const animate = () => {
      const dx = posRef.current.x - smoothPosRef.current.x;
      const dy = posRef.current.y - smoothPosRef.current.y;
      smoothPosRef.current.x += dx * 0.15;
      smoothPosRef.current.y += dy * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${smoothPosRef.current.x}px, ${smoothPosRef.current.y}px)`;
      }

      // Fade trail
      setTrail(prev => prev
        .map(p => ({ ...p, opacity: p.opacity - 0.08 }))
        .filter(p => p.opacity > 0)
      );

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const getCursorStyle = () => {
    switch (cursorState) {
      case 'orb':
        return 'w-8 h-8 rounded-full border-2 border-neon-cyan bg-neon-cyan/10 shadow-neon-cyan';
      case 'beam':
        return 'w-1 h-12 rounded-full bg-neon-cyan shadow-neon-cyan-lg';
      case 'magnetic':
        return 'w-12 h-12 rounded-full border-2 border-neon-violet bg-neon-violet/10 shadow-neon-violet';
      case 'pointer':
        return 'w-6 h-6 rounded-full bg-neon-cyan shadow-neon-cyan';
      default:
        return 'w-4 h-4 rounded-full bg-neon-cyan/80';
    }
  };

  return (
    <>
      {/* Trail particles */}
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9999] rounded-full bg-neon-cyan"
          style={{
            left: 0,
            top: 0,
            width: `${Math.max(2, 6 - i * 0.4)}px`,
            height: `${Math.max(2, 6 - i * 0.4)}px`,
            transform: `translate(${point.x}px, ${point.y}px)`,
            opacity: point.opacity * 0.6,
            boxShadow: '0 0 6px rgba(0, 245, 255, 0.8)',
            transition: 'none',
            marginLeft: '-3px',
            marginTop: '-3px',
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[10000] transition-all duration-150 ${getCursorStyle()}`}
        style={{
          left: 0,
          top: 0,
          marginLeft: cursorState === 'beam' ? '-2px' : cursorState === 'orb' || cursorState === 'magnetic' ? '-24px' : '-8px',
          marginTop: cursorState === 'beam' ? '-24px' : cursorState === 'orb' || cursorState === 'magnetic' ? '-24px' : '-8px',
        }}
      />

      {/* Outer ring */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9998] w-10 h-10 rounded-full border border-neon-cyan/30"
        style={{
          left: 0,
          top: 0,
          marginLeft: '-20px',
          marginTop: '-20px',
          transform: `translate(${smoothPosRef.current.x}px, ${smoothPosRef.current.y}px)`,
          transition: 'transform 0.1s ease',
        }}
      />
    </>
  );
}
