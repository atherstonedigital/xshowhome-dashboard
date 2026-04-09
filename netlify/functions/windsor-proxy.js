export default async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.WINDSOR_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Windsor API key not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { connector, fields, accounts, date_from, date_to, date_preset, date_filters, filters } = body;

    const params = new URLSearchParams();
    params.set('api_key', apiKey);

    if (connector) params.set('connector', connector);
    if (fields && fields.length) params.set('fields', fields.join(','));
    if (accounts && accounts.length) params.set('accounts', accounts.join(','));
    if (date_from) params.set('date_from', date_from);
    if (date_to) params.set('date_to', date_to);
    if (date_preset) params.set('date_preset', date_preset);
    if (date_filters) params.set('date_filters', JSON.stringify(date_filters));
    if (filters) params.set('filters', JSON.stringify(filters));

    const url = `https://connectors.windsor.ai/all?${params.toString()}`;
    const response = await fetch(url);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json({ error: 'Invalid response from Windsor', raw: text.slice(0, 500) }, { status: 502 });
    }

    // Include debug info so frontend can log what Windsor actually returned
    const debugUrl = url.replace(apiKey, 'REDACTED');
    const debugKeys = typeof data === 'object' && data !== null ? Object.keys(data) : [];
    const debugSample = JSON.stringify(data).slice(0, 300);

    // Windsor may return { data: [...] } or just [...] or { error: ... }
    if (data.error) {
      return Response.json({ error: data.error, data: [], _debug: { url: debugUrl, keys: debugKeys, sample: debugSample, status: response.status } }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Normalize: always return { data: [...] }
    const rows = Array.isArray(data) ? data : (data.data || []);
    return Response.json({ data: rows, _debug: { url: debugUrl, keys: debugKeys, rowCount: rows.length, sample: debugSample, status: response.status } }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    return Response.json({ error: err.message, data: [] }, { status: 500 });
  }
};

export const config = { path: '/api/windsor' };
