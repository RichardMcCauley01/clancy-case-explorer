/* Scene Reconstruction: approximate, stylized low-poly model + scroll-driven first-person path.
   NOTE: approximate layout based on testimony and reporting, not official floor plans. */
(function(){
'use strict';
const C = window.CASE, DATA = C.DATA, esc = C.esc;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const EYE = 1.6;

/* ---------- Places: camera position, look target, ring marker ---------- */
const SIGN_Z = 25, ROAD_Z = 19.5;
function sign(x){ return { cam: V(x, 1.7, 16.5), look: V(x, 2.6, SIGN_Z), ring: V(x, 0.09, SIGN_Z - 1.6), node: 'R' + x, zone: 'far' }; }
const PLACES = {
  'overview':        { cam: V(34, 34, 62), look: V(0, 0, 8), ring: null, zone: 'air' },
  'house':           { cam: V(17, 7.5, 24), look: V(0, 1.8, 0), ring: V(1, 0.03, 7), zone: 'air' },
  'basement-den':    { cam: V(-0.6, -3 + EYE, 2.4), look: V(-4.6, -2.5, -0.6), ring: V(-4.4, -2.97, -0.4), node: 'B_HUB', zone: 'in' },
  'basement-office': { cam: V(1.6, -3 + EYE, -1.2), look: V(5.4, -2.3, 3.4), ring: V(5.4, -2.97, 3.4), node: 'B_HUB', zone: 'in' },
  'kitchen':         { cam: V(-1.2, EYE, -0.6), look: V(-5, 0.9, -3.8), ring: V(-4.6, 0.03, -3.2), node: 'M_HUB', zone: 'in' },
  'living':          { cam: V(-1.4, EYE, 4.4), look: V(-5.4, 0.9, 1.8), ring: V(-4.6, 0.03, 2.8), node: 'M_HUB', zone: 'in' },
  'mainhub':         { cam: V(4.6, EYE, 3.6), look: V(-2, 1.2, -1), ring: V(0.5, 0.03, 1.5), node: 'M_HUB', zone: 'in' },
  'stairs-main':     { cam: V(3.9, EYE, 3.2), look: V(1, 2.2, -1.6), ring: V(1, 0.03, 1.8), node: 'M_HUB', zone: 'in' },
  'entry':           { cam: V(1, 1.7, 10.5), look: V(1, 1.5, 5.6), ring: V(1, 0.03, 7), node: 'FRONT_OUT', zone: 'out' },
  'bedroom':         { cam: V(2.4, 3.2 + EYE, -0.8), look: V(5.6, 3.9, -4.4), ring: V(5, 3.23, -3.2), node: 'U_HUB', zone: 'in' },
  'bedroom-window':  { cam: V(4.2, 3.2 + EYE, -2.6), look: V(5, 4.2, -6.4), ring: V(5, 3.23, -5.4), node: 'U_HUB', zone: 'in' },
  'backyard':        { cam: V(6.2, 1.8, -16), look: V(5, 2.4, -6.5), ring: V(5, 0.03, -7.6), node: 'YARD', zone: 'out' },
  'road':            { cam: V(22, 1.7, ROAD_Z), look: V(40, 1.7, ROAD_Z + 2), ring: V(22, 0.03, ROAD_Z), node: 'R22', zone: 'far' },
  'cvs': sign(40), 'threev': sign(66), 'offsite': sign(-24), 'hospital': sign(-46), 'court': sign(-70),
};
const SIGNS = [
  { x: 40, text: 'CVS, Kingston', sub: 'errand stop · not to scale' },
  { x: 66, text: 'ThreeV Restaurant, Plymouth', sub: 'takeout pickup · not to scale' },
  { x: -24, text: 'Elsewhere / media', sub: 'off-site · not to scale' },
  { x: -46, text: 'Hospitals & treatment', sub: 'various facilities · not to scale' },
  { x: -70, text: 'Plymouth County courts', sub: 'District & Superior Court · not to scale' },
];

/* ---------- Walkable routing graph (doors, stairs, driveway, road) ---------- */
const NODES = {
  B_HUB: V(0.6, -3 + EYE, 0.4), B_STAIR_BOT: V(2.7, -3 + EYE, -3.0), B_STAIR_TOP: V(2.7, EYE, 1.9),
  M_HUB: V(0.4, EYE, 2.8), U_STAIR_TOP: V(1, 3.2 + EYE, -3.1), U_HUB: V(2.8, 3.2 + EYE, -1.8),
  FRONT_IN: V(1, EYE, 4.9), FRONT_OUT: V(1, 1.7, 8.2), BACK_IN: V(-4, EYE, -4.9), BACK_OUT: V(-4, 1.7, -8.2),
  YARD: V(4.5, 1.7, -12), SIDE_E: V(11, 1.7, -5), DRIVE: V(11, 1.7, 9), R_HOME: V(11, 1.7, ROAD_Z),
};
const EDGES = [['B_HUB','B_STAIR_BOT'],['B_STAIR_BOT','B_STAIR_TOP'],['B_STAIR_TOP','M_HUB'],['M_HUB','U_STAIR_TOP'],['U_STAIR_TOP','U_HUB'],
  ['M_HUB','FRONT_IN'],['FRONT_IN','FRONT_OUT'],['M_HUB','BACK_IN'],['BACK_IN','BACK_OUT'],['BACK_OUT','YARD'],['YARD','SIDE_E'],['SIDE_E','DRIVE'],['FRONT_OUT','DRIVE'],['DRIVE','R_HOME']];
Object.values(PLACES).forEach(p => { if (p.node && p.node[0] === 'R' && !NODES[p.node]) NODES[p.node] = V(+p.node.slice(1), 1.7, ROAD_Z); });
const ADJ = {}; Object.keys(NODES).forEach(k => ADJ[k] = []);
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });
const roadNodes = Object.keys(NODES).filter(k => /^R/.test(k));
roadNodes.forEach(a => roadNodes.forEach(b => { if (a !== b) ADJ[a].push(b); }));
function shortest(a, b){
  const dist = {}, prev = {}, Q = new Set(Object.keys(NODES));
  Object.keys(NODES).forEach(k => dist[k] = Infinity); dist[a] = 0;
  while (Q.size){
    let u = null; Q.forEach(k => { if (u === null || dist[k] < dist[u]) u = k; });
    Q.delete(u); if (u === b) break;
    ADJ[u].forEach(v => { const d = dist[u] + NODES[u].distanceTo(NODES[v]); if (d < dist[v]){ dist[v] = d; prev[v] = u; } });
  }
  const path = []; let u = b; while (u){ path.unshift(u); u = prev[u]; } return path;
}
function placeFor(e){
  if (/not established|^Phone$|^—$/.test(e.location) && ['kitchen','living'].includes(e.scene)) return 'mainhub';
  return PLACES[e.scene] ? e.scene : 'house';
}
/* Build ONE continuous spline for a POV: event camera points + doorway/stair/driveway/road waypoints between them.
   Consecutive events at the same place get a slight orbit around the look target so the camera keeps gliding. */
