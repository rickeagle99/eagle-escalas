/* NewSky integration client.
 * IMPORTANT: no NewSky token belongs in this file. The browser talks only to
 * the configured backend proxy at /api/newsky.
 */
(function () {
  const API = '/api/newsky';

  async function call(path, options) {
    const response = await fetch(API + path, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...(options || {})
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = { message: text }; }
    if (!response.ok) throw new Error(data?.message || `Erro HTTP ${response.status}`);
    return data;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function statusBadge(status) {
    const cls = status === 'connected' ? 'ok' : status === 'error' ? 'warn' : '';
    const label = status === 'connected' ? 'Conectado' : status === 'error' ? 'Erro' : 'Não configurado';
    return `<span class="badge ${cls}">${label}</span>`;
  }

  async function renderNewSkyAdmin() {
    const c = document.querySelector('#newsky-panel');
    if (!c) return;
    c.innerHTML = '<p class="muted">Verificando integração...</p>';
    try {
      const s = await call('/status');
      c.innerHTML = `
        <div class="card">
          <h3>☁ Integração NewSky</h3>
          <p>Credencial protegida no backend. Ela nunca é enviada ao navegador.</p>
          <p>Status: ${statusBadge(s.status)}</p>
          <p class="muted">Última sincronização: ${escapeHtml(s.lastSync || 'Nunca')}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
            <button class="btn" onclick="window.NewSky.test()">Testar conexão</button>
            <button class="btn green" onclick="window.NewSky.syncFlights()">Sincronizar voos</button>
          </div>
          <div id="newsky-result" class="note" style="margin-top:14px">${escapeHtml(s.message || 'Configure o backend e o segredo NEWSKY_API_TOKEN.')}</div>
        </div>`;
    } catch (e) {
      c.innerHTML = `<div class="card"><h3>☁ Integração NewSky</h3><p>Status: ${statusBadge('error')}</p><div class="note">${escapeHtml(e.message)}</div></div>`;
    }
  }

  async function test() {
    const r = document.querySelector('#newsky-result');
    if (r) r.textContent = 'Testando conexão...';
    try {
      const s = await call('/test');
      if (r) r.textContent = s.message || 'Conexão OK.';
      renderNewSkyAdmin();
    } catch (e) { if (r) r.textContent = e.message; }
  }

  async function syncFlights() {
    const r = document.querySelector('#newsky-result');
    if (r) r.textContent = 'Sincronizando voos recentes...';
    try {
      const result = await call('/sync-flights', { method: 'POST', body: JSON.stringify({ days: 30 }) });
      if (r) r.textContent = `Sincronização concluída: ${result.imported || 0} voo(s) processado(s).`;
      if (typeof save === 'function' && typeof render === 'function') render();
      renderNewSkyAdmin();
    } catch (e) { if (r) r.textContent = e.message; }
  }

  window.NewSky = { test, syncFlights, render: renderNewSkyAdmin };

  const originalAdmin = window.admin;
  window.admin = function (c) {
    if (typeof originalAdmin === 'function') originalAdmin(c);
    const integration = document.createElement('div');
    integration.id = 'newsky-panel';
    integration.style.marginTop = '18px';
    c.appendChild(integration);
    renderNewSkyAdmin();
  };
})();
