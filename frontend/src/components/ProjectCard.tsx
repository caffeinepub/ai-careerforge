import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { useCursor } from '../hooks/useCursorContext';
import type { Project } from '../backend';

interface ProjectCardProps {
  project: Project;
  index: number;
  scrollRotation: number;
}

const PROJECT_COLORS = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88', '#ff8800'];

export default function ProjectCard({ project, index, scrollRotation }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { setCursorState } = useCursor();
  const color = PROJECT_COLORS[index % PROJECT_COLORS.length];

  const cardStyle = {
    transform: `perspective(1000px) rotateY(${scrollRotation * (index % 2 === 0 ? 1 : -1)}deg) rotateX(${scrollRotation * 0.5}deg)`,
    transition: 'transform 0.1s ease',
    border: `1px solid ${color}30`,
    boxShadow: hovered ? `0 0 40px ${color}40, 0 0 80px ${color}20` : `0 0 20px ${color}10`,
  };

  if (expanded) {
    return (
      <div
        className="fixed inset-0 z-[9000] flex items-center justify-center p-6"
        style={{ background: 'rgba(5, 5, 16, 0.95)', backdropFilter: 'blur(20px)' }}
        onClick={() => setExpanded(false)}
      >
        <div
          className="glass-card max-w-2xl w-full p-8 relative animate-in zoom-in-95 duration-300"
          style={{ border: `1px solid ${color}50`, boxShadow: `0 0 60px ${color}30` }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="font-mono text-xs tracking-widest mb-2" style={{ color }}>
            PROJECT {String(index + 1).padStart(2, '0')}
          </div>
          <h3 className="font-orbitron text-2xl font-black text-white mb-4">{project.title}</h3>
          <p className="font-mono text-sm text-white/60 leading-relaxed mb-6">{project.description}</p>

          {/* Holographic preview */}
          <div
            className="w-full h-32 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${color}10, transparent)`, border: `1px solid ${color}20` }}
          >
            <div className="font-orbitron text-xs tracking-widest" style={{ color }}>
              [ HOLOGRAPHIC PREVIEW ]
            </div>
            {/* Animated scan lines */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                  top: `${20 * i}%`,
                  animation: `scan ${2 + i * 0.3}s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-orbitron text-xs tracking-widest px-6 py-2 rounded-sm border transition-all hover:scale-105"
            style={{ borderColor: color, color, boxShadow: `0 0 10px ${color}30` }}
          >
            VIEW PROJECT <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card p-6 w-72 flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:scale-105"
      style={cardStyle}
      onMouseEnter={() => { setHovered(true); setCursorState('beam'); }}
      onMouseLeave={() => { setHovered(false); setCursorState('default'); }}
      onClick={() => setExpanded(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(true)}
    >
      {/* Holographic overlay on hover */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color}08, transparent 60%)`,
            border: `1px solid ${color}40`,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                top: `${30 * (i + 1)}%`,
                animation: `scan ${1.5 + i * 0.5}s linear infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="font-mono text-xs tracking-widest mb-3" style={{ color }}>
        PROJECT {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="font-orbitron text-lg font-bold text-white mb-3">{project.title}</h3>
      <p className="font-mono text-xs text-white/50 leading-relaxed line-clamp-3">{project.description}</p>

      <div className="mt-4 flex items-center gap-2 font-mono text-xs" style={{ color }}>
        <span>CLICK TO EXPAND</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }} />
      </div>
    </div>
  );
}
