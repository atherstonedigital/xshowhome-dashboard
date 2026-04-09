const TABS = [
  { id: 'total', label: 'Total Business' },
  { id: 'online', label: 'Online' },
  { id: 'instore', label: 'In-Store' },
];

export default function TabNav({ activeTab, onChange }) {
  return (
    <nav className="flex gap-1 bg-white border-b border-gold/15 px-6">
      <div className="max-w-7xl mx-auto flex gap-1 w-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'bg-burgundy text-off-white'
                : 'bg-white text-burgundy/70 hover:text-burgundy hover:bg-gold/5 border border-b-0 border-gold/15'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
