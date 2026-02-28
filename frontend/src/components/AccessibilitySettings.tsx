import { useState } from 'react';
import { Settings, Eye, Zap, X } from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';

export default function AccessibilitySettings() {
  const [open, setOpen] = useState(false);
  const { reducedMotion, highContrast, toggleReducedMotion, toggleHighContrast } = useAccessibility();

  return (
    <div className="fixed bottom-6 right-6 z-[9990]">
      {open && (
        <div className="glass-card neon-glow-cyan mb-3 p-4 w-64 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-orbitron text-xs text-neon-cyan tracking-widest">ACCESSIBILITY</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-neon-cyan transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="space-y-3">
            <button
              onClick={toggleReducedMotion}
              className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all ${
                reducedMotion
                  ? 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/10 text-muted-foreground hover:border-neon-cyan/30'
              }`}
            >
              <Zap size={14} />
              <span className="font-mono text-xs">Reduced Motion</span>
              <span className={`ml-auto text-xs ${reducedMotion ? 'text-neon-cyan' : 'text-muted-foreground'}`}>
                {reducedMotion ? 'ON' : 'OFF'}
              </span>
            </button>
            <button
              onClick={toggleHighContrast}
              className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all ${
                highContrast
                  ? 'border-neon-violet/60 bg-neon-violet/10 text-neon-violet'
                  : 'border-white/10 text-muted-foreground hover:border-neon-violet/30'
              }`}
            >
              <Eye size={14} />
              <span className="font-mono text-xs">High Contrast</span>
              <span className={`ml-auto text-xs ${highContrast ? 'text-neon-violet' : 'text-muted-foreground'}`}>
                {highContrast ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="glass-card neon-glow-cyan w-12 h-12 rounded-full flex items-center justify-center text-neon-cyan hover:scale-110 transition-transform"
        aria-label="Accessibility Settings"
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
