import { useCountUp } from '../hooks/useScrollAnimation';

interface TooltipData {
  label: string;
  stat: string;
  color: string;
}

interface AchievementTooltipProps {
  data: TooltipData;
}

function StatNumber({ value, color }: { value: string; color: string }) {
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const count = useCountUp(isNaN(num) ? 0 : num, 1500, true);
  const suffix = value.replace(/[0-9]/g, '').trim();

  if (isNaN(num) || num === 0) {
    return <span style={{ color }}>{value}</span>;
  }

  return <span style={{ color }}>{count}{suffix}</span>;
}

export default function AchievementTooltip({ data }: AchievementTooltipProps) {
  return (
    <div
      className="glass-card p-4 min-w-[180px] animate-in fade-in zoom-in-95 duration-300"
      style={{ border: `1px solid ${data.color}40`, boxShadow: `0 0 20px ${data.color}30` }}
    >
      <div className="font-orbitron text-xs font-bold text-white mb-1">{data.label}</div>
      <div className="font-mono text-lg font-bold">
        <StatNumber value={data.stat} color={data.color} />
      </div>
    </div>
  );
}
