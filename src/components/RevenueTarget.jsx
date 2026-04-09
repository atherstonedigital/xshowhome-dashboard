import { fmtCurrency } from '../lib/windsor';

export default function RevenueTarget({ target }) {
  if (!target) return null;

  const pct = Math.min(target.pctAchieved, 100);
  const barColor = pct >= 100 ? 'bg-green-500' : pct >= 75 ? 'bg-gold' : 'bg-steel-blue';

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-burgundy">Revenue Target</h2>
      <div className="bg-white rounded-xl border border-gold/15 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-burgundy/50 mb-1">Target</p>
            <p className="text-xl font-display font-bold text-burgundy">{fmtCurrency(target.target)}</p>
            <p className="text-xs text-burgundy/50 mt-0.5">{fmtCurrency(target.dailyTarget)}/day</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-burgundy/50 mb-1">Actual</p>
            <p className="text-xl font-display font-bold text-burgundy">{fmtCurrency(target.actual)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-burgundy/50 mb-1">Achieved</p>
            <p className="text-xl font-display font-bold text-burgundy">{target.pctAchieved.toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-burgundy/50 mb-1">Daily Run Rate</p>
            <p className="text-xl font-display font-bold text-burgundy">{fmtCurrency(target.dailyRunRate)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-burgundy/50 mb-1">Projected Total</p>
            <p className="text-xl font-display font-bold text-burgundy">{fmtCurrency(target.projectedTotal)}</p>
          </div>
        </div>
        <div className="w-full bg-off-white rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
