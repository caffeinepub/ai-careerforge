import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ChatPanel from './ChatPanel';
import VoiceInput from './VoiceInput';
import GrowthPredictor from './GrowthPredictor';
import AIArtGallery from './AIArtGallery';
import type { Student } from '../backend';

interface AISandboxProps {
  student: Student;
}

export default function AISandbox({ student }: AISandboxProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="ai-sandbox"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0520 50%, #050510 100%)' }}
    >
      {/* AI assistant silhouette background */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'url(/assets/generated/ai-assistant-silhouette.dim_512x512.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
        }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section-fade-in ${isVisible ? 'visible' : ''} relative z-10 max-w-7xl mx-auto px-6`}
      >
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[0.5em] text-neon-cyan/60 mb-2">06 // AI SANDBOX</div>
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white">
            INTERACTIVE <span className="neon-text-cyan">ZONE</span>
          </h2>
          <p className="font-mono text-sm text-white/40 mt-3">Explore AI-powered interactions and visualizations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChatPanel student={student} />
          <VoiceInput />
          <GrowthPredictor />
          <AIArtGallery />
        </div>
      </div>
    </section>
  );
}