function buildPath(places){
  const cams = [], looks = [];
  let run = 0;
  places.forEach((pl, i) => {
    const P = PLACES[pl];
    run = (i > 0 && places[i - 1] === pl) ? run + 1 : 0;
    let cam = P.cam.clone();
    if (run > 0){
      const off = cam.clone().sub(P.look);
      off.applyAxisAngle(V(0, 1, 0), run * 7 * Math.PI / 180).multiplyScalar(Math.max(0.78, 1 - 0.05 * run));
      cam = P.look.clone().add(off); cam.y = P.cam.y;
    }
    cams.push(cam); looks.push(P.look.clone());
  });
  const pts = [], eventIdx = [];
  for (let i = 0; i < places.length; i++){
    eventIdx.push(pts.length); pts.push(cams[i]);
    if (i === places.length - 1) break;
    const A = PLACES[places[i]], B = PLACES[places[i + 1]];
    let mids = [];
    if (places[i] === places[i + 1]) mids = [];
    else if (A.zone === 'air' || B.zone === 'air'){
      const m = cams[i].clone().lerp(cams[i + 1], 0.5); m.y = Math.max(cams[i].y, cams[i + 1].y) + cams[i].distanceTo(cams[i + 1]) * 0.12 + 2; mids = [m];
    } else mids = shortest(A.node, B.node).map(k => NODES[k].clone());
    mids.forEach(m => { if (m.distanceTo(pts[pts.length - 1]) > 0.9 && m.distanceTo(cams[i + 1]) > 0.9) pts.push(m); });
  }
  if (pts.length === 1) pts.push(pts[0].clone().add(V(0.01, 0, 0)));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const D = Math.max(3000, pts.length * 60);
  curve.arcLengthDivisions = D;
  const lengths = curve.getLengths(D), L = lengths[D];
  // arc length (meters) at each event point: CatmullRom passes control point k at t = k/(n-1)
  const eventS = eventIdx.map(k => { const f = k / (pts.length - 1) * D, i0 = Math.floor(f), i1 = Math.min(D, i0 + 1); return lengths[i0] + (lengths[i1] - lengths[i0]) * (f - i0); });
  return { curve, cams, looks, eventS, L };
}

