export function SkeletonCard() {
  return (
    <div className="kpi-card">
      <div className="skeleton h-3 w-20 mb-3" />
      <div className="skeleton h-7 w-28 mb-2" />
      <div className="skeleton h-3 w-14" />
    </div>
  );
}

export function SkeletonRow({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 text-burgundy/60">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Fetching data...</span>
        </div>
      </div>
      <div className="space-y-6">
        <SkeletonRow count={4} />
        <SkeletonRow count={4} />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white border-2 border-burgundy/20 rounded-xl p-8 text-center">
        <svg className="w-12 h-12 text-burgundy/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="font-display text-lg font-semibold text-burgundy mb-2">Something went wrong</h3>
        <p className="text-sm text-burgundy/60 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="bg-burgundy text-off-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-burgundy/90 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export function WarningBanner({ warnings }) {
  if (!warnings || !warnings.length) return null;
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-sm text-warm-brown">
        <span className="font-medium">Partial data:</span> {warnings.join(', ')}
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white border border-gold/15 rounded-xl p-12 text-center">
        <svg className="w-16 h-16 text-gold/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="font-display text-lg font-semibold text-burgundy mb-1">No data for this period</h3>
        <p className="text-sm text-burgundy/50">Try selecting a different date range.</p>
      </div>
    </div>
  );
}
