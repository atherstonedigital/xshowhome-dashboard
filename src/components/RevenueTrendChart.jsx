import {
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fmtCurrency, fmtNumber } from '../lib/windsor';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-burgundy text-off-white rounded-lg px-4 py-3 shadow-xl text-sm">
      <p className="font-medium mb-1.5 text-gold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex justify-between gap-4">
          <span className="text-off-white/70">{p.name}:</span>
          <span className="font-medium">
            {p.name === 'Orders' ? fmtNumber(p.value) : fmtCurrency(p.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function RevenueTrendChart({ data }) {
  if (!data || !data.length) return null;

  const formatted = data.map((d) => ({
    ...d,
    label: (() => { try { return format(parseISO(d.date), 'dd/MM'); } catch { return d.date; } })(),
  }));

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-burgundy">Daily Performance</h2>
      <div className="bg-white rounded-xl border border-gold/15 p-5">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={formatted} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C4A882" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C4A882" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#C4A882" strokeOpacity={0.15} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#301011' }} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#301011' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#301011' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#301011' }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#C4A882"
              strokeWidth={2}
              fill="url(#goldGrad)"
            />
            <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#507998" barSize={14} radius={[3, 3, 0, 0]} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="adSpend"
              name="Ad Spend"
              stroke="#301011"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