/* ---------- Model ---------- */
let renderer, scene, camera, ring, beam, windowGlow, childMarkers = [], childGroup, labelSprites = [];
const COL = { floor: 0x2b3038, wall: 0x9fb2c6, edge: 0x6f7f92, edgeHi: 0xa9b8c9, ground: 0x1d2420, drive: 0x353a41, road: 0x2a2d32, roof: 0x5b4d42, accent: 0xd9b36c };
function mat(color, opacity, extra){ return new THREE.MeshLambertMaterial(Object.assign({ color, transparent: opacity < 1, opacity, depthWrite: opacity >= 0.9, side: THREE.DoubleSide }, extra || {})); }
const edgeMat = new THREE.LineBasicMaterial({ color: COL.edge, transparent: true, opacity: 0.55 });
const edgeMatHi = new THREE.LineBasicMaterial({ color: COL.edgeHi, transparent: true, opacity: 0.8 });
function addBox(parent, x0, x1, y0, y1, z0, z1, material, edges){
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  const m = new THREE.Mesh(g, material); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); parent.add(m);
  if (edges){ const l = new THREE.LineSegments(new THREE.EdgesGeometry(g), edges === true ? edgeMat : edges); l.position.copy(m.position); parent.add(l); }
  return m;
}
function slab(parent, y, hole, material){
  const [hx0, hx1, hz0, hz1] = hole, t = 0.14;
  addBox(parent, -8, hx0, y - t, y, -6, 6, material);
  addBox(parent, hx1, 8, y - t, y, -6, 6, material);
  addBox(parent, hx0, hx1, y - t, y, hz1, 6, material);
  addBox(parent, hx0, hx1, y - t, y, -6, hz0, material);
}
function textCanvas(text, sub, opts){
  opts = opts || {};
  const c = document.createElement('canvas'), ctx = c.getContext('2d'), f = opts.big ? 44 : 34;
  ctx.font = '600 ' + f + 'px Segoe UI, Arial, sans-serif';
  const w1 = ctx.measureText(text).width; ctx.font = '400 ' + Math.round(f * 0.62) + 'px Segoe UI, Arial, sans-serif';
  const w2 = sub ? ctx.measureText(sub).width : 0;
  c.width = Math.ceil(Math.max(w1, w2) + 44); c.height = sub ? Math.round(f * 2.3) : Math.round(f * 1.55);
  ctx.fillStyle = opts.bg || 'rgba(14,18,24,0.82)'; ctx.strokeStyle = opts.stroke || 'rgba(217,179,108,0.55)'; ctx.lineWidth = 3;
  const r = 12; ctx.beginPath(); ctx.moveTo(r, 2); ctx.lineTo(c.width - r, 2); ctx.quadraticCurveTo(c.width - 2, 2, c.width - 2, r); ctx.lineTo(c.width - 2, c.height - r); ctx.quadraticCurveTo(c.width - 2, c.height - 2, c.width - r, c.height - 2); ctx.lineTo(r, c.height - 2); ctx.quadraticCurveTo(2, c.height - 2, 2, c.height - r); ctx.lineTo(2, r); ctx.quadraticCurveTo(2, 2, r, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = opts.color || '#e6e9ee'; ctx.textBaseline = 'middle'; ctx.font = '600 ' + f + 'px Segoe UI, Arial, sans-serif';
  ctx.fillText(text, 22, sub ? f * 0.85 : c.height / 2);
  if (sub){ ctx.fillStyle = '#9aa6b4'; ctx.font = '400 ' + Math.round(f * 0.62) + 'px Segoe UI, Arial, sans-serif'; ctx.fillText(sub, 22, f * 1.72); }
  return c;
}
function label(text, sub, pos, scale, opts){
  const c = textCanvas(text, sub, opts), tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const k = (scale || 1) * 0.0105; s.scale.set(c.width * k, c.height * k, 1); s.position.copy(pos); s.renderOrder = 10;
  scene.add(s); labelSprites.push(s); return s;
}
function glowTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 128; const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,244,214,1)'); g.addColorStop(0.25, 'rgba(255,231,168,0.55)'); g.addColorStop(1, 'rgba(255,231,168,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
function buildModel(){
  const house = new THREE.Group(); scene.add(house);
  const floorM = mat(COL.floor, 0.9), wallM = mat(COL.wall, 0.06), extM = mat(0xb9c6d3, 0.08), roofM = mat(COL.roof, 0.28);
  // Basement (y -3..0)
  addBox(house, -8, 8, -3.14, -3, -6, 6, mat(0x262a30, 1));
  addBox(house, -8, 8, -3, 0, -6, 6, mat(0x8d98a6, 0.05), edgeMatHi);
  addBox(house, -7.9, 1.9, -3, -0.2, -5.9, 5.9, wallM, true);          // open basement area
  addBox(house, 3.4, 7.9, -3, -0.2, 0.2, 5.9, wallM, true);            // office
  // Main floor (y 0..3.2)
  slab(house, 0, [2.2, 3.2, -3.2, 2.0], floorM);
  addBox(house, -8, 8, 0, 6.2, -6, 6, extM, edgeMatHi);                 // exterior shell (2 floors)
  addBox(house, -7.9, -1, 0, 3.0, -5.9, 0, wallM, true);               // kitchen
  addBox(house, -7.9, -1, 0, 3.0, 0, 5.9, wallM, true);                // living
  addBox(house, 3.4, 7.9, 0, 3.0, -5.9, 5.9, wallM, true);             // east main floor
  // Second floor (y 3.2..6.2)
  slab(house, 3.2, [0.0, 2.0, -3.2, 2.0], floorM);
  addBox(house, 2.2, 7.9, 3.2, 6.0, -5.9, -0.2, wallM, true);          // primary bedroom
  addBox(house, -7.9, -0.2, 3.2, 6.0, -5.9, 5.9, wallM, true);         // other upstairs rooms
  // Roof (gable)
  const sh = new THREE.Shape(); sh.moveTo(-6.5, 0); sh.lineTo(6.5, 0); sh.lineTo(0, 2.7); sh.closePath();
  const rg = new THREE.ExtrudeGeometry(sh, { depth: 16.6, bevelEnabled: false }); rg.rotateY(Math.PI / 2); rg.translate(-8.3, 6.2, 0);
  house.add(new THREE.Mesh(rg, roofM)); house.add(new THREE.LineSegments(new THREE.EdgesGeometry(rg), edgeMat));
  // Stairs
  const stepM = mat(0x4a525d, 1);
  for (let i = 0; i < 12; i++){ const y = (i + 1) * 3.2 / 12, z = 1.8 - i * 0.42; addBox(house, 0.2, 1.8, y - 0.12, y, z - 0.42, z, stepM); }
  for (let i = 0; i < 11; i++){ const y = -3 + (i + 1) * 3 / 11, z = -3 + i * 0.44; addBox(house, 2.3, 3.1, y - 0.12, y, z, z + 0.44, stepM); }
  // Doors and windows (frames)
  const doorM = mat(0x5d4a3a, 0.85);
  addBox(house, 0.45, 1.55, 0, 2.1, 5.98, 6.04, doorM, true);
  addBox(house, -4.55, -3.45, 0, 2.1, -6.04, -5.98, doorM, true);
  const winM = mat(0x8fb3d9, 0.18);
  [[-5.5, 1], [-2.5, 1], [5.5, 1], [-5.5, 4.2], [-2.5, 4.2], [5.5, 4.2]].forEach(([x, y]) => addBox(house, x - 0.6, x + 0.6, y, y + 1.2, 6.0, 6.04, winM, true));
  addBox(house, 4.3, 5.7, 4.0, 5.4, -6.04, -6.0, winM, edgeMatHi);    // rear bedroom window
  windowGlow = addBox(house, 4.25, 5.75, 3.95, 5.45, -6.12, -6.06, new THREE.MeshBasicMaterial({ color: COL.accent, transparent: true, opacity: 0.0, depthWrite: false }));
  // Ground with the house footprint cut out, driveway, road, walkway
  const gs = new THREE.Shape(); gs.moveTo(-140, -140); gs.lineTo(140, -140); gs.lineTo(140, 60); gs.lineTo(-140, 60); gs.closePath();
  const hole = new THREE.Path(); hole.moveTo(-8, -6); hole.lineTo(-8, 6); hole.lineTo(8, 6); hole.lineTo(8, -6); hole.closePath(); gs.holes.push(hole);
  const gg = new THREE.ShapeGeometry(gs); gg.rotateX(-Math.PI / 2);   // shape y -> world -z, normal up
  const ground = new THREE.Mesh(gg, new THREE.MeshLambertMaterial({ color: COL.ground, side: THREE.FrontSide })); ground.position.y = -0.02; scene.add(ground);
  const flat = (x0, x1, z0, z1, y, color) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshLambertMaterial({ color })); m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); scene.add(m); return m; };
  flat(9, 13, 1, 18, 0.01, COL.drive); flat(0.4, 1.6, 6, 9.2, 0.012, COL.drive); flat(1.6, 9, 8.4, 9.6, 0.012, COL.drive);
  flat(-95, 95, 18, 21, 0.014, COL.road);
  for (let x = -94; x < 95; x += 4) flat(x, x + 2, 19.42, 19.58, 0.02, 0x5b5f66);
  // Low-poly trees (deterministic)
  const treeM = new THREE.MeshLambertMaterial({ color: 0x24332a, flatShading: true }), trunkM = new THREE.MeshLambertMaterial({ color: 0x3a2f28 });
  [[-14, -10], [-18, 2], [-13, 12], [16, -12], [19, 3], [-6, -16], [10, -17], [-22, -8], [24, -6], [-28, 10], [28, 10]].forEach(([x, z], i) => {
    const h = 5 + (i % 3); const t = new THREE.Mesh(new THREE.ConeGeometry(1.6 + (i % 2) * 0.4, h, 6), treeM); t.position.set(x, h / 2 + 1, z); scene.add(t);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.2, 5), trunkM); tr.position.set(x, 0.6, z); scene.add(tr);
  });
  // Off-site signposts (not to scale)
  const postM = new THREE.MeshLambertMaterial({ color: 0x59636f });
  SIGNS.forEach(s => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.2, 0.18), postM); p.position.set(s.x, 1.1, SIGN_Z); scene.add(p);
    const c = textCanvas(s.text, s.sub, { big: true }), tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
    const w = c.width * 0.012, h = c.height * 0.012;
    const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
    b.position.set(s.x, 2.3 + h / 2, SIGN_Z); b.rotation.y = Math.PI; scene.add(b);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.04, 24), new THREE.MeshLambertMaterial({ color: 0x2c333b })); pad.position.set(s.x, 0.02, SIGN_Z - 1.6); scene.add(pad);
  });
  // Room labels (approximate)
  label('Basement', 'where the children were found', V(-4.5, -1.1, -0.5), 0.8);
  label("Patrick's home office", 'basement (per testimony)', V(5.6, -1.1, 3.2), 0.8);
  label('Kitchen', 'approximate', V(-4.5, 2.2, -3), 0.8);
  label('Living room', 'approximate', V(-4.5, 2.2, 3), 0.8);
  label('Front entry', null, V(1, 2.5, 5.2), 0.7);
  label('Stairs', null, V(1, 2.6, -0.5), 0.7);
  label('Primary bedroom', 'second floor', V(5, 5.4, -2.6), 0.8);
  label('Rear window', 'second floor', V(5, 5.9, -6.3), 0.7);
  label('Backyard', null, V(5, 1.6, -9.5), 0.8);
  label('Driveway', null, V(11, 1.4, 12), 0.8);
  label('Summer Street, Duxbury', 'road · errand route', V(18, 1.3, 21.4), 0.8);
  label('Approximate layout, not official floor plans', null, V(0, 9.6, 0), 1.0, { color: '#d9b36c' });
  // Children: three abstract soft light markers only (positions approximate)
  childGroup = new THREE.Group(); scene.add(childGroup);
  const gt = glowTexture();
  [V(-5.0, -2.55, -1.2), V(-3.9, -2.55, 0.2), V(5.9, -2.55, 4.2)].forEach((p, i) => {
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff4d6 }));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(1.3, 1.3, 1); const g = new THREE.Group(); g.add(core); g.add(glow); g.position.copy(p); g.userData.phase = i * 2.1;
    childGroup.add(g); childMarkers.push(g);
  });
  // Current-location ring + soft beam
  ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.78, 48), new THREE.MeshBasicMaterial({ color: COL.accent, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.renderOrder = 5; scene.add(ring);
  beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.5, 3.2, 20, 1, true), new THREE.MeshBasicMaterial({ color: COL.accent, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }));
  scene.add(beam);
}

