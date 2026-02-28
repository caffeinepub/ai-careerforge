import { useRef, useEffect, useState } from 'react';
import FlipCard from './FlipCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { Milestone } from '../backend';

interface TimelineProps {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setScrollProgress(progress);

      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        scrollRef.current.scrollLeft = progress * maxScroll;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background color based on scroll progress
  const getBgColor = () => {
    if (scrollProgress < 0.33) {
      return `rgba(5, 5, 16, ${0.95 - scrollProgress * 0.5})`;
    } else if (scrollProgress < 0.66) {
      const t = (scrollProgress - 0.33) / 0.33;
      return `rgba(${Math.floor(t * 20)}, ${Math.floor(t * 10)}, ${Math.floor(40 + t * 20)}, 0.8)`;
    } else {
      const t = (scrollProgress - 0.66) / 0.34;
      return `rgba(${Math.floor(t * 30)}, ${Math.floor(t * 5)}, ${Math.floor(60 + t * 40)}, 0.9)`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative"
      style={{ height: `${(milestones.length + 1) * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden transition-colors duration-500"
        style={{ background: getBgColor() }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${scrollProgress * 100}% 50%, rgba(157, 0, 255, 0.1) 0%, transparent 60%)`,
          }}
        />

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`section-fade-in ${isVisible ? 'visible' : ''} px-8 mb-8`}
        >
          <div className="font-mono text-xs tracking-[0.5em] text-neon-violet/60 mb-2">03 // CONSCIOUSNESS STREAM</div>
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white">
            MY <span className="neon-text-violet">JOURNEY</span>
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 px-8 pb-4 overflow-x-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {/* Timeline line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-neon-violet/30 to-transparent pointer-events-none" />

          {milestones.map((milestone, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <FlipCard milestone={milestone} index={i} />
              {/* Connector dot */}
              <div
                className="w-3 h-3 rounded-full border-2 border-neon-violet"
                style={{ boxShadow: '0 0 10px rgba(157, 0, 255, 0.6)' }}
              />
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="h-px bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all duration-100"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
