import { format } from 'date-fns';

const ACCOUNTS = {
  shopify: '5a5d11-ac.myshopify.com',
  ga4: '471354227',
  googleAds: '358-521-3045',
  meta: '478408788147290',
  searchConsole: 'sc-domain:xshowhome.com',
  merchant: '5521451323',
};

const DAILY_REVENUE_TARGET = 1000; // £1,000/day online target

function formatDate(d) {
  return format(d, 'yyyy-MM-dd');
}

async function queryWindsor(params) {
  const res = await fetch('/api/windsor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const json = await res.json();
  if (json._debug) {
    console.log(`Windsor [${params.connector}] debug:`, json._debug);
  }
  if (json.error) {
    console.warn(`Windsor [${params.connector}] error:`, json.error);
  }
  const rows = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  console.log(`Windsor [${params.connector}]: ${rows.length} rows`);
  return rows;
}

export function fetchShopify(dateFrom, dateTo) {
  return queryWindsor({
    connector: 'shopify',
    accounts: [ACCOUNTS.shopify],
    date_from: formatDate(dateFrom),
    date_to: formatDate(dateTo),
    date_filters: { orders: 'createdAt' },
    fields: [
      'date', 'order_sales_channel', 'order_retail_location_name',
      'order_total_price', 'order_count', 'order_current_subtotal_price',
      'order_total_discounts', 'order_total_shipping_price',
      'order_refunds_net', 'order_quantity',
    ],
  });
}

export function fetchGoogleAds(dateFrom, dateTo) {
  return queryWindsor({
    connector: 'google_ads',
    accounts: [ACCOUNTS.googleAds],
    date_from: formatDate(dateFrom),
    date_to: formatDate(dateTo),
    fields: [
      'date', 'campaign', 'campaign_type', 'spend', 'clicks',
      'impressions', 'conversions', 'conv_value', 'ctr', 'cpc',
    ],
  });
}

export function fetchMeta(dateFrom, dateTo) {
  return queryWindsor({
    connector: 'facebook',
    accounts: [ACCOUNTS.meta],
    date_from: formatDate(dateFrom),
    date_to: formatDate(dateTo),
    fields: [
      'date', 'campaign', 'spend', 'clicks', 'impressions', 'ctr', 'cpc',
      'actions_offsite_conversion_fb_pixel_purchase',
      'action_values_offsite_conversion_fb_pixel_purchase',
    ],
  });
}

export function fetchGA4(dateFrom, dateTo) {
  return queryWindsor({
    connector: 'googleanalytics4',
    accounts: [ACCOUNTS.ga4],
    date_from: formatDate(dateFrom),
    date_to: formatDate(dateTo),
    fields: [
      'date', 'sessions', 'users', 'new_users',
      'bounce_rate', 'engaged_sessions', 'engagement_rate',
      'purchase_revenue', 'transactions',
      'session_source', 'session_medium',
      'screen_page_views_per_session',
    ],
  });
}

export function fetchSearchConsole(dateFrom, dateTo) {
  return queryWindsor({
    connector: 'searchconsole',
    accounts: [ACCOUNTS.searchConsole],
    date_from: formatDate(dateFrom),
    date_to: formatDate(dateTo),
    fields: ['date', 'clicks', 'impressions', 'ctr', 'position'],
  });
}

// --- Data processing helpers ---

function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function sumField(rows, field) {
  return rows.reduce((acc, r) => acc + num(r[field]), 0);
}

function avgField(rows, field) {
  if (!rows.length) return 0;
  return sumField(rows, field) / rows.length;
}

function isPOS(row) {
  const channel = (row.order_sales_channel || '').toLowerCase();
  const location = (row.order_retail_location_name || '').trim();
  return channel.includes('point of sale') || location.length > 0;
}

export function splitShopifyData(rows) {
  const online = rows.filter((r) => !isPOS(r));
  const pos = rows.filter((r) => isPOS(r));
  return { all: rows, online, pos };
}

export function aggregateShopifySales(rows) {
  const revenue = sumField(rows, 'order_total_price');
  const orders = sumField(rows, 'order_count');
  const units = sumField(rows, 'order_quantity');
  const discounts = sumField(rows, 'order_total_discounts');
  const shipping = sumField(rows, 'order_total_shipping_price');
  const refunds = sumField(rows, 'order_refunds_net');
  const netRevenue = revenue - refunds;
  const aov = orders > 0 ? revenue / orders : 0;

  return { revenue, orders, aov, units, discounts, shipping, refunds, netRevenue };
}

export function aggregateGoogleAds(rows) {
  const spend = sumField(rows, 'spend');
  const clicks = sumField(rows, 'clicks');
  const impressions = sumField(rows, 'impressions');
  const conversions = sumField(rows, 'conversions');
  const convValue = sumField(rows, 'conv_value');
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const roas = spend > 0 ? convValue / spend : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;

  return { spend, clicks, impressions, conversions, convValue, ctr, cpc, roas, cpa };
}

export function buildGoogleAdsCampaigns(rows) {
  const map = {};
  for (const r of rows) {
    const name = r.campaign || 'Unknown';
    if (!map[name]) {
      map[name] = { campaign: name, type: r.campaign_type || '', spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0 };
    }
    map[name].spend += num(r.spend);
    map[name].revenue += num(r.conv_value);
    map[name].clicks += num(r.clicks);
    map[name].impressions += num(r.impressions);
    map[name].conversions += num(r.conversions);
  }
  return Object.values(map)
    .map((c) => ({ ...c, roas: c.spend > 0 ? c.revenue / c.spend : 0 }))
    .sort((a, b) => b.spend - a.spend);
}

export function aggregateMeta(rows) {
  const spend = sumField(rows, 'spend');
  const clicks = sumField(rows, 'clicks');
  const impressions = sumField(rows, 'impressions');
  const conversions = sumField(rows, 'actions_offsite_conversion_fb_pixel_purchase');
  const convValue = sumField(rows, 'action_values_offsite_conversion_fb_pixel_purchase');
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const roas = spend > 0 ? convValue / spend : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;

  return { spend, clicks, impressions, conversions, convValue, ctr, cpc, roas, cpa };
}

export function buildMetaCampaigns(rows) {
  const map = {};
  for (const r of rows) {
    const name = r.campaign || 'Unknown';
    if (!map[name]) {
      map[name] = { campaign: name, type: 'Meta', spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0 };
    }
    map[name].spend += num(r.spend);
    map[name].revenue += num(r.action_values_offsite_conversion_fb_pixel_purchase);
    map[name].clicks += num(r.clicks);
    map[name].impressions += num(r.impressions);
    map[name].conversions += num(r.actions_offsite_conversion_fb_pixel_purchase);
  }
  return Object.values(map)
    .map((c) => ({ ...c, roas: c.spend > 0 ? c.revenue / c.spend : 0 }))
    .sort((a, b) => b.spend - a.spend);
}

export function aggregateGA4(rows) {
  const sessions = sumField(rows, 'sessions');
  const users = sumField(rows, 'users');
  const newUsers = sumField(rows, 'new_users');
  const engagedSessions = sumField(rows, 'engaged_sessions');
  const transactions = sumField(rows, 'transactions');
  const purchaseRevenue = sumField(rows, 'purchase_revenue');
  const bounceRate = avgField(rows, 'bounce_rate');
  const engagementRate = avgField(rows, 'engagement_rate');
  const pagesPerSession = avgField(rows, 'screen_page_views_per_session');
  const conversionRate = sessions > 0 ? (transactions / sessions) * 100 : 0;
  const revenuePerSession = sessions > 0 ? purchaseRevenue / sessions : 0;

  return { sessions, users, newUsers, engagedSessions, transactions, purchaseRevenue, bounceRate, engagementRate, pagesPerSession, conversionRate, revenuePerSession };
}

export function buildTrafficSources(rows) {
  const map = {};
  for (const r of rows) {
    const source = r.session_source || '(direct)';
    const medium = r.session_medium || '(none)';
    const key = `${source} / ${medium}`;
    if (!map[key]) {
      map[key] = { source: key, sessions: 0, revenue: 0 };
    }
    map[key].sessions += num(r.sessions);
    map[key].revenue += num(r.purchase_revenue);
  }
  const all = Object.values(map).sort((a, b) => b.sessions - a.sessions);
  const totalSessions = all.reduce((s, r) => s + r.sessions, 0);
  return all.slice(0, 10).map((r) => ({
    ...r,
    share: totalSessions > 0 ? (r.sessions / totalSessions) * 100 : 0,
  }));
}

export function aggregateSearchConsole(rows) {
  const clicks = sumField(rows, 'clicks');
  const impressions = sumField(rows, 'impressions');
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : avgField(rows, 'ctr');
  const position = avgField(rows, 'position');

  return { clicks, impressions, ctr, position };
}

export function buildDailyTrend(shopifyRows, googleAdsRows, metaRows) {
  const map = {};
  for (const r of shopifyRows) {
    const d = r.date;
    if (!d) continue;
    if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0, adSpend: 0 };
    map[d].revenue += num(r.order_total_price);
    map[d].orders += num(r.order_count);
  }
  for (const r of googleAdsRows) {
    const d = r.date;
    if (!d) continue;
    if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0, adSpend: 0 };
    map[d].adSpend += num(r.spend);
  }
  for (const r of metaRows) {
    const d = r.date;
    if (!d) continue;
    if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0, adSpend: 0 };
    map[d].adSpend += num(r.spend);
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export function calcPercentChange(current, prior) {
  if (prior === 0) return current > 0 ? 100 : 0;
  return ((current - prior) / Math.abs(prior)) * 100;
}

export function buildRevenueTarget(revenue, numDays) {
  const target = DAILY_REVENUE_TARGET * numDays;
  const pctAchieved = target > 0 ? (revenue / target) * 100 : 0;
  const dailyRunRate = numDays > 0 ? revenue / numDays : 0;
  const projectedTotal = dailyRunRate * numDays;

  return { target, actual: revenue, pctAchieved, dailyRunRate, projectedTotal, dailyTarget: DAILY_REVENUE_TARGET };
}

// Currency formatting
export function fmtCurrency(v) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
}

export function fmtNumber(v) {
  return new Intl.NumberFormat('en-GB').format(Math.round(v));
}

export function fmtPercent(v) {
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
}

export function fmtDecimal(v, digits = 2) {
  return v.toFixed(digits);
}

export function fmtRoas(v) {
  return `${v.toFixed(2)}x`;
}
