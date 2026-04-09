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

  const apiKey = Netlify.env.get('WINDSOR_API_KEY');
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
    const data = await response.json();

    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const config = { path: '/api/windsor' };
