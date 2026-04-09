import KPICard from './KPICard';
import { fmtCurrency, fmtNumber } from '../lib/windsor';

const KPIS = [
  { key: 'revenue', label: 'Revenue', fmt: fmtCurrency },
  { key: 'orders', label: 'Orders', fmt: fmtNumber },
  { key: 'aov', label: 'AOV', fmt: fmtCurrency },
  { key: 'units', label: 'Units Sold', fmt: fmtNumber },
  { key: 'discounts', label: 'Discounts', fmt: fmtCurrency },
  { key: 'shipping', label: 'Shipping Revenue', fmt: fmtCurrency },
  { key: 'refunds', label: 'Refunds', fmt: fmtCurrency },
  { key: 'netRevenue', label: 'Net Revenue', fmt: fmtCurrency },
];

export default function SalesKPIs({ sales, salesPrior }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-burgundy">Sales Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {KPIS.map((k) => (
          <KPICard
            key={k.key}
            label={k.label}
            value={sales[k.key]}
            prior={salesPrior[k.key]}
            formatter={k.fmt}
          />
        ))}
      </div>
    </section>
  );
}
