// Backend proxy for NewSky.
// Deploy this function on a serverless platform that supports Node.js
// (for example Cloudflare Pages Functions/Workers or Vercel).
// Set NEWSKY_API_TOKEN as a server-side secret. Never commit it.

const NEWSKY_BASE = 'https://newsky.app/api/airline-api';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

function cors(request) {
  const origin = request.headers.get('origin') || '';
  // In production, replace with the exact Eagle Escalas origin.
  return origin;
}

async function newSkyFetch(path, init = {}, token) {
  if (!token) throw new Error('NEWSKY_API_TOKEN não configurado no backend.');
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  return fetch(`${NEWSKY_BASE}${path}`, { ...init, headers });
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  const token = env.NEWSKY_API_TOKEN;
  const action = Array.isArray(params?.path) ? params.path.join('/') : String(params?.path || '');

  if (method === 'OPTIONS') return new Response(null, { status: 204 });

  try {
    if (action === 'status') {
      return json({
        status: token ? 'configured' : 'error',
        lastSync: env.NEWSKY_LAST_SYNC || null,
        message: token ? 'Backend configurado. Use Testar conexão.' : 'Configure o segredo NEWSKY_API_TOKEN.'
      });
    }

    if (action === 'test') {
      // The by-date endpoint is a documented/observed NewSky airline API endpoint.
      // Use a tiny one-day window to validate the credential without exposing it.
      const now = new Date();
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const end = now.toISOString();
      const response = await newSkyFetch('/flights/bydate', {
        method: 'POST',
        body: JSON.stringify({ start, end })
      }, token);
      if (!response.ok) return json({ status: 'error', message: `NewSky respondeu HTTP ${response.status}.` }, response.status);
      return json({ status: 'connected', message: 'Conexão com o NewSky confirmada.' });
    }

    if (action === 'sync-flights') {
      if (method !== 'POST') return json({ message: 'Método não permitido.' }, 405);
      const body = await request.json().catch(() => ({}));
      const days = Math.max(1, Math.min(Number(body.days) || 30, 90));
      const end = new Date();
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
      const response = await newSkyFetch('/flights/bydate', {
        method: 'POST',
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() })
      }, token);
      const data = await response.json().catch(() => null);
      if (!response.ok) return json({ message: `NewSky respondeu HTTP ${response.status}.`, data }, response.status);

      // This first version returns normalized data to the client. It intentionally
      // does not attempt undocumented write operations or store the API token.
      const flights = Array.isArray(data?.results) ? data.results : [];
      return json({ imported: flights.length, flights });
    }

    return json({ message: 'Endpoint NewSky não encontrado.' }, 404);
  } catch (error) {
    return json({ status: 'error', message: error?.message || 'Erro interno na integração NewSky.' }, 500);
  }
}