/* ---------- Path, state, UI ----------
   Motion model (smooth, Lenis-style):
   - Scroll input moves a TARGET position q (in "scroll pixels"); the displayed position eases toward it every frame
     with frame-rate-independent exponential damping, so the camera glides and coasts to a stop (no snapping).
   - q maps piecewise-linearly onto the event stops; each leg's scroll length grows with its path length
     (about 3 wheel ticks for short moves, up to 10 for long drives). Within a leg an ease slows the camera slightly
     near each event point so it lingers where there is something to read. The derivative stays continuous.
   - Position = one continuous centripetal Catmull-Rom spline through all event points plus door/stair/road waypoints
     (arc-length parameterized). Look direction = quaternion slerp between the event views, blended toward
     the direction of travel mid-leg, then damped again. */
const S = { pov: null, steps: [], places: [], path: null, legQ: [], eventQ: [], Q: 0, q: 0, qt: 0, nav: null, lastInput: 0, settled: true,
  activeIdx: -1, yaw: 0, pitch: 0, active: false, gl: false, inited: false, childAlpha: 0, frameMs: 0 };
const $ = id => document.getElementById(id);
const smooth = t => t * t * (3 - 2 * t);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const TICK = 100;                         // one mouse-wheel notch is ~100 px of deltaY
const LINGER = 0.55;                      // 0 = constant speed; higher = slower near events
const POV_NAME = { lindsay: "Lindsay's account (her statements / defense framing)", patrick: "Patrick's account (his testimony)", evidence: 'Evidence only (documented facts)' };
const UP = V(0, 1, 0), _m = new THREE.Matrix4(), _pos = V(0, 0, 0), _tan = V(0, 0, 0), _tgt = V(0, 0, 0);
const _qA = new THREE.Quaternion(), _qB = new THREE.Quaternion(), _qT = new THREE.Quaternion(), _qGoal = new THREE.Quaternion(), _qYaw = new THREE.Quaternion(), _qPitch = new THREE.Quaternion();
const X_AXIS = V(1, 0, 0);
function lookQuat(out, eye, target){ _m.lookAt(eye, target, UP); return out.setFromRotationMatrix(_m); }

