// Vercel Serverless Function: Eagle Escalas -> NewSky
// Configure NEWSKY_API_TOKEN in Vercel Project Settings -> Environment Variables.
const BASE = 'https://newsky.app/api/airline-api';

function send(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

function cors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = [
    'https://rickeagle99.github.io',
    'https://www.eagleair.com.br',
    'https://eagleair.com.br'
  ];
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

async function nsFetch(path, init, token) {
  if (!token) throw new Error('NEWSKY_API_TOKEN não configurado na Vercel.');
  const headers = { ...(init?.headers || {}), Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  return fetch(`${BASE}${path}`, { ...(init || {}), headers });
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const action = String(req.query.action || 'status');
  try {
    if (action === 'status') return send(res, 200, { status: process.env.NEWSKY_API_TOKEN ? 'configured' : 'error', service: 'Eagle Escalas NewSky API' });

    if (action === 'test') {
      const end = new Date();
      const start = new Date(end.getTime() - 86400000);
      const r = await nsFetch('/flights/bydate', { method: 'POST', body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() }) }, process.env.NEWSKY_API_TOKEN);
      if (!r.ok) return send(res, r.status, { status: 'error', message: `NewSky respondeu HTTP ${r.status}.` });
      return send(res, 200, { status: 'connected', message: 'Conexão com o NewSky confirmada.' });
    }

    if (action === 'flights') {
      const days = Math.max(1, Math.min(Number(req.body?.days) || 30, 90));
      const end = new Date();
      const start = new Date(end.getTime() - days * 86400000);
      const r = await nsFetch('/flights/bydate', { method: 'POST', body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() }) }, process.env.NEWSKY_API_TOKEN);
      const data = await r.json().catch(() => null);
      if (!r.ok) return send(res, r.status, { message: `NewSky respondeu HTTP ${r.status}.`, data });
      const results = Array.isArray(data?.results) ? data.results : [];
      return send(res, 200, { imported: results.length, results });
    }

    return send(res, 404, { message: 'Endpoint não encontrado.' });
  } catch (e) {
    return send(res, 500, { status: 'error', message: e?.message || 'Erro interno.' });
  }
}
