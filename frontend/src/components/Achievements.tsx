import { useState } from 'react';
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation';
import GlobeScene from './GlobeScene';
import AchievementTooltip from './AchievementTooltip';
import type { ImpactPoint } from './GlobeScene';
import { Trophy, Star, Award, Zap } from 'lucide-react';

interface AchievementsProps {
  achievements: string[];
}

const STATS = [
  { label: 'Projects Shipped', value: 5, suffix: '+', color: '#00f5ff' },
  { label: 'GitHub Stars', value: 1000, suffix: '+', color: '#9d00ff' },
  { label: 'Users Impacted', value: 50, suffix: 'M+', color: '#ff00c8' },
  { label: 'Awards Won', value: 6, suffix: '', color: '#00ff88' },
];

function StatCard({ label, value, suffix, color, visible }: {
  label: string;
  value: number;
  suffix: string;
  color: string;
  visible: boolean;
}) {
  const count = useCountUp(value, 2000, visible);
  return (
    <div
      className="glass-card p-4 text-center transition-all duration-300 hover:scale-105"
      style={{ border: `1px solid ${color}30`, boxShadow: `0 0 20px ${color}15` }}
    >
      <div className="font-orbitron text-2xl font-black" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="font-mono text-xs text-white/40 mt-1">{label}</div>
    </div>
  );
}

const ACHIEVEMENT_ICONS = [Trophy, Star, Award, Zap, Trophy, Star];

export default function Achievements({ achievements }: AchievementsProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [hoveredPillar, setHoveredPillar] = useState<ImpactPoint | null>(null);

  return (
    <section
      id="achievements"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #080520 50%, #050510 100%)' }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section-fade-in ${isVisible ? 'visible' : ''} relative z-10 max-w-7xl mx-auto px-6`}
      >
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[0.5em] text-neon-green/60 mb-2">07 // GLOBAL IMPACT</div>
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white">
            WORLD <span className="neon-text-cyan">IMPACT</span>
          </h2>
          <p className="font-mono text-sm text-white/40 mt-3">Hover the glowing pillars to explore impact locations</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => (
            <StatCard key={i} {...stat} visible={isVisible} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Globe */}
          <div className="w-full lg:w-1/2 h-[400px] relative">
            <GlobeScene onPillarHover={setHoveredPillar} />
            {/* Tooltip */}
            {hoveredPillar && (
              <div className="absolute top-4 right-4 z-10">
                <AchievementTooltip data={hoveredPillar} />
              </div>
            )}
          </div>

          {/* Achievements list */}
          <div className="w-full lg:w-1/2 space-y-3">
            <div className="font-orbitron text-sm text-neon-cyan/60 tracking-widest mb-4">ACHIEVEMENTS</div>
            {achievements.map((achievement, i) => {
              const Icon = ACHIEVEMENT_ICONS[i % ACHIEVEMENT_ICONS.length];
              const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88', '#ff8800', '#00f5ff'];
              const color = colors[i % colors.length];
              return (
                <div
                  key={i}
                  className="glass-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    border: `1px solid ${color}20`,
                    boxShadow: `0 0 15px ${color}10`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="font-mono text-sm text-white/70">{achievement}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
