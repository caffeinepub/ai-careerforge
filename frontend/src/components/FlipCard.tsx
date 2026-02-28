import { useState } from 'react';
import type { Milestone } from '../backend';

interface FlipCardProps {
  milestone: Milestone;
  index: number;
}

export default function FlipCard({ milestone, index }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88'];
  const color = colors[index % colors.length];

  return (
    <div
      className="relative w-64 h-80 flex-shrink-0"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      tabIndex={0}
      role="button"
      aria-label={`${milestone.title} - hover to see details`}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-card flex flex-col items-center justify-center p-6 text-center"
          style={{
            backfaceVisibility: 'hidden',
            border: `1px solid ${color}30`,
            boxShadow: `0 0 20px ${color}20`,
          }}
        >
          <div
            className="font-orbitron text-3xl font-black mb-3"
            style={{ color, textShadow: `0 0 10px ${color}80` }}
          >
            {milestone.date}
          </div>
          <div className="font-orbitron text-sm font-bold text-white/90 tracking-wide leading-tight">
            {milestone.title}
          </div>
          <div className="mt-4 w-8 h-px" style={{ background: color }} />
          <div className="mt-3 font-mono text-xs text-white/30">HOVER TO REVEAL</div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass-card flex flex-col justify-center p-6"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `1px solid ${color}50`,
            boxShadow: `0 0 30px ${color}30`,
          }}
        >
          <div className="font-mono text-xs tracking-widest mb-3" style={{ color }}>
            {milestone.date}
          </div>
          <div className="font-orbitron text-sm font-bold text-white mb-3">
            {milestone.title}
          </div>
          <div className="font-mono text-xs text-white/60 leading-relaxed">
            {milestone.description}
          </div>
        </div>
      </div>
    </div>
  );
}
