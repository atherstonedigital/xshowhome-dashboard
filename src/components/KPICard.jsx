import { calcPercentChange } from '../lib/windsor';

function ChangeIndicator({ current, prior }) {
  const pct = calcPercentChange(current, prior);
  const abs = Math.abs(pct);

  if (abs < 0.1) {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-0.5">
        <span>—</span> 0.0%
      </span>
    );
  }

  const isPositive = pct > 0;
  const color = isPositive ? 'text-green-600' : 'text-red-500';
  const arrow = isPositive ? '↑' : '↓';

  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${color}`}>
      <span>{arrow}</span> {abs.toFixed(1)}%
    </span>
  );
}

export default function KPICard({ label, value, prior, formatter }) {
  const display = formatter ? formatter(value) : value;

  return (
    <div className="kpi-card">
      <p className="text-xs font-medium uppercase tracking-wider text-burgundy/50 mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-burgundy leading-tight">{display}</p>
      {prior !== undefined && (
        <div className="mt-1">
          <ChangeIndicator current={value} prior={prior} />
        </div>
      )}
    </div>
  );
}
