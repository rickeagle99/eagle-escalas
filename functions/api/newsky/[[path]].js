const NEWSKY_BASE = 'https://newsky.app/api/airline-api';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
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
  const path = Array.isArray(params?.path) ? params.path.join('/') : String(params?.path || '');

  if (method === 'OPTIONS') return new Response(null, { status: 204 });

  try {
    if (path === 'status') {
      return json({
        status: token ? 'configured' : 'error',
        lastSync: env.NEWSKY_LAST_SYNC || null,
        message: token ? 'Backend configurado. Use Testar conexão.' : 'Configure o segredo NEWSKY_API_TOKEN.'
      });
    }

    if (path === 'test') {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      const response = await newSkyFetch('/flights/bydate', {
        method: 'POST',
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() })
      }, token);
      if (!response.ok) return json({ status: 'error', message: `NewSky respondeu HTTP ${response.status}.` }, response.status);
      return json({ status: 'connected', message: 'Conexão com o NewSky confirmada.' });
    }

    if (path === 'sync-flights') {
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
      const flights = Array.isArray(data?.results) ? data.results : [];
      return json({ imported: flights.length, flights });
    }

    return json({ message: 'Endpoint NewSky não encontrado.' }, 404);
  } catch (error) {
    return json({ status: 'error', message: error?.message || 'Erro interno na integração NewSky.' }, 500);
  }
}
