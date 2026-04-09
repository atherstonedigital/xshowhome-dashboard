import { useState } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import DateRangePicker, { getDefaultRange } from './components/DateRangePicker';
import SalesKPIs from './components/SalesKPIs';
import MarketingSection from './components/MarketingSection';
import WebsiteSection from './components/WebsiteSection';
import SEOSection from './components/SEOSection';
import RevenueTrendChart from './components/RevenueTrendChart';
import RevenueTarget from './components/RevenueTarget';
import { LoadingOverlay, ErrorState, WarningBanner, EmptyState } from './components/LoadingState';
import useDashboardData from './hooks/useDashboardData';

export default function App() {
  const [dateRange, setDateRange] = useState(getDefaultRange);
  const [activeTab, setActiveTab] = useState('total');
  const { data, loading, error, warnings, refresh } = useDashboardData(dateRange);

  // Determine which sales data to show based on active tab
  const salesKey = activeTab === 'online' ? 'online' : activeTab === 'instore' ? 'pos' : 'all';
  const showMarketing = activeTab !== 'instore';
  const showWebsite = activeTab === 'online';
  const showSEO = activeTab === 'online';
  const showChart = activeTab !== 'instore';
  const showTarget = activeTab !== 'instore';

  return (
    <div className="min-h-screen bg-off-white">
      <Header loading={loading}>
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} onRefresh={refresh} />
      </Header>

      <TabNav activeTab={activeTab} onChange={setActiveTab} />

      {loading && <LoadingOverlay />}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && !data && <EmptyState />}

      {!loading && !error && data && (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
          <WarningBanner warnings={warnings} />

          {/* Sales KPIs — visible on all tabs */}
          <SalesKPIs
            sales={data.sales[salesKey]}
            salesPrior={data.salesPrior[salesKey]}
          />

          {/* Daily Performance Chart */}
          {showChart && (
            <RevenueTrendChart
              data={activeTab === 'online' ? data.dailyTrendOnline : data.dailyTrend}
            />
          )}

          {/* Paid Media */}
          {showMarketing && <MarketingSection data={data} />}

          {/* Website Performance */}
          {showWebsite && (
            <WebsiteSection
              ga4={data.ga4}
              ga4Prior={data.ga4Prior}
              trafficSources={data.trafficSources}
            />
          )}

          {/* SEO */}
          {showSEO && <SEOSection seo={data.seo} seoPrior={data.seoPrior} />}

          {/* Revenue Target */}
          {showTarget && <RevenueTarget target={data.revenueTarget} />}
        </div>
      )}
    </div>
  );
}