function setPov(pov, stepRef){
  if (!DATA.scenePaths[pov]) pov = 'lindsay';
  S.pov = pov;
  S.steps = DATA.scenePaths[pov].map(id => C.byId[id]);
  S.places = S.steps.map(placeFor);
  S.path = buildPath(S.places);
  S.eventQuat = S.path.cams.map((c, i) => lookQuat(new THREE.Quaternion(), c, S.path.looks[i]));
  // scroll length of each leg, proportional to path length (clamped)
  S.eventQ = [0]; S.legQ = [];
  for (let i = 0; i < S.steps.length - 1; i++){
    const len = S.path.eventS[i + 1] - S.path.eventS[i];
    const ticks = clamp(2.6 + len / 6, 3, 10);
    S.legQ.push(ticks * TICK); S.eventQ.push(S.eventQ[i] + ticks * TICK);
  }
  S.Q = S.eventQ[S.eventQ.length - 1];
  let idx = 0;
  if (stepRef != null){ const k = S.steps.findIndex(e => e.id === stepRef); idx = k >= 0 ? k : clamp((parseInt(stepRef, 10) || 1) - 1, 0, S.steps.length - 1); }
  S.q = S.qt = S.eventQ[idx]; S.nav = null; S.activeIdx = -1; S.yaw = S.pitch = 0; S.settled = true;
  document.querySelectorAll('.pov-switch button').forEach(b => { const on = b.dataset.pov === pov; b.classList.toggle('active', on); b.setAttribute('aria-checked', on); });
  $('sc-ticks').innerHTML = S.steps.map((e, i) => '<span data-i="' + i + '" style="left:' + (S.Q ? S.eventQ[i] / S.Q * 100 : 0) + '%" title="' + (i + 1) + '. ' + esc(e.title) + '"></span>').join('');
  if (S.gl) lookQuat(camera.quaternion, S.path.cams[idx], S.path.looks[idx]);
  frame(0, true, true);
}
/* Smooth programmatic navigation (arrow keys, ticks, progress bar): tween the target with ease-in-out. */
function navTo(q){
  q = clamp(q, 0, S.Q);
  const dist = Math.abs(q - S.q);
  S.nav = { from: S.q, to: q, t0: performance.now(), dur: clamp(450 + dist * 0.9, 600, 2600) };
}
function go(i){ i = clamp(i, 0, S.steps.length - 1); navTo(S.eventQ[i]); }
function currentStepFloat(){ // index of the event at/just before the target (for prev/next)
  const q = S.nav ? S.nav.to : S.qt; let i = 0; while (i < S.eventQ.length - 1 && S.eventQ[i + 1] <= q + 1) i++; return { i, exact: Math.abs(S.eventQ[i] - q) < 2 };
}
function nextStep(){ const c = currentStepFloat(); go(c.i + 1); }
function prevStep(){ const c = currentStepFloat(); go(c.exact ? c.i - 1 : c.i); }

