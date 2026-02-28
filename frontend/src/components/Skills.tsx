import { useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SkillGlobe from './SkillGlobe';
import CodeParticles from './CodeParticles';
import { useCursor } from '../hooks/useCursorContext';

interface SkillsProps {
  skills: string[];
}

export default function Skills({ skills }: SkillsProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { setCursorState } = useCursor();

  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0520 50%, #050510 100%)' }}
      onMouseEnter={() => setCursorState('default')}
    >
      <CodeParticles />

      {/* Hex grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'url(/assets/generated/hex-grid-overlay.dim_1024x1024.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section-fade-in ${isVisible ? 'visible' : ''} relative z-10 w-full max-w-6xl mx-auto px-6`}
      >
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[0.5em] text-neon-cyan/60 mb-2">04 // DIGITAL NEXUS</div>
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white">
            SKILL <span className="neon-text-cyan">MATRIX</span>
          </h2>
          <p className="font-mono text-sm text-white/40 mt-3 max-w-xl mx-auto">
            Hover nodes to explore skill connections. Drag to rotate.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Globe */}
          <div className="w-full lg:w-1/2 h-[500px] relative">
            <SkillGlobe skills={skills} />
          </div>

          {/* Skill badges */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {skills.map((skill, i) => {
                const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88'];
                const color = colors[i % colors.length];
                return (
                  <div
                    key={skill}
                    className="glass-card px-4 py-2 font-mono text-xs tracking-wider transition-all duration-300 hover:scale-105"
                    style={{
                      border: `1px solid ${color}30`,
                      color,
                      boxShadow: `0 0 10px ${color}20`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
