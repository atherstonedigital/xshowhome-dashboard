import { useState } from 'react';
import {
  subDays, startOfMonth, endOfMonth, subMonths, startOfQuarter,
  subQuarters, endOfQuarter, startOfYear, format,
} from 'date-fns';

const today = () => new Date();

const PRESETS = [
  { label: 'Today', range: () => ({ from: today(), to: today() }) },
  { label: 'Yesterday', range: () => ({ from: subDays(today(), 1), to: subDays(today(), 1) }) },
  { label: 'Last 7 Days', range: () => ({ from: subDays(today(), 6), to: today() }) },
  { label: 'Last 30 Days', range: () => ({ from: subDays(today(), 29), to: today() }) },
  { label: 'This Month', range: () => ({ from: startOfMonth(today()), to: today() }) },
  { label: 'Last Month', range: () => ({ from: startOfMonth(subMonths(today(), 1)), to: endOfMonth(subMonths(today(), 1)) }) },
  { label: 'Last Quarter', range: () => ({ from: startOfQuarter(subQuarters(today(), 1)), to: endOfQuarter(subQuarters(today(), 1)) }) },
  { label: 'Year to Date', range: () => ({ from: startOfYear(today()), to: today() }) },
];

export function getDefaultRange() {
  return { from: subDays(new Date(), 29), to: new Date() };
}

export default function DateRangePicker({ dateRange, onChange, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(format(dateRange.from, 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(dateRange.to, 'yyyy-MM-dd'));

  const applyPreset = (preset) => {
    const range = preset.range();
    onChange(range);
    setCustomFrom(format(range.from, 'yyyy-MM-dd'));
    setCustomTo(format(range.to, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const applyCustom = () => {
    const from = new Date(customFrom);
    const to = new Date(customTo);
    if (!isNaN(from) && !isNaN(to) && from <= to) {
      onChange({ from, to });
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="bg-off-white/20 hover:bg-off-white/30 text-off-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {format(dateRange.from, 'dd MMM yyyy')} — {format(dateRange.to, 'dd MMM yyyy')}
        </button>
        <button
          onClick={onRefresh}
          className="bg-gold/30 hover:bg-gold/50 text-off-white p-2 rounded-lg transition-colors"
          title="Refresh data"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gold/20 p-4 z-50 w-80">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="text-left px-3 py-2 text-sm rounded-lg hover:bg-gold/10 text-burgundy transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gold/15 pt-3">
            <p className="text-xs text-burgundy/50 mb-2 font-medium uppercase tracking-wide">Custom Range</p>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="border border-gold/20 rounded-lg px-2 py-1.5 text-sm flex-1 text-burgundy"
              />
              <span className="text-burgundy/40">—</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="border border-gold/20 rounded-lg px-2 py-1.5 text-sm flex-1 text-burgundy"
              />
            </div>
            <button
              onClick={applyCustom}
              className="mt-2 w-full bg-burgundy text-off-white py-2 rounded-lg text-sm font-medium hover:bg-burgundy/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
