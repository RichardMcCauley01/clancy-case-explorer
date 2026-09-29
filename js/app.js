/* Shared helpers, routing, content warning, drawer, media and sources pages. */
(function(){
'use strict';
const DATA = window.CASE_DATA, MEDIA = window.MEDIA_DATA;
const byId = {}; DATA.events.forEach(e => byId[e.id] = e);
const mediaById = {}; MEDIA.media.forEach(m => mediaById[m.id] = m);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Parse the *local* (Eastern) wall-clock part of an ISO string as if it were UTC, so display never depends on the viewer's timezone. */
function parseLocal(dt){
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?(?:T(\d{2}):(\d{2}))?/.exec(dt);
  return new Date(Date.UTC(+m[1], m[2] ? +m[2]-1 : 0, m[3] ? +m[3] : 1, m[4] ? +m[4] : 0, m[5] ? +m[5] : 0));
}
function tzLabel(dt){ return /-04:00$/.test(dt) ? 'EDT' : 'EST'; }
function fmtClock(d){ let h = d.getUTCHours(), mi = d.getUTCMinutes(); const ap = h >= 12 ? 'p.m.' : 'a.m.'; h = h % 12 || 12; return h + ':' + String(mi).padStart(2,'0') + ' ' + ap; }
function fmtWhen(e, opts){
  opts = opts || {};
  const d = parseLocal(e.datetime), p = e.precision;
  const date = MONTHS[d.getUTCMonth()] + (p === 'month' ? ' ' : ' ' + d.getUTCDate() + ', ') + d.getUTCFullYear();
  if (p === 'month') return 'Month of ' + date + (opts.short ? '' : ' (exact date not reported)');
  if (!/^\d{4}-\d{2}-\d{2}/.test(e.datetime)) return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + (opts.short ? ' (approx.)' : ' (approximate)');
  if (p === 'day' || !/T/.test(e.datetime)) return date;
  const t = fmtClock(d) + ' ' + tzLabel(e.datetime);
  if (p === 'approximate') return date + ', ≈ ' + t + (opts.short ? '' : ' (approximate)');
  return date + ', ' + t;
}
function statusClass(s){ if (s === 'established fact') return 's-fact'; if (s === 'defense claim') return 's-defense'; if (s === 'prosecution claim') return 's-prosecution'; return 's-testimony'; }
function statusGroup(s){ if (s === 'established fact') return 'fact'; if (s === 'defense claim') return 'defense'; if (s === 'prosecution claim') return 'prosecution'; return 'testimony'; }
function badge(s){ return '<span class="badge ' + statusClass(s) + '">' + esc(s) + '</span>'; }
const CAT_LABEL = {'medical-history':'Medical history','day-of':'Day of (Jan 24, 2023)','investigation':'Investigation','legal':'Legal','trial-testimony':'Trial testimony','media':'Media'};
const POV_LABEL = {lindsay:"Lindsay's account / defense", patrick:"Patrick's account", evidence:'Evidence'};
function srcLink(s){ return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + '</a> <span class="small">(' + esc(s.outlet) + (s.date ? ', ' + esc(s.date) : '') + ')</span>'; }
function sourcesHTML(e){ return '<ul class="srcs">' + e.sources.map(s => '<li>' + srcLink(s) + '</li>').join('') + '</ul>'; }

/* ---------- Routing ---------- */
const listeners = {};
function on(name, fn){ (listeners[name] = listeners[name] || []).push(fn); }
function emit(name, arg){ (listeners[name] || []).forEach(f => { try { f(arg); } catch (err) { console.error(err); } }); }
function parseHash(){
  const h = location.hash.replace(/^#/, ''); const [view, q] = h.split('?');
  const params = new URLSearchParams(q || location.search.replace(/^\?/, ''));
  return { view: ['scene','timeline','media','sources','about','text'].includes(view) ? view : 'scene', params };
}
let currentView = null;
function route(){
  const { view, params } = parseHash();
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.dataset.view === view));
  document.querySelectorAll('.tabs a').forEach(a => { const on = a.dataset.view === view; a.classList.toggle('active', on); a.setAttribute('aria-selected', on); });
  if (currentView !== view){ currentView = view; window.scrollTo(0, 0); emit('view', { view, params }); }
  else emit('params', { view, params });
}
window.addEventListener('hashchange', route);

/* ---------- Content warning ---------- */
function initCW(){
  const cw = document.getElementById('cw');
  let seen = false; try { seen = localStorage.getItem('clancy-cw') === '1'; } catch (e) {}
  if (new URLSearchParams(location.search).get('cw') === '0') seen = true;
  if (!seen){ cw.hidden = false; document.getElementById('cw-ok').focus(); }
  document.getElementById('cw-ok').addEventListener('click', () => { cw.hidden = true; try { localStorage.setItem('clancy-cw','1'); } catch (e) {} emit('cwclosed'); });
}

/* ---------- Drawer ---------- */
const drawer = document.getElementById('drawer'), dbody = document.getElementById('drawer-body');
function openEvent(id){
  const e = byId[id]; if (!e) return;
  const povs = e.pov.length ? e.pov.map(p => '<span class="pill"><span class="dot pov-' + p + '"></span>' + POV_LABEL[p] + '</span>').join('') : '<span class="pill"><span class="dot pov-other"></span>Other: prosecution / third-party</span>';
  let h = '<div class="meta"><span class="pill">' + esc(CAT_LABEL[e.category] || e.category) + '</span>' + povs + '</div>';
  h += '<h2>' + esc(e.title) + '</h2>';
  h += '<div class="meta"><span class="when">' + esc(fmtWhen(e)) + '</span></div>';
  h += '<div class="meta">' + badge(e.status) + ' &nbsp;📍 ' + esc(e.location) + '</div>';
  h += '<p class="desc">' + esc(e.description) + '</p>';
  if (e.timeNote) h += '<div class="note"><strong>Timing:</strong> ' + esc(e.timeNote) + '</div>';
  if (e.note) h += '<div class="note">' + esc(e.note) + '</div>';
  h += '<h4>Sources</h4>' + sourcesHTML(e);
  if (e.related && e.related.length){
    h += '<h4>Related / counterpoints</h4><ul>' + e.related.map(r => byId[r] ? '<li><a class="rel-link" data-ev="' + r + '">' + esc(byId[r].title) + '</a> ' + badge(byId[r].status) + '</li>' : '').join('') + '</ul>';
  }
  if (e.media && e.media.length){
    h += '<h4>Linked media &amp; documents</h4><ul>' + e.media.map(m => { const x = mediaById[m]; return '<li><a href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer">' + esc(x.title) + '</a> <span class="small">(' + esc(x.outlet) + ', ' + esc(x.type) + ')</span></li>'; }).join('') + '</ul>';
  }
  const inScene = Object.keys(DATA.scenePaths).filter(k => DATA.scenePaths[k].includes(e.id));
  if (inScene.length) h += '<h4>In the 3D reconstruction</h4><p class="small">' + inScene.map(k => '<a href="#scene?pov=' + k + '&step=' + e.id + '">' + POV_LABEL[k] + ' path</a>').join(' · ') + '</p>';
  dbody.innerHTML = h;
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
  emit('select', id);
}
function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); emit('select', null); }
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') closeDrawer(); });
document.addEventListener('click', ev => {
  const a = ev.target.closest('[data-ev]'); if (!a) return;
  ev.preventDefault(); openEvent(a.dataset.ev);
});
drawer.addEventListener('click', ev => { const a = ev.target.closest('a[href^="#scene"]'); if (a) closeDrawer(); });

