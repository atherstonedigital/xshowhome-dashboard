import KPICard from './KPICard';
import ChannelBreakdownChart from './ChannelBreakdownChart';
import { fmtCurrency, fmtNumber, fmtDecimal } from '../lib/windsor';

function fmtPct(v) {
  return `${v.toFixed(1)}%`;
}

export default function WebsiteSection({ ga4, ga4Prior, trafficSources }) {
  return (
    <section className="space-y-6">
      <h2 className="font-display text-lg font-semibold text-burgundy">Website Performance</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Sessions" value={ga4.sessions} prior={ga4Prior.sessions} formatter={fmtNumber} />
        <KPICard label="Users" value={ga4.users} prior={ga4Prior.users} formatter={fmtNumber} />
        <KPICard label="Conversion Rate" value={ga4.conversionRate} prior={ga4Prior.conversionRate} formatter={fmtPct} />
        <KPICard label="Revenue / Session" value={ga4.revenuePerSession} prior={ga4Prior.revenuePerSession} formatter={fmtCurrency} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Bounce Rate" value={ga4.bounceRate} prior={ga4Prior.bounceRate} formatter={fmtPct} />
        <KPICard label="Engagement Rate" value={ga4.engagementRate} prior={ga4Prior.engagementRate} formatter={fmtPct} />
        <KPICard label="Pages / Session" value={ga4.pagesPerSession} prior={ga4Prior.pagesPerSession} formatter={(v) => fmtDecimal(v, 1)} />
        <KPICard label="Transactions" value={ga4.transactions} prior={ga4Prior.transactions} formatter={fmtNumber} />
      </div>

      {/* Traffic sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelBreakdownChart sources={trafficSources} />

        <div className="bg-white rounded-xl border border-gold/15 overflow-hidden">
          <div className="px-5 py-3 border-b border-gold/10">
            <h4 className="font-display font-semibold text-burgundy">Traffic Sources</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-off-white/50 text-burgundy/60 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5 font-medium">Source / Medium</th>
                  <th className="text-right px-4 py-2.5 font-medium">Sessions</th>
                  <th className="text-right px-4 py-2.5 font-medium">Share</th>
                  <th className="text-right px-4 py-2.5 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {trafficSources.map((s, i) => (
                  <tr key={i} className="hover:bg-gold/5 transition-colors">
                    <td className="px-4 py-2.5 text-burgundy font-medium">{s.source}</td>
                    <td className="text-right px-4 py-2.5 text-burgundy">{fmtNumber(s.sessions)}</td>
                    <td className="text-right px-4 py-2.5 text-burgundy/60">{s.share.toFixed(1)}%</td>
                    <td className="text-right px-4 py-2.5 text-burgundy">{fmtCurrency(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
