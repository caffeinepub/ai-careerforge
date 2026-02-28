import { useRef, useState, useEffect } from 'react';
import { useCursor } from '../hooks/useCursorContext';
import MagneticButton from './MagneticButton';
import HeroGrid from './HeroGrid';
import type { Student } from '../backend';

interface HeroProps {
  student: Student;
}

export default function Hero({ student }: HeroProps) {
  const { setCursorState } = useCursor();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isFragmented, setIsFragmented] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gradientStyle = {
    background: `linear-gradient(${mousePos.x * 360}deg, #00f5ff, #9d00ff, #ff00c8)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setCursorState('orb')}
      onMouseLeave={() => setCursorState('default')}
    >
      {/* Background layers */}
      {/* Layer 1: Starfield image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/hero-starfield.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -20}px)`,
          transition: 'transform 0.1s ease',
        }}
      />

      {/* Layer 2: Three.js grid */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)`,
          transition: 'transform 0.15s ease',
        }}
      >
        <HeroGrid />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-space-black/60 via-transparent to-space-black" />

      {/* Layer 3: Foreground content */}
      <div
        className="relative z-[3] text-center px-6 max-w-5xl mx-auto"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * 5}px, ${(mousePos.y - 0.5) * 5}px)`,
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Glassmorphism name card */}
        <div
          className={`glass-card neon-glow-cyan p-8 md:p-12 mb-8 relative overflow-hidden transition-all duration-500 ${isFragmented ? 'scale-105' : ''}`}
          onMouseEnter={() => setIsFragmented(true)}
          onMouseLeave={() => setIsFragmented(false)}
        >
          {/* Fragment shards */}
          {isFragmented && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-neon-cyan/30 bg-neon-cyan/5"
                  style={{
                    width: `${20 + Math.random() * 30}%`,
                    height: `${15 + Math.random() * 25}%`,
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
                    transform: `rotate(${(Math.random() - 0.5) * 20}deg) translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`,
                    transition: 'all 0.3s ease',
                    opacity: 0.6,
                  }}
                />
              ))}
            </>
          )}

          <div className="font-mono text-xs tracking-[0.5em] text-neon-cyan/60 mb-4 animate-in fade-in duration-500">
            STUDENT PORTFOLIO // 2025
          </div>

          <h1
            className="font-orbitron text-5xl md:text-8xl font-black tracking-wider mb-4"
            style={gradientStyle}
          >
            {student.name}
          </h1>

          <div className="font-mono text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            {student.bio}
          </div>

          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent animate-[scan_4s_linear_infinite]" />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <MagneticButton
            className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-cyan"
            onClick={() => scrollToSection('projects')}
          >
            VIEW MY WORK
          </MagneticButton>
          <MagneticButton
            className="border-neon-violet text-neon-violet hover:bg-neon-violet/10 hover:shadow-neon-violet"
            onClick={() => scrollToSection('contact')}
          >
            CONNECT
          </MagneticButton>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-white/30">
          <span className="font-mono text-xs tracking-widest">SCROLL TO EXPLORE</span>
          <div className="w-px h-12 bg-gradient-to-b from-neon-cyan/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
