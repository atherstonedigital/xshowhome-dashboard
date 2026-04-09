import KPICard from './KPICard';
import { fmtCurrency, fmtNumber, fmtRoas, fmtDecimal } from '../lib/windsor';

function RoasBadge({ value }) {
  let color = 'bg-red-100 text-red-700';
  if (value >= 3) color = 'bg-green-100 text-green-700';
  else if (value >= 1) color = 'bg-amber-100 text-amber-700';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{fmtRoas(value)}</span>;
}

function CampaignTable({ campaigns, title }) {
  return (
    <div className="bg-white rounded-xl border border-gold/15 overflow-hidden">
      <div className="px-5 py-3 border-b border-gold/10">
        <h4 className="font-display font-semibold text-burgundy">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-off-white/50 text-burgundy/60 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-2.5 font-medium">Campaign</th>
              <th className="text-left px-4 py-2.5 font-medium">Type</th>
              <th className="text-right px-4 py-2.5 font-medium">Spend</th>
              <th className="text-right px-4 py-2.5 font-medium">Revenue</th>
              <th className="text-right px-4 py-2.5 font-medium">ROAS</th>
              <th className="text-right px-4 py-2.5 font-medium">Clicks</th>
              <th className="text-right px-4 py-2.5 font-medium">Conv.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {campaigns.map((c, i) => (
              <tr key={i} className="hover:bg-gold/5 transition-colors">
                <td className="px-4 py-2.5 text-burgundy font-medium max-w-[200px] truncate">{c.campaign}</td>
                <td className="px-4 py-2.5 text-burgundy/60">{c.type}</td>
                <td className="text-right px-4 py-2.5 text-burgundy">{fmtCurrency(c.spend)}</td>
                <td className="text-right px-4 py-2.5 text-burgundy">{fmtCurrency(c.revenue)}</td>
                <td className="text-right px-4 py-2.5"><RoasBadge value={c.roas} /></td>
                <td className="text-right px-4 py-2.5 text-burgundy">{fmtNumber(c.clicks)}</td>
                <td className="text-right px-4 py-2.5 text-burgundy">{fmtNumber(c.conversions)}</td>
              </tr>
            ))}
            {!campaigns.length && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-burgundy/40">No campaign data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MarketingSection({ data }) {
  const { googleAds, googleAdsPrior, googleCampaigns, meta, metaPrior, metaCampaigns, blended, blendedPrior } = data;

  return (
    <section className="space-y-6">
      <h2 className="font-display text-lg font-semibold text-burgundy">Paid Media Performance</h2>

      {/* Blended metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Ad Spend" value={blended.totalAdSpend} prior={blendedPrior.totalAdSpend} formatter={fmtCurrency} />
        <KPICard label="Blended ROAS" value={blended.blendedRoas} prior={blendedPrior.blendedRoas} formatter={fmtRoas} />
        <KPICard label="Blended CPA" value={blended.blendedCpa} prior={blendedPrior.blendedCpa} formatter={fmtCurrency} />
        <KPICard label="Total Ad Revenue" value={blended.totalAdRevenue} prior={blendedPrior.totalAdRevenue} formatter={fmtCurrency} />
      </div>

      {/* Google Ads summary */}
      <div>
        <h3 className="font-display text-base font-semibold text-burgundy mb-3">Google Ads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          <KPICard label="Spend" value={googleAds.spend} prior={googleAdsPrior.spend} formatter={fmtCurrency} />
          <KPICard label="Revenue" value={googleAds.convValue} prior={googleAdsPrior.convValue} formatter={fmtCurrency} />
          <KPICard label="ROAS" value={googleAds.roas} prior={googleAdsPrior.roas} formatter={fmtRoas} />
          <KPICard label="Clicks" value={googleAds.clicks} prior={googleAdsPrior.clicks} formatter={fmtNumber} />
          <KPICard label="Conversions" value={googleAds.conversions} prior={googleAdsPrior.conversions} formatter={fmtNumber} />
        </div>
        <CampaignTable campaigns={googleCampaigns} title="Google Ads — Campaign Breakdown" />
      </div>

      {/* Meta Ads summary */}
      <div>
        <h3 className="font-display text-base font-semibold text-burgundy mb-3">Meta Ads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          <KPICard label="Spend" value={meta.spend} prior={metaPrior.spend} formatter={fmtCurrency} />
          <KPICard label="Revenue" value={meta.convValue} prior={metaPrior.convValue} formatter={fmtCurrency} />
          <KPICard label="ROAS" value={meta.roas} prior={metaPrior.roas} formatter={fmtRoas} />
          <KPICard label="Clicks" value={meta.clicks} prior={metaPrior.clicks} formatter={fmtNumber} />
          <KPICard label="Conversions" value={meta.conversions} prior={metaPrior.conversions} formatter={fmtNumber} />
        </div>
        <CampaignTable campaigns={metaCampaigns} title="Meta Ads — Campaign Breakdown" />
      </div>
    </section>
  );
}