/* ---------- Media ---------- */
function mediaCard(m){
  const evs = m.events.filter(i => byId[i]).map(i => '<a data-ev="' + i + '">' + esc(byId[i].title) + '</a>').join(' · ');
  return '<div class="mcard"><div class="type">' + esc(m.type) + '</div>' +
    '<a class="title" href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer">' + esc(m.title) + ' ↗</a>' +
    '<div class="src">' + esc(m.outlet) + ' · ' + esc(m.date) + '</div>' +
    '<div class="d">' + esc(m.description) + '</div>' + (evs ? '<div class="evs">Events: ' + evs + '</div>' : '') + '</div>';
}
function renderMedia(){
  const grid = document.getElementById('media-grid'), filt = document.getElementById('media-filter');
  const groups = {'All':null,'Court filings & official documents':/filing|official|document|ruling/,'Trial video':/trial video/,'Interviews & statements':/interview|statement/,'Audio / 911 coverage':/audio/,'Messages & data quoted in court':/messages|data/,'Hearing coverage':/hearing|proceeding/,'Reference':/reference/};
  let cur = 'All';
  function draw(){ const re = groups[cur]; grid.innerHTML = MEDIA.media.filter(m => !re || re.test(m.type)).map(mediaCard).join(''); filt.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.g === cur)); }
  filt.innerHTML = Object.keys(groups).map(g => '<button class="chip" data-g="' + esc(g) + '">' + esc(g) + '</button>').join('');
  filt.addEventListener('click', ev => { const c = ev.target.closest('.chip'); if (c){ cur = c.dataset.g; draw(); } });
  draw();
  document.getElementById('not-public').innerHTML = MEDIA.notPublic.map(t => '<li>' + esc(t) + '</li>').join('');
  document.getElementById('tl-media').innerHTML = MEDIA.media.map(mediaCard).join('');
}