function panelHTML(i){
  const e = S.steps[i], N = S.steps.length, place = S.places[i];
  let where = esc(e.location);
  if (place === 'mainhub') where += ' <span class="small">(room not established; camera placed at the main-floor center)</span>';
  if (PLACES[place].zone === 'far') where += ' <span class="small">(off-site; signpost not to scale)</span>';
  let h = '<div class="step">Step ' + (i + 1) + ' of ' + N + ' · ' + esc(POV_NAME[S.pov]) + '</div>';
  h += '<div class="when">' + esc(C.fmtWhen(e)) + '</div>';
  h += '<h3>' + esc(e.title) + '</h3><div>' + C.badge(e.status) + '</div>';
  h += '<div class="where">📍 ' + where + '</div>';
  h += '<p>' + esc(e.description) + '</p>';
  if (e.timeNote) h += '<div class="note"><strong>Timing:</strong> ' + esc(e.timeNote) + '</div>';
  if (e.note) h += '<div class="note">' + esc(e.note) + '</div>';
  h += '<div class="small" style="margin-top:8px"><strong>Sources</strong></div>' + C.sourcesHTML(e);
  if (e.related && e.related.length){
    h += '<div class="rel"><strong>Other perspectives on this point:</strong><br>' + e.related.filter(r => C.byId[r]).map(r => '<a data-ev="' + r + '">' + esc(C.byId[r].title) + '</a> ' + C.badge(C.byId[r].status)).join('<br>') + '</div>';
  }
  h += '<div class="rel"><a data-ev="' + e.id + '">Open full details →</a></div>';
  return h;
}

function setPanel(idx){
  const el = $('scene-panel');
  if (S.panelTimer) clearTimeout(S.panelTimer);
  el.classList.add('fading');
  S.panelTimer = setTimeout(() => { el.innerHTML = panelHTML(idx); el.scrollTop = 0; el.classList.remove('fading'); }, 160);
}
function legAt(q){ let i = 0; while (i < S.legQ.length - 1 && q >= S.eventQ[i + 1]) i++; return i; }

