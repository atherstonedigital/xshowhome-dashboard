import KPICard from './KPICard';
import { fmtNumber, fmtDecimal } from '../lib/windsor';

function fmtPct(v) {
  return `${v.toFixed(2)}%`;
}

export default function SEOSection({ seo, seoPrior }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-burgundy">Organic Search / SEO</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Organic Clicks" value={seo.clicks} prior={seoPrior.clicks} formatter={fmtNumber} />
        <KPICard label="Impressions" value={seo.impressions} prior={seoPrior.impressions} formatter={fmtNumber} />
        <KPICard label="Average CTR" value={seo.ctr} prior={seoPrior.ctr} formatter={fmtPct} />
        <KPICard label="Average Position" value={seo.position} prior={seoPrior.position} formatter={(v) => fmtDecimal(v, 1)} />
      </div>
    </section>
  );
}
