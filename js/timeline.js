/* Timeline: d3 swimlanes (3 POVs + other), zoom years -> day -> minutes, filters, search, list view, detail drawer. */
(function(){
'use strict';
const C = window.CASE, DATA = C.DATA, esc = C.esc;
const LANES = [
  { key: 'lindsay', name: "Lindsay's account", sub: 'her statements / defense', color: '#c89adf' },
  { key: 'patrick', name: "Patrick's account", sub: 'his testimony / statements', color: '#6fb4e6' },
  { key: 'evidence', name: 'Evidence', sub: 'documented facts', color: '#e2c46a' },
  { key: 'other', name: 'Other', sub: 'prosecution claims & third-party testimony', color: '#9aa4b1' },
];
const STATUS = [
  { key: 'fact', name: 'Established fact', color: '#6fbf8e' }, { key: 'testimony', name: 'Testimony', color: '#6fb4e6' },
  { key: 'defense', name: 'Defense claim', color: '#c89adf' }, { key: 'prosecution', name: 'Prosecution claim', color: '#e58a6f' },
];
const STATUS_COLOR = {}; STATUS.forEach(s => STATUS_COLOR[s.key] = s.color);
const CATS = Object.keys(C.CAT_LABEL);
const U = (y, m, d, h, mi) => new Date(Date.UTC(y, m - 1, d || 1, h || 0, mi || 0));
const PRESETS = {
  all: [U(2019, 9, 1), U(2026, 12, 1)], history: [U(2022, 4, 15), U(2023, 1, 31)],
  day: [U(2023, 1, 24, 7), U(2023, 1, 25, 0)], minutes: [U(2023, 1, 24, 15, 55), U(2023, 1, 24, 19, 5)],
  trial: [U(2026, 7, 10), U(2026, 11, 10)],
};
const PHASES = [
  { a: U(2022, 5, 26), b: U(2023, 1, 24), t: 'Postpartum period & treatment' },
  { a: U(2023, 1, 24), b: U(2023, 1, 25), t: 'Jan 24, 2023' },
  { a: U(2023, 1, 25), b: U(2026, 7, 20), t: 'Pretrial proceedings' },
  { a: U(2026, 7, 20), b: U(2026, 9, 4, 14, 20), t: 'Trial & deliberations' },
  { a: U(2026, 9, 4, 14, 20), b: U(2026, 11, 3), t: 'After mistrial' },
];
const F = { cats: new Set(CATS), status: new Set(STATUS.map(s => s.key)), lanes: new Set(LANES.map(l => l.key)), q: '' };
let svg, gPlot, gAxis, gGrid, gLanes, gPhases, x0, zx, zoom, W = 1000, selected = null, inited = false, tip;
const M = { left: 178, right: 18, top: 34, bottom: 24 };
const items = [];
DATA.events.forEach(e => {
  const lanes = e.pov.length ? e.pov : ['other'];
  lanes.forEach(l => items.push({ e, lane: l, t: C.parseLocal(e.datetime), sg: C.statusGroup(e.status), key: e.id + '|' + l }));
});
function matches(e){
  if (!F.cats.has(e.category) || !F.status.has(C.statusGroup(e.status))) return false;
  if (!F.q) return true;
  const hay = (e.title + ' ' + e.description + ' ' + e.location + ' ' + e.status + ' ' + (e.timeNote || '') + ' ' + e.sources.map(s => s.outlet + ' ' + s.title).join(' ')).toLowerCase();
  return F.q.split(/\s+/).every(w => hay.includes(w));
}

function buildFilters(){
  const chip = (grp, key, label, dot) => '<button class="chip on" data-grp="' + grp + '" data-key="' + key + '">' + (dot ? '<span class="dot" style="background:' + dot + '"></span>' : '') + esc(label) + '</button>';
  document.getElementById('f-cat').insertAdjacentHTML('beforeend', CATS.map(c => chip('cats', c, C.CAT_LABEL[c])).join(''));
  document.getElementById('f-status').insertAdjacentHTML('beforeend', STATUS.map(s => chip('status', s.key, s.name, s.color)).join(''));
  document.getElementById('f-lane').insertAdjacentHTML('beforeend', LANES.map(l => chip('lanes', l.key, l.name, l.color)).join(''));
  document.querySelector('.tl-filters').addEventListener('click', ev => {
    const c = ev.target.closest('.chip'); if (!c) return;
    const set = F[c.dataset.grp];
    if (ev.altKey || ev.shiftKey){ set.clear(); set.add(c.dataset.key); document.querySelectorAll('.chip[data-grp="' + c.dataset.grp + '"]').forEach(x => x.classList.toggle('on', x === c)); }
    else { if (set.has(c.dataset.key)) set.delete(c.dataset.key); else set.add(c.dataset.key); c.classList.toggle('on'); }
    draw(); drawList();
  });
  document.getElementById('tl-search').addEventListener('input', ev => { F.q = ev.target.value.trim().toLowerCase(); draw(); drawList(); });
  document.getElementById('tl-listtoggle').addEventListener('click', ev => { const l = document.getElementById('tl-list'); l.hidden = !l.hidden; ev.target.classList.toggle('active', !l.hidden); ev.target.textContent = l.hidden ? 'List view' : 'Hide list'; drawList(); });
  document.querySelectorAll('.zbtn').forEach(b => b.addEventListener('click', () => zoomTo(b.dataset.zoom, true)));
}

function init(){
  if (inited) return; inited = true;
  buildFilters();
  const host = d3.select('#tl-chart');
  tip = host.append('div').attr('class', 'tl-tip').style('display', 'none');
  svg = host.append('svg');
  svg.append('defs').append('clipPath').attr('id', 'tlclip').append('rect');
  gPhases = svg.append('g').attr('class', 'phase').attr('clip-path', 'url(#tlclip)');
  gLanes = svg.append('g');
  gGrid = svg.append('g').attr('class', 'grid').attr('clip-path', 'url(#tlclip)');
  gAxis = svg.append('g').attr('class', 'axis');
  gPlot = svg.append('g').attr('clip-path', 'url(#tlclip)');
  x0 = d3.scaleUtc().domain(PRESETS.all);
  zx = x0.copy();
  zoom = d3.zoom().scaleExtent([0.7, 80000]).on('zoom', ev => { zx = ev.transform.rescaleX(x0); draw(); });
  svg.call(zoom).on('dblclick.zoom', null);
  const resize = () => {
    W = document.getElementById('tl-chart').clientWidth || 1000;
    const t = d3.zoomTransform(svg.node());
    x0.range([M.left, W - M.right]); zx = t.rescaleX(x0);
    zoom.extent([[M.left, 0], [W - M.right, 10]]).translateExtent([[x0(U(2019, 1, 1)), 0], [x0(U(2027, 6, 1)), 10]]);
    draw();
  };
  if (window.ResizeObserver) new ResizeObserver(resize).observe(document.getElementById('tl-chart')); else window.addEventListener('resize', resize);
  resize();
  C.on('select', id => { selected = id; gPlot.selectAll('.ev').classed('sel', d => d.e.id === id); });
  drawList();
}
function zoomTo(name, animate){
  const [a, b] = PRESETS[name] || PRESETS.all;
  const k = (W - M.left - M.right) / (x0(b) - x0(a));
  const t = d3.zoomIdentity.translate(M.left - x0(a) * k, 0).scale(k);
  (animate ? svg.transition().duration(750) : svg).call(zoom.transform, t);
  document.querySelectorAll('.zbtn').forEach(x => x.classList.toggle('active', x.dataset.zoom === name));
}

function layout(vis){
  // Greedy row assignment per lane, so labels don't overlap at the current zoom.
  const rowsByLane = {}, laneRows = {};
  LANES.forEach(l => { rowsByLane[l.key] = []; laneRows[l.key] = 1; });
  const [d0, d1] = zx.domain();
  vis.sort((a, b) => a.t - b.t);
  vis.forEach(d => {
    d.x = zx(d.t);
    const inView = d.t >= d0 && d.t <= d1;
    const rows = rowsByLane[d.lane], maxRows = 9;
    const lw = Math.min(d.e.title.length, 34) * 6.1 + 14;
    let r = rows.findIndex(end => end < d.x - 6);
    if (r === -1 && rows.length < maxRows){ r = rows.length; rows.push(-Infinity); }
    if (r !== -1){ d.row = r; d.label = inView; rows[r] = d.x + (inView ? lw : 12); }
    else { d.row = maxRows; d.label = false; }   // overflow strip: unlabeled markers (zoom in to separate)
    laneRows[d.lane] = Math.max(laneRows[d.lane], d.row + 1);
  });
  let y = M.top; const laneY = {};
  LANES.filter(l => F.lanes.has(l.key)).forEach(l => { const h = Math.max(64, laneRows[l.key] * 21 + 22); laneY[l.key] = { y, h }; y += h; });
  return { laneY, height: y + M.bottom };
}
function draw(){
  if (!svg) return;
  const vis = items.filter(d => F.lanes.has(d.lane) && matches(d.e));
  const { laneY, height } = layout(vis);
  svg.attr('width', W).attr('height', height);
  svg.select('#tlclip rect').attr('x', M.left).attr('y', 0).attr('width', W - M.left - M.right).attr('height', height);
  const lanes = LANES.filter(l => F.lanes.has(l.key));
  const lg = gLanes.selectAll('g.lane').data(lanes, d => d.key).join(enter => { const g = enter.append('g').attr('class', 'lane'); g.append('rect').attr('class', 'lane-bg'); g.append('rect').attr('class', 'lane-color'); g.append('text').attr('class', 'lane-label'); g.append('text').attr('class', 'lane-sub'); return g; });
  lg.select('.lane-bg').attr('x', 0).attr('width', W).attr('y', d => laneY[d.key].y).attr('height', d => laneY[d.key].h).attr('class', (d, i) => 'lane-bg' + (i % 2 ? ' alt' : ''));
  lg.select('.lane-color').attr('x', 0).attr('width', 4).attr('y', d => laneY[d.key].y).attr('height', d => laneY[d.key].h).attr('fill', d => d.color);
  lg.select('.lane-label').attr('x', 14).attr('y', d => laneY[d.key].y + 22).text(d => d.name).attr('fill', d => d.color);
  lg.select('.lane-sub').attr('x', 14).attr('y', d => laneY[d.key].y + 38).text(d => d.sub).each(function(d){ wrapSub(d3.select(this), d.sub, laneY[d.key].y + 38); });
  // phases
  gPhases.selectAll('g.ph').data(PHASES).join(enter => { const g = enter.append('g').attr('class', 'ph'); g.append('rect'); g.append('text'); return g; })
    .each(function(p, i){ const g = d3.select(this), xa = zx(p.a), xb = zx(p.b); g.select('rect').attr('x', xa).attr('y', M.top).attr('width', Math.max(1, xb - xa)).attr('height', height - M.top - M.bottom + 20).attr('fill', i % 2 ? 'rgba(143,179,217,0.035)' : 'rgba(217,179,108,0.05)');
      const vis0 = Math.max(xa, M.left), vis1 = Math.min(xb, W - M.right); g.select('text').attr('x', vis0 + 6).attr('y', height - 6).text(vis1 - vis0 > 110 ? p.t : ''); });
  // axis + grid
  const ticks = Math.max(4, Math.floor((W - M.left) / 110));
  gAxis.attr('transform', 'translate(0,' + (M.top - 4) + ')').call(d3.axisTop(zx).ticks(ticks).tickSizeOuter(0));
  gGrid.attr('transform', 'translate(0,' + M.top + ')').call(d3.axisBottom(zx).ticks(ticks).tickSize(height - M.top).tickFormat('')).call(g => g.select('.domain').remove());
  // events
  const evs = gPlot.selectAll('g.ev').data(vis, d => d.key).join(enter => {
    const g = enter.append('g').attr('class', 'ev').attr('tabindex', 0).attr('role', 'button');
    g.append('circle').attr('r', 6); g.append('text').attr('x', 10).attr('dy', '0.35em'); return g;
  });
  evs.attr('transform', d => 'translate(' + d.x + ',' + (laneY[d.lane].y + 16 + d.row * 21) + ')')
    .classed('sel', d => d.e.id === selected)
    .attr('aria-label', d => d.e.title + ', ' + C.fmtWhen(d.e));
  evs.select('circle').attr('fill', d => (d.e.precision === 'approximate' || d.e.precision === 'month') ? '#12161c' : STATUS_COLOR[d.sg]).attr('stroke', d => STATUS_COLOR[d.sg]);
  evs.select('text').text(d => d.label ? (d.e.title.length > 34 ? d.e.title.slice(0, 33) + '…' : d.e.title) : '');
  evs.on('click', (ev, d) => C.openEvent(d.e.id))
    .on('keydown', (ev, d) => { if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); C.openEvent(d.e.id); } })
    .on('mouseenter', (ev, d) => { tip.style('display', 'block').html('<div class="small" style="color:#d9b36c">' + esc(C.fmtWhen(d.e, { short: true })) + '</div><strong>' + esc(d.e.title) + '</strong><br>' + C.badge(d.e.status)); })
    .on('mousemove', ev => { const r = document.getElementById('tl-chart').getBoundingClientRect(); let x = ev.clientX - r.left + 14; if (x > r.width - 330) x -= 350; tip.style('left', x + 'px').style('top', (ev.clientY - r.top + 12) + 'px'); })
    .on('mouseleave', () => tip.style('display', 'none'));
  const uniq = new Set(vis.map(d => d.e.id)).size;
  document.getElementById('tl-count').textContent = 'Showing ' + uniq + ' of ' + DATA.events.length + ' events.';
}
function wrapSub(t, text, y){
  const words = text.split(' '); let line = [], lines = []; words.forEach(w => { line.push(w); if (line.join(' ').length > 24){ line.pop(); lines.push(line.join(' ')); line = [w]; } }); lines.push(line.join(' '));
  t.text(null); lines.slice(0, 3).forEach((l, i) => t.append('tspan').attr('x', 14).attr('y', y + i * 13).text(l));
}
function drawList(){
  const box = document.getElementById('tl-list'); if (box.hidden) return;
  const evs = DATA.events.filter(e => matches(e) && (e.pov.length ? e.pov : ['other']).some(l => F.lanes.has(l)));
  box.innerHTML = evs.map(e => '<div class="row" data-ev="' + e.id + '"><div class="t">' + esc(C.fmtWhen(e, { short: true })) + '</div><div><strong>' + esc(e.title) + '</strong><div class="small">' + esc(e.description.length > 220 ? e.description.slice(0, 217) + '…' : e.description) + '</div></div><div>' + C.badge(e.status) + '</div></div>').join('') || '<p class="small">No events match the current filters.</p>';
}
let pendingZoom = null;
C.on('view', ({ view, params }) => {
  if (view !== 'timeline') return;
  init();
  requestAnimationFrame(() => { W = document.getElementById('tl-chart').clientWidth || W; x0.range([M.left, W - M.right]); zoomTo(params.get('zoom') || pendingZoom || 'all', false); pendingZoom = null; if (params.get('event')) C.openEvent(params.get('event')); });
});
C.on('params', ({ view, params }) => { if (view === 'timeline' && inited){ if (params.get('zoom')) zoomTo(params.get('zoom'), true); if (params.get('event')) C.openEvent(params.get('event')); } });
})();
