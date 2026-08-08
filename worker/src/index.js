const ALLOWED_ORIGINS = [
  'https://rickeagle99.github.io',
  'https://www.eagleair.com.br',
  'https://eagleair.com.br'
];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(request),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function newSkyFetch(env, path, init = {}) {
  if (!env.NEWSKY_API_TOKEN) throw new Error('NEWSKY_API_TOKEN não configurado no Worker.');
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${env.NEWSKY_API_TOKEN}`);
  headers.set('Content-Type', 'application/json');
  return fetch(`${env.NEWSKY_BASE_URL || 'https://newsky.app/api/airline-api'}${path}`, {
    ...init,
    headers
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (path === '/status' && request.method === 'GET') {
        return json(request, {
          status: env.NEWSKY_API_TOKEN ? 'configured' : 'error',
          service: 'Eagle Escalas NewSky Worker'
        });
      }

      if (path === '/test' && request.method === 'GET') {
        const end = new Date();
        const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        const response = await newSkyFetch(env, '/flights/bydate', {
          method: 'POST',
          body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() })
        });
        if (!response.ok) {
          return json(request, { status: 'error', message: `NewSky respondeu HTTP ${response.status}.` }, response.status);
        }
        return json(request, { status: 'connected', message: 'Conexão com o NewSky confirmada.' });
      }

      if (path === '/flights' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const days = Math.max(1, Math.min(Number(body.days) || 30, 90));
        const end = new Date();
        const start = new Date(end.getTime() - days * 86400000);
        const response = await newSkyFetch(env, '/flights/bydate', {
          method: 'POST',
          body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() })
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) return json(request, { message: `NewSky respondeu HTTP ${response.status}.`, data }, response.status);
        return json(request, {
          imported: Array.isArray(data?.results) ? data.results.length : 0,
          results: Array.isArray(data?.results) ? data.results : []
        });
      }

      return json(request, { message: 'Endpoint não encontrado.' }, 404);
    } catch (error) {
      return json(request, { status: 'error', message: error?.message || 'Erro interno.' }, 500);
    }
  }
};
