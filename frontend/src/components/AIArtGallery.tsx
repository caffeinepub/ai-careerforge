import { useState } from 'react';

const ART_PIECES = [
  { title: 'Neural Dreams', x: 0, y: 0, w: 400, h: 400 },
  { title: 'Quantum Flux', x: 400, y: 0, w: 400, h: 400 },
  { title: 'Digital Soul', x: 800, y: 0, w: 400, h: 400 },
  { title: 'Cyber Bloom', x: 1200, y: 0, w: 400, h: 400 },
];

export default function AIArtGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="glass-card neon-glow-magenta p-6">
      <div className="font-orbitron text-xs tracking-widest text-neon-magenta mb-4">AI ART GALLERY</div>
      <div className="grid grid-cols-2 gap-3">
        {ART_PIECES.map((piece, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-lg transition-all duration-500 cursor-pointer"
            style={{
              transform: hoveredIndex === i
                ? `scale(1.05) rotate(${(i % 2 === 0 ? 1 : -1) * 2}deg)`
                : hoveredIndex !== null
                  ? `scale(0.95) rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)`
                  : 'scale(1)',
              boxShadow: hoveredIndex === i ? '0 0 30px rgba(255, 0, 200, 0.4)' : 'none',
              border: hoveredIndex === i ? '1px solid rgba(255, 0, 200, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-full h-24 relative overflow-hidden"
              style={{
                backgroundImage: 'url(/assets/generated/ai-art-gallery-strip.dim_1600x400.png)',
                backgroundSize: '400% 100%',
                backgroundPosition: `${i * 33.33}% 0%`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 to-transparent" />
            <div className="absolute bottom-2 left-2 font-mono text-xs text-neon-magenta/80">{piece.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
