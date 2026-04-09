import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fmtNumber } from '../lib/windsor';

const COLORS = ['#507998', '#C4A882', '#301011', '#714424', '#986F50', '#6B8E9B', '#D4C4A8', '#503020', '#8B6B4A', '#A08060'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-burgundy text-off-white rounded-lg px-4 py-3 shadow-xl text-sm">
      <p className="font-medium text-gold mb-1">{d.source}</p>
      <p>Sessions: <span className="font-medium">{fmtNumber(d.sessions)}</span></p>
      <p>Share: <span className="font-medium">{d.share.toFixed(1)}%</span></p>
    </div>
  );
}

export default function ChannelBreakdownChart({ sources }) {
  if (!sources || !sources.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gold/15 p-5">
      <h4 className="font-display font-semibold text-burgundy mb-4">Traffic by Source</h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={sources}
            dataKey="sessions"
            nameKey="source"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {sources.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {sources.slice(0, 6).map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-burgundy/70">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {s.source}
          </div>
        ))}
      </div>
    </div>
  );
}
