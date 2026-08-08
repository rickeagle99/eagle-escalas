// Vercel read-only gateway: Eagle Escalas -> NewSky.
// NEWSKY_API_TOKEN is a Vercel Environment Variable. Never commit the token.
const BASE = 'https://newsky.app/api/airline-api';

function send(res, status, body) { res.status(status).setHeader('Cache-Control', 'no-store').json(body); }
function cors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ['https://rickeagle99.github.io','https://www.eagleair.com.br','https://eagleair.com.br'];
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}
async function nsFetch(path, init = {}) {
  if (!process.env.NEWSKY_API_TOKEN) throw new Error('NEWSKY_API_TOKEN não configurado na Vercel.');
  return fetch(`${BASE}${path}`, { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${process.env.NEWSKY_API_TOKEN}`, 'Content-Type': 'application/json' } });
}
async function getFirst(paths) {
  let last = null;
  for (const path of paths) {
    const r = await nsFetch(path);
    if (r.ok) return { path, data: await r.json() };
    last = r.status;
    if (![404,405].includes(r.status)) break;
  }
  throw new Error(`NewSky não disponibilizou um endpoint de leitura compatível (HTTP ${last}).`);
}
function list(data, keys) {
  if (Array.isArray(data)) return data;
  for (const k of keys) if (Array.isArray(data?.[k])) return data[k];
  return [];
}
export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const action = String(req.query.action || 'status');
  try {
    if (action === 'status') return send(res, 200, { status: process.env.NEWSKY_API_TOKEN ? 'configured' : 'error', service: 'Eagle Escalas NewSky API', readonly: true });
    if (action === 'test') {
      const end = new Date(), start = new Date(end.getTime() - 86400000);
      const r = await nsFetch('/flights/bydate', { method:'POST', body: JSON.stringify({ start:start.toISOString(), end:end.toISOString() }) });
      if (!r.ok) return send(res,r.status,{status:'error',message:`NewSky respondeu HTTP ${r.status}.`});
      return send(res,200,{status:'connected',message:'Leitura do NewSky confirmada.',readonly:true});
    }
    if (action === 'flights') {
      const days = Math.max(1, Math.min(Number(req.body?.days)||90,90));
      const end = new Date(), start = new Date(end.getTime()-days*86400000);
      const r = await nsFetch('/flights/bydate',{method:'POST',body:JSON.stringify({start:start.toISOString(),end:end.toISOString()})});
      const data = await r.json().catch(()=>null);
      if(!r.ok)return send(res,r.status,{message:`NewSky respondeu HTTP ${r.status}.`,data});
      return send(res,200,{results:list(data,['results','flights'])});
    }
    if (action === 'pilots') {
      const {data,path}=await getFirst(['/pilots','/pilot']);
      return send(res,200,{source:path,results:list(data,['results','pilots','data'])});
    }
    if (action === 'aircraft') {
      const {data,path}=await getFirst(['/aircraft','/fleet','/fleet/aircraft']);
      return send(res,200,{source:path,results:list(data,['results','aircraft','fleet','data'])});
    }
    if (action === 'routes') {
      const {data,path}=await getFirst(['/schedules','/routes','/schedule']);
      return send(res,200,{source:path,results:list(data,['results','schedules','routes','data'])});
    }
    return send(res,404,{message:'Endpoint não encontrado.'});
  } catch(e) { return send(res,500,{status:'error',message:e?.message||'Erro interno.'}); }
}
