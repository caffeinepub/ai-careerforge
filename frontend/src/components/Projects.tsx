import { useRef, useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ProjectCard from './ProjectCard';
import type { Project } from '../backend';

interface ProjectsProps {
  projects: Project[];
}

const PROJECT_COLORS = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88', '#ff8800'];

export default function Projects({ projects }: ProjectsProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const lastScrollY = useRef(0);
  const velocityRef = useRef(0);
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      velocityRef.current = delta * 0.5;

      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setCenteredIndex(Math.floor(progress * (projects.length - 1)));
    };

    const animateInertia = () => {
      velocityRef.current *= 0.92;
      rotationRef.current += velocityRef.current * 0.1;
      rotationRef.current *= 0.95;
      setScrollRotation(rotationRef.current);
      rafRef.current = requestAnimationFrame(animateInertia);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animateInertia);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [projects.length]);

  const bgColor = PROJECT_COLORS[centeredIndex % PROJECT_COLORS.length];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${bgColor}08 0%, #050510 60%)`,
        transition: 'background 0.5s ease',
      }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section-fade-in ${isVisible ? 'visible' : ''} max-w-7xl mx-auto px-6`}
      >
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[0.5em] text-neon-magenta/60 mb-2">05 // THE LAB</div>
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white">
            PROJECT <span className="neon-text-magenta">GALLERY</span>
          </h2>
          <p className="font-mono text-sm text-white/40 mt-3">Click any card to explore the full project</p>
        </div>

        {/* 3D card grid */}
        <div className="flex gap-6 overflow-x-auto pb-6 justify-start md:justify-center" style={{ perspective: '1200px' }}>
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              index={i}
              scrollRotation={scrollRotation}
            />
          ))}
        </div>

        {/* Color indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: PROJECT_COLORS[i % PROJECT_COLORS.length],
                opacity: i === centeredIndex ? 1 : 0.3,
                transform: i === centeredIndex ? 'scale(1.5)' : 'scale(1)',
                boxShadow: i === centeredIndex ? `0 0 8px ${PROJECT_COLORS[i % PROJECT_COLORS.length]}` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
