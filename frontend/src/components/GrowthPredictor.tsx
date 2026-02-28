import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const GROWTH_DATA = {
  past: [
    { label: 'HTML/CSS', value: 60 },
    { label: 'JavaScript', value: 45 },
    { label: 'Python', value: 30 },
    { label: 'React', value: 20 },
    { label: 'ML/AI', value: 10 },
  ],
  present: [
    { label: 'HTML/CSS', value: 95 },
    { label: 'JavaScript', value: 90 },
    { label: 'Python', value: 85 },
    { label: 'React', value: 92 },
    { label: 'ML/AI', value: 70 },
  ],
  future: [
    { label: 'HTML/CSS', value: 99 },
    { label: 'JavaScript', value: 98 },
    { label: 'Python', value: 97 },
    { label: 'React', value: 99 },
    { label: 'ML/AI', value: 95 },
  ],
};

const PHASES = ['past', 'present', 'future'] as const;
type Phase = typeof PHASES[number];

export default function GrowthPredictor() {
  const [phase, setPhase] = useState<number>(1);
  const currentPhase = PHASES[phase] as Phase;
  const data = GROWTH_DATA[currentPhase];

  const colors = {
    past: '#9d00ff',
    present: '#00f5ff',
    future: '#ff00c8',
  };

  const color = colors[currentPhase];

  return (
    <div className="glass-card neon-glow-cyan p-6">
      <div className="font-orbitron text-xs tracking-widest text-neon-cyan mb-4">GROWTH PREDICTOR</div>

      {/* Phase labels */}
      <div className="flex justify-between font-mono text-xs text-white/40 mb-2">
        <span className={phase === 0 ? 'text-neon-violet' : ''}>PAST</span>
        <span className={phase === 1 ? 'text-neon-cyan' : ''}>PRESENT</span>
        <span className={phase === 2 ? 'text-neon-magenta' : ''}>FUTURE</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={phase}
        onChange={e => setPhase(Number(e.target.value))}
        className="w-full mb-6 accent-neon-cyan"
        style={{ accentColor: color }}
      />

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="label" tick={{ fill: '#ffffff40', fontSize: 9, fontFamily: 'Space Mono' }} />
            <YAxis tick={{ fill: '#ffffff40', fontSize: 9, fontFamily: 'Space Mono' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#0a0a1a', border: `1px solid ${color}40`, borderRadius: '4px', fontFamily: 'Space Mono', fontSize: '10px' }}
              labelStyle={{ color }}
              itemStyle={{ color: '#ffffff80' }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={color} opacity={0.7 + i * 0.06} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center font-orbitron text-xs mt-2" style={{ color }}>
        {currentPhase.toUpperCase()} TRAJECTORY
      </div>
    </div>
  );
}