function frame(dt, force, immediate){
  const N = S.steps.length; if (!N) return;
  const t0 = performance.now();
  // 1) target: programmatic tween or free scroll (with gentle settle when idle and very close to an event)
  if (S.nav){
    const k = clamp((t0 - S.nav.t0) / S.nav.dur, 0, 1);
    S.qt = S.nav.from + (S.nav.to - S.nav.from) * easeInOut(k);
    if (k >= 1) S.nav = null;
  } else if (!S.settled && t0 - S.lastInput > 260){
    S.settled = true;
    let best = 0; S.eventQ.forEach((eq, i) => { if (Math.abs(eq - S.qt) < Math.abs(S.eventQ[best] - S.qt)) best = i; });
    if (Math.abs(S.eventQ[best] - S.qt) < 0.14 * TICK * 3) S.nav = { from: S.qt, to: S.eventQ[best], t0, dur: 700 };
  }
  // 2) displayed progress eases toward target (frame-rate independent exponential damping)
  if (immediate) S.q = S.qt;
  else S.q += (S.qt - S.q) * (1 - Math.exp(-dt * (S.nav ? 14 : 7)));
  if (Math.abs(S.qt - S.q) < 0.02) S.q = S.qt;
  // 3) leg + eased local parameter
  const i = N > 1 ? legAt(S.q) : 0;
  const lt = N > 1 ? clamp((S.q - S.eventQ[i]) / S.legQ[i], 0, 1) : 0;
  const f = lt - LINGER * Math.sin(2 * Math.PI * lt) / (2 * Math.PI);
  const active = N > 1 ? (lt < 0.5 ? i : i + 1) : 0;
  if (active !== S.activeIdx || force){
    const first = S.activeIdx === -1; S.activeIdx = active;
    if (first || immediate){ $('scene-panel').innerHTML = panelHTML(active); } else setPanel(active);
    $('sc-ticks').querySelectorAll('span').forEach((s, k) => { s.classList.toggle('on', k < active); s.classList.toggle('cur', k === active); });
  }
  const e = S.steps[active];
  const moving = N > 1 && lt > 0.06 && lt < 0.94;
  $('sc-time').textContent = 'Step ' + (active + 1) + '/' + N + '  ·  ' + C.fmtWhen(e, { short: true }) + (e.precision === 'approximate' ? ' (approx.)' : '') +
    (moving ? '   ⟶  ' + (lt < 0.5 ? 'next: step ' + (i + 2) : 'arriving') : '');
  $('sc-prog').style.width = (S.Q ? S.q / S.Q * 100 : 100) + '%';
  if (!S.gl) return;
  // 4) camera position on the spline (arc-length)
  const P = S.path, s = N > 1 ? P.eventS[i] + (P.eventS[i + 1] - P.eventS[i]) * f : 0, u = P.L > 0 ? clamp(s / P.L, 0, 1) : 0;
  P.curve.getPointAt(u, _pos);
  // 5) look direction: slerp between event views, blended toward travel direction mid-leg
  if (N > 1){
    _qA.copy(S.eventQuat[i]); _qB.copy(S.eventQuat[i + 1]);
    _qGoal.copy(_qA).slerp(_qB, smooth(lt));
    const legLen = P.eventS[i + 1] - P.eventS[i];
    P.curve.getTangentAt(u, _tan); _tan.y *= 0.35;
    if (_tan.lengthSq() > 1e-4 && legLen > 1.5){
      _tan.normalize(); _tgt.copy(_pos).add(_tan);
      lookQuat(_qT, _pos, _tgt);
      const w = smooth(clamp((lt - 0.08) / 0.27, 0, 1)) * smooth(clamp((0.92 - lt) / 0.27, 0, 1)) * clamp(legLen / 6, 0, 1) * 0.5;
      _qGoal.slerp(_qT, w);
    }
  } else _qGoal.copy(S.eventQuat[0]);
  // drag-to-look offsets (world yaw, local pitch); they relax back while the camera travels
  if (Math.abs(S.qt - S.q) > 1){ const r = Math.exp(-dt * 1.5); S.yaw *= r; S.pitch *= r; }
  _qYaw.setFromAxisAngle(UP, S.yaw); _qPitch.setFromAxisAngle(X_AXIS, S.pitch);
  _qGoal.premultiply(_qYaw).multiply(_qPitch);
  camera.position.copy(_pos);
  if (immediate) camera.quaternion.copy(_qGoal); else camera.quaternion.slerp(_qGoal, 1 - Math.exp(-dt * 9));
  // 6) markers: ring/beam fade with proximity to the active event; children markers fade in/out
  const now = t0 / 1000, AP = PLACES[S.places[active]];
  const prox = N > 1 ? 1 - clamp(Math.abs((lt < 0.5 ? lt : 1 - lt)) * 2, 0, 1) : 1;
  if (AP.ring){ ring.visible = beam.visible = true; ring.position.copy(AP.ring); beam.position.set(AP.ring.x, AP.ring.y + 1.6, AP.ring.z);
    const k = 1 + Math.sin(now * 2.4) * 0.08; ring.scale.set(k, k, k); ring.material.opacity = 0.1 + 0.8 * prox; beam.material.opacity = 0.02 + 0.1 * prox; }
  else ring.visible = beam.visible = false;
  windowGlow.material.opacity = (S.places[active] === 'bedroom-window' || e.id === 'd-jump') ? (0.35 + Math.sin(now * 2) * 0.12) * prox : 0;
  const want = e.datetime >= '2023-01-24T17:17' ? 1 : 0;
  S.childAlpha = immediate ? want : S.childAlpha + (want - S.childAlpha) * (1 - Math.exp(-dt * 3));
  childGroup.visible = S.childAlpha > 0.01;
  childMarkers.forEach(g => { const sc = 1 + Math.sin(now * 1.3 + g.userData.phase) * 0.12; g.children[1].scale.set(1.3 * sc, 1.3 * sc, 1); g.children[0].material.opacity = S.childAlpha; g.children[1].material.opacity = S.childAlpha; });
  S.frameMs = performance.now() - t0;          // JS update cost (excludes GPU render)
  renderer.render(scene, camera);
}

let lastT = 0;
function loop(t){
  if (!S.active){ lastT = 0; return; }
  const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 1 / 60; lastT = t;
  S.fps = S.fps ? S.fps * 0.95 + (1 / Math.max(dt, 1e-3)) * 0.05 : 60;
  frame(dt); requestAnimationFrame(loop);
}
function start(){ if (S.active) return; S.active = true; requestAnimationFrame(loop); }
function stop(){ S.active = false; }

