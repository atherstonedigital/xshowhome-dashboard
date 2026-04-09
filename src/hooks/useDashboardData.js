import { useState, useEffect, useCallback } from 'react';
import { subDays, differenceInCalendarDays } from 'date-fns';
import {
  fetchShopify, fetchGoogleAds, fetchMeta, fetchGA4, fetchSearchConsole,
  splitShopifyData, aggregateShopifySales, aggregateGoogleAds,
  buildGoogleAdsCampaigns, aggregateMeta, buildMetaCampaigns,
  aggregateGA4, buildTrafficSources, aggregateSearchConsole,
  buildDailyTrend, calcPercentChange, buildRevenueTarget,
} from '../lib/windsor';

export default function useDashboardData(dateRange) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setWarnings([]);

    const { from, to } = dateRange;
    const numDays = differenceInCalendarDays(to, from) + 1;
    const priorTo = subDays(from, 1);
    const priorFrom = subDays(priorTo, numDays - 1);

    try {
      // Fire all queries for current + prior period in parallel
      const results = await Promise.allSettled([
        fetchShopify(from, to),
        fetchGoogleAds(from, to),
        fetchMeta(from, to),
        fetchGA4(from, to),
        fetchSearchConsole(from, to),
        fetchShopify(priorFrom, priorTo),
        fetchGoogleAds(priorFrom, priorTo),
        fetchMeta(priorFrom, priorTo),
        fetchGA4(priorFrom, priorTo),
        fetchSearchConsole(priorFrom, priorTo),
      ]);

      const sources = ['Shopify', 'Google Ads', 'Meta Ads', 'GA4', 'Search Console'];
      const w = [];
      const extract = (r, idx) => {
        if (r.status === 'fulfilled') return r.value;
        w.push(`${sources[idx % 5]} data unavailable`);
        return [];
      };

      const shopifyCurrent = extract(results[0], 0);
      const googleAdsCurrent = extract(results[1], 1);
      const metaCurrent = extract(results[2], 2);
      const ga4Current = extract(results[3], 3);
      const searchConsoleCurrent = extract(results[4], 4);

      const shopifyPrior = extract(results[5], 0);
      const googleAdsPrior = extract(results[6], 1);
      const metaPrior = extract(results[7], 2);
      const ga4Prior = extract(results[8], 3);
      const searchConsolePrior = extract(results[9], 4);

      // Split Shopify into online/POS
      const shopifySplit = splitShopifyData(shopifyCurrent);
      const shopifySplitPrior = splitShopifyData(shopifyPrior);

      // Aggregate sales for each tab
      const salesAll = aggregateShopifySales(shopifySplit.all);
      const salesOnline = aggregateShopifySales(shopifySplit.online);
      const salesPOS = aggregateShopifySales(shopifySplit.pos);

      const salesAllPrior = aggregateShopifySales(shopifySplitPrior.all);
      const salesOnlinePrior = aggregateShopifySales(shopifySplitPrior.online);
      const salesPOSPrior = aggregateShopifySales(shopifySplitPrior.pos);

      // Google Ads
      const googleAds = aggregateGoogleAds(googleAdsCurrent);
      const googleAdsPriorAgg = aggregateGoogleAds(googleAdsPrior);
      const googleCampaigns = buildGoogleAdsCampaigns(googleAdsCurrent);

      // Meta
      const meta = aggregateMeta(metaCurrent);
      const metaPriorAgg = aggregateMeta(metaPrior);
      const metaCampaigns = buildMetaCampaigns(metaCurrent);

      // Blended paid media
      const totalAdSpend = googleAds.spend + meta.spend;
      const totalAdRevenue = googleAds.convValue + meta.convValue;
      const totalAdConversions = googleAds.conversions + meta.conversions;
      const blendedRoas = totalAdSpend > 0 ? totalAdRevenue / totalAdSpend : 0;
      const blendedCpa = totalAdConversions > 0 ? totalAdSpend / totalAdConversions : 0;

      const totalAdSpendPrior = googleAdsPriorAgg.spend + metaPriorAgg.spend;
      const totalAdRevenuePrior = googleAdsPriorAgg.convValue + metaPriorAgg.convValue;
      const totalAdConversionsPrior = googleAdsPriorAgg.conversions + metaPriorAgg.conversions;
      const blendedRoasPrior = totalAdSpendPrior > 0 ? totalAdRevenuePrior / totalAdSpendPrior : 0;
      const blendedCpaPrior = totalAdConversionsPrior > 0 ? totalAdSpendPrior / totalAdConversionsPrior : 0;

      // GA4
      const ga4 = aggregateGA4(ga4Current);
      const ga4PriorAgg = aggregateGA4(ga4Prior);
      const trafficSources = buildTrafficSources(ga4Current);

      // Search Console
      const seo = aggregateSearchConsole(searchConsoleCurrent);
      const seoPrior = aggregateSearchConsole(searchConsolePrior);

      // Daily trend
      const dailyTrend = buildDailyTrend(shopifySplit.all, googleAdsCurrent, metaCurrent);
      const dailyTrendOnline = buildDailyTrend(shopifySplit.online, googleAdsCurrent, metaCurrent);

      // Revenue target (online only)
      const revenueTarget = buildRevenueTarget(salesOnline.revenue, numDays);

      setWarnings(w);
      setData({
        sales: { all: salesAll, online: salesOnline, pos: salesPOS },
        salesPrior: { all: salesAllPrior, online: salesOnlinePrior, pos: salesPOSPrior },
        googleAds,
        googleAdsPrior: googleAdsPriorAgg,
        googleCampaigns,
        meta,
        metaPrior: metaPriorAgg,
        metaCampaigns,
        blended: { totalAdSpend, totalAdRevenue, totalAdConversions, blendedRoas, blendedCpa },
        blendedPrior: { totalAdSpend: totalAdSpendPrior, totalAdRevenue: totalAdRevenuePrior, totalAdConversions: totalAdConversionsPrior, blendedRoas: blendedRoasPrior, blendedCpa: blendedCpaPrior },
        ga4,
        ga4Prior: ga4PriorAgg,
        trafficSources,
        seo,
        seoPrior,
        dailyTrend,
        dailyTrendOnline,
        revenueTarget,
        numDays,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, warnings, refresh: load };
}
