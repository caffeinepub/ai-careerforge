import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VOICE_RESPONSES = [
  "Alex is a visionary student engineer who builds at the intersection of AI and human creativity.",
  "With expertise in 20+ technologies, Alex has shipped products used by millions of users.",
  "Alex's research on neural interfaces was presented at IEEE and received the Best Paper Award.",
  "From winning hackathons to interning at FAANG companies, Alex's journey is one of relentless innovation.",
];

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(12).fill(4));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startListening = () => {
    setIsListening(true);
    setResponse('');

    // Animate waveform
    intervalRef.current = setInterval(() => {
      setWaveHeights(Array(12).fill(0).map(() => 4 + Math.random() * 24));
    }, 100);

    // Simulate voice processing
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWaveHeights(Array(12).fill(4));
      setIsListening(false);
      setResponse(VOICE_RESPONSES[Math.floor(Math.random() * VOICE_RESPONSES.length)]);
    }, 3000);
  };

  const stopListening = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsListening(false);
    setWaveHeights(Array(12).fill(4));
  };

  return (
    <div className="glass-card neon-glow-violet p-6 flex flex-col items-center gap-4">
      <div className="font-orbitron text-xs tracking-widest text-neon-violet mb-2">VOICE INTERFACE</div>

      {/* Waveform */}
      <div className="flex items-center gap-1 h-10">
        {waveHeights.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full transition-all duration-100"
            style={{
              height: `${h}px`,
              background: isListening ? '#9d00ff' : '#9d00ff40',
              boxShadow: isListening ? '0 0 6px rgba(157, 0, 255, 0.8)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'border-neon-violet bg-neon-violet/20 shadow-neon-violet scale-110'
            : 'border-neon-violet/40 bg-neon-violet/5 hover:border-neon-violet hover:bg-neon-violet/10'
        }`}
      >
        {isListening ? (
          <MicOff size={20} className="text-neon-violet" />
        ) : (
          <Mic size={20} className="text-neon-violet" />
        )}
      </button>

      <div className="font-mono text-xs text-white/40">
        {isListening ? 'LISTENING...' : 'TAP TO SPEAK'}
      </div>

      {/* Response */}
      {response && (
        <div className="glass-card p-3 w-full border-neon-violet/20 animate-in fade-in duration-500">
          <div className="font-mono text-xs text-white/70 leading-relaxed">{response}</div>
        </div>
      )}
    </div>
  );
}
