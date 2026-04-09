export default function Header({ loading, children }) {
  return (
    <header className="bg-burgundy text-off-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl tracking-widest font-semibold">XSHOWHOME</h1>
            <p className="text-gold/80 text-sm font-light tracking-wide">Performance Dashboard</p>
          </div>
          {!loading && (
            <span className="relative flex h-2.5 w-2.5 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {children}
        </div>
      </div>
    </header>
  );
}