function init(){
  if (S.inited) return; S.inited = true;
  const host = $('scene-canvas');
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    S.gl = true;
  } catch (err){ S.gl = false; $('scene-fallback').hidden = false; }
  if (S.gl){
    // phones / touch devices: lower pixel ratio (fill-rate is the main GPU cost there)
    const lowPower = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    S.pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 2);
    renderer.setPixelRatio(S.pixelRatio);
    host.appendChild(renderer.domElement);
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0b0e12); scene.fog = new THREE.Fog(0x0b0e12, 45, 170);
    camera = new THREE.PerspectiveCamera(62, 1, 0.05, 600);
    scene.add(new THREE.HemisphereLight(0xc4d0de, 0x1c2026, 0.95));
    const dl = new THREE.DirectionalLight(0xfff3e0, 0.55); dl.position.set(20, 30, 18); scene.add(dl);
    buildModel();
    childMarkers.forEach(g => { g.children[0].material.transparent = true; });
    const resize = () => { const w = host.clientWidth || 800, h = host.clientHeight || 600; renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px'; camera.aspect = w / h; camera.updateProjectionMatrix(); if (S.steps.length) frame(0, false, false); };
    if (window.ResizeObserver) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);
    resize();
    // Mouse / pen: drag to look around (does not move along the path).
    // Touch: a mostly-vertical swipe moves along the sequence like scrolling (swipe up = forward), feeding the same
    // target q as the mouse wheel, so the same damping and settle-to-event easing apply; release keeps a little
    // momentum. A mostly-horizontal one-finger drag looks around (yaw).
    let drag = null;
    const TOUCH_K = 2.2;                          // scroll-pixels of q per finger pixel (a ~250px swipe is about one step)
    renderer.domElement.addEventListener('pointerdown', ev => {
      drag = { id: ev.pointerId, touch: ev.pointerType === 'touch', x: ev.clientX, y: ev.clientY, yaw: S.yaw, pitch: S.pitch, qt: S.qt, mode: ev.pointerType === 'touch' ? null : 'look', hist: [] };
      renderer.domElement.setPointerCapture(ev.pointerId);
    });
    renderer.domElement.addEventListener('pointermove', ev => {
      if (!drag || ev.pointerId !== drag.id) return;
      const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      if (!drag.mode){ if (Math.hypot(dx, dy) < 8) return; drag.mode = Math.abs(dy) > Math.abs(dx) ? 'move' : 'look'; drag.x = ev.clientX; drag.y = ev.clientY; drag.qt = S.qt; if (drag.mode === 'move' && S.nav){ S.qt = S.q; S.nav = null; drag.qt = S.qt; } return; }
      if (drag.mode === 'look'){ S.yaw = drag.yaw + dx * 0.004; if (!drag.touch) S.pitch = clamp(drag.pitch + dy * 0.003, -0.9, 0.9); return; }
      S.qt = clamp(drag.qt - dy * TOUCH_K, 0, S.Q);
      S.lastInput = performance.now(); S.settled = false;
      drag.hist.push({ t: performance.now(), y: ev.clientY }); if (drag.hist.length > 6) drag.hist.shift();
    });
    const end = ev => {
      if (drag && drag.mode === 'move' && drag.hist.length > 1){
        const a = drag.hist[0], b = drag.hist[drag.hist.length - 1], dt = b.t - a.t;
        if (dt > 0 && performance.now() - b.t < 90){ const v = (b.y - a.y) / dt;          // px per ms
          S.qt = clamp(S.qt - clamp(v * 260 * TOUCH_K, -1100, 1100), 0, S.Q); S.lastInput = performance.now(); S.settled = false; }
      }
      drag = null;
    };
    renderer.domElement.addEventListener('pointerup', end); renderer.domElement.addEventListener('pointercancel', end);
    renderer.domElement.addEventListener('dblclick', () => { S.yaw = S.pitch = 0; });
  }
  // Wheel / trackpad: continuous target progress (no snapping)
  $('scene-wrap').addEventListener('wheel', ev => {
    const panel = ev.target.closest('.scene-panel');
    if (panel){ // let the info panel scroll while it can, then hand off to the camera
      const canDown = panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1, canUp = panel.scrollTop > 0;
      if ((ev.deltaY > 0 && canDown) || (ev.deltaY < 0 && canUp)) return;
    }
    ev.preventDefault();
    let d = ev.deltaY * (ev.deltaMode === 1 ? 33 : ev.deltaMode === 2 ? 400 : 1);
    d = clamp(d, -160, 160);                     // tame huge single-event flicks
    if (S.nav){ S.qt = S.q; S.nav = null; }      // user input cancels a programmatic glide
    S.qt = clamp(S.qt + d, 0, S.Q);
    S.lastInput = performance.now(); S.settled = false;
  }, { passive: false });
  $('sc-prev').addEventListener('click', prevStep);
  $('sc-next').addEventListener('click', nextStep);
  $('sc-ticks').addEventListener('click', ev => { const s = ev.target.closest('span[data-i]'); if (s){ ev.stopPropagation(); go(+s.dataset.i); } });
  document.querySelector('.progress').addEventListener('click', ev => { const r = ev.currentTarget.getBoundingClientRect(); navTo((ev.clientX - r.left) / r.width * S.Q); });
  document.querySelectorAll('.pov-switch button').forEach(b => b.addEventListener('click', () => { history.replaceState(null, '', '#scene?pov=' + b.dataset.pov); setPov(b.dataset.pov); }));
  document.addEventListener('keydown', ev => {
    if (!S.active || /INPUT|TEXTAREA/.test(document.activeElement.tagName) || !document.getElementById('cw').hidden) return;
    if (['ArrowRight','ArrowDown','PageDown'].includes(ev.key)){ ev.preventDefault(); nextStep(); }
    if (['ArrowLeft','ArrowUp','PageUp'].includes(ev.key)){ ev.preventDefault(); prevStep(); }
    if (ev.key === 'Home'){ ev.preventDefault(); go(0); }
    if (ev.key === 'End'){ ev.preventDefault(); go(S.steps.length - 1); }
  });
}
function applyParams(params){
  const pov = params.get('pov') || S.pov || 'lindsay', step = params.get('step');
  if (pov !== S.pov || step) setPov(pov, step);
}
C.on('view', ({ view, params }) => { if (view === 'scene'){ init(); applyParams(params); start(); } else stop(); });
C.on('params', ({ view, params }) => { if (view === 'scene') applyParams(params); });
window.SCENE_STATE = S;
window.SCENE_API = { go, navTo, nextStep, prevStep };
})();