/* ---------- Sources ---------- */
function allSources(){
  const map = new Map();
  DATA.events.forEach(e => e.sources.forEach(s => { if (!map.has(s.url)) map.set(s.url, Object.assign({ events: [], media: [] }, s)); map.get(s.url).events.push(e.id); }));
  MEDIA.media.forEach(m => { if (!map.has(m.url)) map.set(m.url, { title: m.title, url: m.url, outlet: m.outlet, date: m.date, events: [], media: [] }); map.get(m.url).media.push(m.id); });
  return [...map.values()].sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.outlet.localeCompare(b.outlet));
}
function renderSources(){
  const list = allSources(), box = document.getElementById('sources-list'), inp = document.getElementById('src-search');
  function draw(){
    const q = inp.value.trim().toLowerCase();
    const rows = list.filter(s => !q || (s.title + ' ' + s.outlet + ' ' + s.url).toLowerCase().includes(q));
    box.innerHTML = '<p class="small">' + rows.length + ' of ' + list.length + ' unique sources.</p>' + rows.map((s, i) =>
      '<div class="src-item"><div class="t">' + (i + 1) + '. <a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + '</a></div>' +
      '<div class="m">' + esc(s.outlet) + ' · ' + esc(s.date) + ' · <span style="word-break:break-all">' + esc(s.url) + '</span></div>' +
      (s.events.length ? '<div class="cites">Cited by ' + s.events.length + ' event' + (s.events.length > 1 ? 's' : '') + ': ' + s.events.map(id => '<a data-ev="' + id + '">' + esc(byId[id].title) + '</a>').join(' · ') + '</div>' : '') +
      (s.media.length ? '<div class="cites">Listed in Media &amp; Documents</div>' : '') + '</div>').join('');
  }
  inp.addEventListener('input', draw); draw();
  document.getElementById('about-counts').textContent = DATA.events.length + ' events · ' + list.length + ' unique sources · ' + MEDIA.media.length + ' media/document links.';
}

window.CASE = { DATA, MEDIA, byId, mediaById, esc, parseLocal, fmtWhen, fmtClock, tzLabel, statusClass, statusGroup, badge, CAT_LABEL, POV_LABEL, sourcesHTML, srcLink, openEvent, closeDrawer, on, emit, parseHash, allSources };

document.addEventListener('DOMContentLoaded', () => {
  initCW(); renderMedia(); renderSources();
  setTimeout(route, 0);
});
})();
