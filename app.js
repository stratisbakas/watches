import * as db from './db.js';
import { CATALOG, BRANDS, DEFAULTS } from './catalog.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const layer = $('#layer');
const tabbar = $('#tabbar');

let watches = [];
let brandFilter = null;
let svcFilter = 'all';
let lastTab = '#/';
const photoCache = new Map();

/* ---------------- Outils ---------------- */

const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const uid = () => crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const compact = s => norm(s).replace(/[^a-z0-9]/g, '');
const hash = s => [...String(s)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const num = v => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(/\s|€/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

// Les dates sont stockées au format "AAAA-MM".
const today = new Date();
const thisMonth = () => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const ymIndex = ym => { const [y, m] = ym.split('-').map(Number); return y * 12 + ((m || 1) - 1); };
const indexYM = i => `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`;
const addMonths = (ym, n) => indexYM(ymIndex(ym) + n);
const monthsUntil = ym => ymIndex(ym) - ymIndex(thisMonth());
const ymDate = ym => { const [y, m] = ym.split('-').map(Number); return new Date(y, (m || 1) - 1, 1); };
const fmtMonth = ym => ym ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(ymDate(ym)) : '—';
const fmtMonthShort = ym => ym ? new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(ymDate(ym)) : '';
const yearOf = ym => ym ? Number(ym.slice(0, 4)) : null;

function span(months) {
  const a = Math.abs(months);
  if (a < 12) return `${a} mois`;
  const y = Math.floor(a / 12), r = a % 12;
  return `${y} an${y > 1 ? 's' : ''}${r && y < 3 ? ` ${r} mois` : ''}`;
}
function rel(months) {
  if (months === 0) return 'ce mois-ci';
  return months > 0 ? `dans ${span(months)}` : `il y a ${span(months)}`;
}

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const money = v => (v === null || v === undefined || v === '') ? '—' : eur.format(v);
const signedMoney = v => (v > 0 ? '+' : v < 0 ? '−' : '') + eur.format(Math.abs(v));

const MOVEMENTS = { auto: 'Automatique', manuel: 'Remontage manuel', quartz: 'Quartz', spring: 'Spring Drive' };

/* ---------------- Icônes ---------------- */

const I = {
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  pencil: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>',
  zoom: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  wrench: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3"/><path d="M14.7 6.3L13 4.6a4 4 0 0 0-5.4 5.4L3 14.6 6.4 18l4.6-4.6"/></svg>',
  drop: '<svg viewBox="0 0 24 24"><path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/></svg>',
  battery: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="16" height="10" rx="2.5"/><path d="M21.5 10.5v3M7 10.5v3M10.5 10.5v3"/></svg>',
  note: '<svg viewBox="0 0 24 24"><path d="M6 3.5h9l4 4v13H6z"/><path d="M14.5 3.5v4.5H19M9 12.5h7M9 16h5"/></svg>',
  key: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-7-10a7 7 0 0 1 14 0c0 5.6-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  watch: '<svg viewBox="0 0 64 64"><path d="M22 17l2-13h16l2 13M22 47l2 13h16l2-13"/><circle cx="32" cy="32" r="16"/><path d="M32 22v10l6 4"/><path d="M48.5 30v4"/></svg>',
};

const EVENT_TYPES = {
  service: { label: 'Révision complète', icon: I.wrench },
  water: { label: "Contrôle d'étanchéité", icon: I.drop },
  battery: { label: 'Changement de pile', icon: I.battery },
  other: { label: 'Autre intervention', icon: I.note },
};

/* ---------------- Logique métier ---------------- */

const age = w => w.year ? today.getFullYear() - w.year : null;
const isVintage = w => age(w) !== null && age(w) >= 25;
const title = w => w.model || w.brand || 'Sans nom';

const WEAR = {
  daily: { label: 'Tous les jours', service: 0.8 },
  regular: { label: 'Régulièrement', service: 1 },
  occasional: { label: 'Occasionnellement', service: 1.2 },
};
const roundHalf = n => Math.max(0.5, Math.round(n * 2) / 2);
const brandRule = w => BRANDS[norm(w.brand).trim()] || {};
const brandSource = (w, kind = 'service') => !brandRule(w)[kind] ? 'usage courant des horlogers'
  : brandRule(w).official?.[kind] ? `recommandation officielle ${w.brand}` : `usage courant pour ${w.brand}, pas de chiffre officiel`;

// Intervalle conseillé et son explication, avant tout réglage manuel de la fiche.
function suggestedInterval(w, kind) {
  const wear = WEAR[w.wear] || WEAR.regular;
  if (kind === 'water') {
    let base, why;
    if (w.catalogWater) { base = w.catalogWater; why = 'montre de plongée'; }
    else if (isVintage(w)) { base = DEFAULTS.vintageWater; why = 'montre vintage, joints anciens'; }
    else { base = brandRule(w).water || DEFAULTS.water; why = brandSource(w, 'water'); }
    if (w.wear === 'daily' && base > 1) { base = 1; why += ', portée tous les jours'; }
    return { years: base, why };
  }
  if (w.movement === 'quartz') return { years: DEFAULTS.quartz, why: 'quartz : pile et joints' };
  let base, why;
  if (isVintage(w)) { base = DEFAULTS.vintageService; why = 'montre vintage'; }
  else if (w.catalogService) { base = w.catalogService; why = `${brandSource(w)}, pour ce calibre`; }
  else if (brandRule(w).service) { base = brandRule(w).service; why = brandSource(w); }
  else { base = DEFAULTS.service; why = 'recommandation courante des horlogers'; }
  if (wear.service !== 1) { base = roundHalf(base * wear.service); why += w.wear === 'daily' ? ', portée tous les jours' : ', portée occasionnellement'; }
  return { years: base, why };
}
const defaultServiceInterval = w => suggestedInterval(w, 'service').years;
const defaultWaterInterval = w => suggestedInterval(w, 'water').years;

// Une montre d'occasion (ou vintage) sans entretien connu : impossible de dater la prochaine révision.
const historyUnknown = w => w.condition === 'used' || (!w.condition && isVintage(w));

// Dernière date connue pour un type d'entretien (historique + valeur déclarée dans la fiche).
function lastOf(w, kind) {
  const types = kind === 'service'
    ? ['service', ...(w.movement === 'quartz' ? ['battery'] : [])]
    : ['water', 'service'];
  const dates = (w.history || []).filter(e => types.includes(e.type)).map(e => e.date);
  const declared = kind === 'service' ? w.declaredService : w.declaredWater;
  if (declared) dates.push(declared);
  if (kind === 'water' && w.declaredService) dates.push(w.declaredService);
  return dates.sort().pop() || null;
}

function due(w, kind) {
  const manual = num(kind === 'service' ? w.serviceInterval : w.waterInterval);
  const interval = manual || (kind === 'service' ? defaultServiceInterval(w) : defaultWaterInterval(w));
  const label = kind === 'water' ? "Contrôle d'étanchéité" : w.movement === 'quartz' ? 'Pile & révision' : 'Révision complète';
  const last = lastOf(w, kind);
  if (!last && historyUnknown(w)) {
    return { kind, label, interval, manual: !!manual, base: null, dueYM: null, left: -0.5, pct: null, status: 'unknown', unknown: true };
  }
  const base = last || w.purchaseDate;
  if (!base) return null;
  const total = Math.max(1, Math.round(interval * 12));
  const dueYM = addMonths(base, total);
  const left = monthsUntil(dueYM);
  const pct = Math.max(0, Math.min(100, Math.round(((total - left) / total) * 100)));
  const status = left < 0 ? 'late' : left <= 6 ? 'soon' : 'ok';
  return { kind, label, interval, manual: !!manual, base, fromPurchase: !last, dueYM, left, pct, status };
}

function nextDue(w) {
  return [due(w, 'service'), due(w, 'water')].filter(Boolean).sort((a, b) => a.left - b.left)[0] || null;
}

function dueText(d) {
  if (!d) return '';
  if (d.unknown) return 'Historique inconnu';
  if (d.left < 0) return `En retard de ${span(d.left)}`;
  return d.left === 0 ? 'Ce mois-ci' : `Dans ${span(d.left)}`;
}

const yearsLabel = n => n === 1 ? 'chaque année' : `tous les ${String(n).replace('.', ',')} ans`;

function totals(list) {
  let value = 0, invested = 0, gainBase = 0, gain = 0;
  for (const w of list) {
    const p = num(w.purchasePrice), e = num(w.estimatedValue);
    value += e ?? p ?? 0;
    invested += p ?? 0;
    if (p !== null && e !== null) { gain += e - p; gainBase += p; }
  }
  return { value, invested, gain, pct: gainBase ? (gain / gainBase) * 100 : null };
}

const sorted = () => [...watches].sort((a, b) =>
  (b.purchaseDate || '').localeCompare(a.purchaseDate || '') || (b.createdAt || 0) - (a.createdAt || 0));

function searchCatalog(q) {
  const tokens = norm(q).split(/[\s/,.-]+/).filter(Boolean);
  if (!tokens.length) return [];
  const qc = compact(q);
  return CATALOG.map(item => {
    const hay = norm(`${item.brand} ${item.model} ${item.ref} ${item.nick || ''} ${item.caliber}`);
    const hayC = compact(hay);
    if (!tokens.every(t => hay.includes(t) || hayC.includes(compact(t)))) return null;
    const refC = compact(item.ref);
    let score = 0;
    if (qc && refC === qc) score += 100;
    else if (qc.length >= 3 && refC.startsWith(qc)) score += 50;
    if (tokens.some(t => norm(item.model).startsWith(t))) score += 10;
    if (tokens.some(t => norm(item.brand).startsWith(t))) score += 5;
    return { item, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8).map(r => r.item);
}

/* ---------------- Photos ---------------- */

async function photoURL(id) {
  if (photoCache.has(id)) return photoCache.get(id);
  const blob = await db.getPhoto(id);
  const url = blob ? URL.createObjectURL(blob) : null;
  photoCache.set(id, url);
  return url;
}

function hydrate(root = app) {
  $$('img[data-photo]', root).forEach(async img => {
    const url = await photoURL(img.dataset.photo);
    if (url) img.src = url;
  });
}

function placeholder(w) {
  const h = hash(`${w.brand}${w.model}`) % 360;
  return `<div class="placeholder" style="background:radial-gradient(120% 90% at 30% 15%, hsl(${h} 30% 34%), hsl(${(h + 30) % 360} 22% 11%))">${I.watch}</div>`;
}
const media = w => w.photo ? `<img class="media" data-photo="${esc(w.id)}" alt="">` : placeholder(w);

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function compress(file, max = 1800) {
  const img = await loadImage(file);
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(img.src);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.86));
}

/* ---------------- Calques : feuilles, zoom, toast ---------------- */

function openLayer(html) {
  layer.innerHTML = html;
  void layer.offsetHeight;
  requestAnimationFrame(() => layer.classList.add('layer-open'));
}
function closeLayer(immediate = false) {
  if (!layer.innerHTML) return;
  layer.classList.remove('layer-open');
  if (immediate) { layer.innerHTML = ''; return; }
  setTimeout(() => { if (!layer.classList.contains('layer-open')) layer.innerHTML = ''; }, 320);
}
function sheet(inner) {
  openLayer(`<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${inner}</div>`);
  $('.scrim', layer).onclick = () => closeLayer();
  return $('.sheet', layer);
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2200);
}

function openViewer(url) {
  openLayer(`<div class="viewer"><img src="${url}" alt="" draggable="false">
    <button class="icon-btn close" aria-label="Fermer">${I.close}</button>
    <div class="vh">Pincez ou touchez deux fois pour zoomer</div></div>`);
  const viewer = $('.viewer', layer);
  const img = $('img', viewer);
  $('.close', viewer).onclick = () => closeLayer();

  let scale = 1, tx = 0, ty = 0, lastTap = 0;
  const pts = new Map();
  let last = null;
  const apply = (anim = false) => {
    img.style.transition = anim ? 'transform .25s cubic-bezier(.2,.8,.2,1)' : 'none';
    img.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`;
    viewer.style.background = scale <= 1 && ty > 0 ? `rgba(0,0,0,${Math.max(0.3, 1 - ty / 400)})` : '#000';
  };
  const center = () => ({ x: viewer.clientWidth / 2, y: viewer.clientHeight / 2 });
  const zoomAt = (x, y, next) => {
    const c = center(), f = next / scale;
    tx = x - c.x - (x - c.x - tx) * f;
    ty = y - c.y - (y - c.y - ty) * f;
    scale = next;
  };
  const snapshot = () => {
    const p = [...pts.values()];
    if (p.length >= 2) {
      return { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2, d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) };
    }
    return p[0] ? { x: p[0].x, y: p[0].y, d: 0 } : null;
  };
  apply();

  viewer.addEventListener('pointerdown', e => {
    if (e.target.closest('.close')) return;
    viewer.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last = snapshot();
  });
  viewer.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = snapshot();
    if (!last || !now) return;
    if (pts.size >= 2 && last.d) {
      zoomAt(now.x, now.y, Math.max(0.7, Math.min(6, scale * (now.d / last.d))));
      tx += now.x - last.x; ty += now.y - last.y;
    } else if (pts.size === 1) {
      if (scale > 1) { tx += now.x - last.x; ty += now.y - last.y; }
      else { ty = Math.max(0, ty + now.y - last.y); }
    }
    last = now;
    apply();
  });
  const end = e => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    last = snapshot();
    if (pts.size) return;
    if (scale <= 1 && ty > 110) return closeLayer();
    const t = Date.now();
    if (t - lastTap < 280) {
      if (scale > 1.05) { scale = 1; tx = 0; ty = 0; } else zoomAt(e.clientX, e.clientY, 2.6);
      lastTap = 0;
      return apply(true);
    }
    lastTap = t;
    if (scale < 1.02) { scale = 1; tx = 0; ty = 0; apply(true); }
  };
  viewer.addEventListener('pointerup', end);
  viewer.addEventListener('pointercancel', end);
}

/* ---------------- Navigation ---------------- */

function setTab(name) {
  tabbar.classList.toggle('hidden', !name);
  $$('a', tabbar).forEach(a => a.dataset.tab === name ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
}

function go(hash) { location.hash = hash; }

function route() {
  closeLayer(true);
  const h = location.hash || '#/';
  let m;
  if (h === '#/' || h === '#') { lastTab = '#/'; renderHome(); }
  else if (h === '#/services') { lastTab = h; renderServices(); }
  else if (h === '#/timeline') { lastTab = h; renderTimeline(); }
  else if ((m = h.match(/^#\/watch\/(.+)$/))) renderDetail(decodeURIComponent(m[1]));
  else if (h === '#/new') renderForm(null);
  else if ((m = h.match(/^#\/edit\/(.+)$/))) renderForm(decodeURIComponent(m[1]));
  else if (h === '#/settings') renderSettings();
  else return go('#/');
  window.scrollTo(0, 0);
}

async function reload() { watches = await db.allWatches(); }

async function saveWatch(w) {
  await db.putWatch(w);
  await reload();
}

/* ---------------- Accueil ---------------- */

function renderHome() {
  setTab('home');
  const dateLabel = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(today);
  const top = `<header class="topbar">
      <a class="icon-btn" href="#/settings" aria-label="Réglages">${I.gear}</a>
      <div class="center">${esc(dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1))}</div>
      <a class="icon-btn" href="#/new" aria-label="Ajouter une montre">${I.plus}</a>
    </header>`;

  if (!watches.length) {
    app.innerHTML = `<section class="screen">${top}
      <div class="empty">
        <div class="halo">${I.watch}</div>
        <h2>Votre écrin est vide</h2>
        <p>Ajoutez votre première montre : la recherche retrouve la référence exacte et calcule les prochaines révisions.</p>
        <a class="cta" href="#/new">${I.plus} Ajouter une montre</a>
        <button class="link" id="demo">Essayer avec des exemples</button>
      </div></section>`;
    $('#demo').onclick = async () => { await loadDemo(); renderHome(); };
    return;
  }

  const brands = [...new Set(watches.map(w => w.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  if (brandFilter && !brands.includes(brandFilter)) brandFilter = null;
  const list = sorted().filter(w => !brandFilter || w.brand === brandFilter);
  const t = totals(watches);
  const first = Math.min(...watches.map(w => yearOf(w.purchaseDate)).filter(Boolean));
  const pending = watches.map(nextDue).filter(d => d && d.status !== 'ok');
  const late = pending.filter(d => d.status === 'late').length;
  const unknownCount = pending.filter(d => d.unknown).length;

  app.innerHTML = `<section class="screen">${top}
    <div class="eyebrow">Ma collection</div>
    <h1 class="title-xl">${watches.length} montre${watches.length > 1 ? 's' : ''}</h1>
    <p class="lede">${Number.isFinite(first) ? `Collection commencée en ${first}` : 'Votre collection'}</p>

    <div class="stats-row">
      <div class="stat"><div class="k">Valeur estimée</div><div class="v">${money(t.value)}</div></div>
      <div class="stat"><div class="k">Investi</div><div class="v">${money(t.invested)}</div></div>
      ${t.pct !== null ? `<div class="stat"><div class="k">Plus-value</div><div class="v ${t.gain >= 0 ? 'up' : 'down'}">${t.gain >= 0 ? '+' : '−'}${Math.abs(t.pct).toFixed(0)} %</div></div>` : ''}
    </div>

    ${pending.length ? `<a class="svc" href="#/services" style="margin-top:12px">
      <div class="row"><span class="dot ${late ? 'late' : 'soon'}"></span>
        <div class="who"><div class="t">${pending.length} entretien${pending.length > 1 ? 's' : ''} à prévoir</div>
        <div class="d">${[late && `${late} en retard`, unknownCount && `${unknownCount} à vérifier`].filter(Boolean).join(' · ') || 'dans les 6 prochains mois'}</div></div>
        <svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--muted)"><path d="M9 5l7 7-7 7"/></svg>
      </div></a>` : ''}

    ${brands.length > 1 ? `<div class="chips" role="group" aria-label="Filtrer par marque">
      <button class="chip" data-brand="" aria-pressed="${!brandFilter}">Toutes</button>
      ${brands.map(b => `<button class="chip" data-brand="${esc(b)}" aria-pressed="${brandFilter === b}">${esc(b)}</button>`).join('')}
    </div>` : '<div style="height:10px"></div>'}

    <div class="grid">${list.map(card).join('')}</div>
  </section>`;

  $$('.chip', app).forEach(ch => ch.onclick = () => { brandFilter = ch.dataset.brand || null; renderHome(); });
  hydrate();
}

function card(w) {
  const d = nextDue(w);
  const pill = d && d.status !== 'ok'
    ? `<span class="pill"><span class="dot ${d.status}"></span>${d.kind === 'water' ? 'Étanchéité' : 'Révision'} ${d.unknown ? 'à vérifier' : d.status === 'late' ? 'en retard' : rel(d.left)}</span>`
    : w.reference ? `<span class="pill">Réf. ${esc(w.reference)}</span>`
    : w.year ? `<span class="pill">${w.year}</span>` : '';
  return `<a class="card" href="#/watch/${encodeURIComponent(w.id)}">
    ${media(w)}
    <div class="body">
      <div class="brand">${esc(w.brand)}</div>
      <div class="model">${esc(w.nickname && !w.model ? w.nickname : title(w))}</div>
      ${pill}
    </div></a>`;
}

/* ---------------- Fiche détaillée ---------------- */

function renderDetail(id) {
  setTab(null);
  const list = sorted().filter(w => !brandFilter || w.brand === brandFilter);
  let idx = list.findIndex(w => w.id === id);
  if (idx < 0) {
    const w = watches.find(x => x.id === id);
    if (!w) return go('#/');
    list.splice(0, list.length, ...sorted());
    idx = list.findIndex(x => x.id === id);
  }

  app.innerHTML = `<section class="screen">
    <header class="topbar">
      <a class="icon-btn square" href="${lastTab}" aria-label="Retour">${I.back}</a>
      <div class="center" id="d-brand"></div>
      <a class="icon-btn" id="d-edit" aria-label="Modifier">${I.pencil}</a>
    </header>
    <div class="carousel">${list.map(w => `
      <div class="slide" data-id="${esc(w.id)}">
        ${media(w)}
        ${w.photo ? `<button class="zoom-hit" aria-label="Agrandir la photo"></button><span class="zoom-hint">${I.zoom} Agrandir</span>` : ''}
        <button class="icon-btn more" aria-label="Options">${I.more}</button>
        <div class="caption">
          <h1>${esc(title(w))}</h1>
          <p>${[w.reference && `Réf. ${esc(w.reference)}`, w.nickname && w.model && `« ${esc(w.nickname)} »`].filter(Boolean).join(' · ') || esc(w.brand)}</p>
        </div>
      </div>`).join('')}
    </div>
    <div id="info"></div>
  </section>
  <div class="cta-bar"><button class="cta" id="d-log">${I.wrench} Ajouter un entretien</button></div>`;

  const car = $('.carousel', app);
  const slides = $$('.slide', car);
  let active = idx;

  const show = () => {
    const w = list[active];
    $('#d-brand').textContent = w.brand || '';
    $('#d-edit').href = `#/edit/${encodeURIComponent(w.id)}`;
    $('#info').innerHTML = infoHTML(w);
    history.replaceState(null, '', `#/watch/${encodeURIComponent(w.id)}`);
    $$('[data-ev]', $('#info')).forEach(b => b.onclick = () => eventMenu(w, b.dataset.ev));
  };

  slides.forEach((s, i) => {
    const w = list[i];
    $('.more', s).onclick = () => watchMenu(w);
    const hit = $('.zoom-hit', s);
    if (hit) hit.onclick = async () => { const url = await photoURL(w.id); if (url) openViewer(url); };
  });
  $('#d-log').onclick = () => logSheet(list[active]);

  requestAnimationFrame(() => {
    const s = slides[idx];
    car.scrollLeft = s.offsetLeft - (car.clientWidth - s.clientWidth) / 2;
  });
  let timer;
  car.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const mid = car.scrollLeft + car.clientWidth / 2;
      let best = active, bd = Infinity;
      slides.forEach((s, i) => {
        const dist = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
        if (dist < bd) { bd = dist; best = i; }
      });
      if (best !== active) { active = best; show(); }
    }, 70);
  }, { passive: true });

  show();
  hydrate();
}

function infoHTML(w) {
  const p = num(w.purchasePrice), e = num(w.estimatedValue);
  const svc = due(w, 'service'), wat = due(w, 'water');
  const dueFact = (d, name) => d ? `<div class="fact">
      <div class="k">${name}</div>
      <div class="v">${d.unknown ? 'À faire contrôler' : esc(fmtMonth(d.dueYM))}</div>
      <div class="s" style="color:var(--${d.status})">${dueText(d)}</div>
      <div class="s">${yearsLabel(d.interval)}</div></div>`
    : `<div class="fact"><div class="k">${name}</div><div class="v">—</div><div class="s">Date d'achat manquante</div></div>`;

  const events = [
    ...(w.history || []).map(ev => ({ ...ev })),
    ...(w.purchaseDate ? [{ id: '__acq', type: 'acq', date: w.purchaseDate }] : []),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="value-card">
      <div>
        <div class="k">${e !== null ? 'Estimation actuelle' : "Prix d'achat"}</div>
        <div class="big">${money(e ?? p)}</div>
      </div>
      ${e !== null && p !== null ? `<div class="delta ${e >= p ? 'up' : 'down'}">${signedMoney(e - p)}
        <small>${e >= p ? '+' : '−'}${Math.abs(((e - p) / p) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} % depuis l'achat</small></div>` : ''}
    </div>
    <div class="facts">
      <div class="fact"><div class="k">Année de la montre</div><div class="v">${w.year || '—'}</div>
        <div class="s">${isVintage(w) ? `Vintage · ${age(w)} ans` : w.year ? `${age(w)} an${age(w) > 1 ? 's' : ''}` : ''}</div></div>
      <div class="fact"><div class="k">Entrée dans la collection</div><div class="v">${esc(fmtMonth(w.purchaseDate))}</div>
        <div class="s">${w.purchaseDate ? rel(monthsUntil(w.purchaseDate)) : ''}</div></div>
      <div class="fact"><div class="k">Prix d'achat</div><div class="v">${money(p)}</div></div>
      <div class="fact"><div class="k">Calibre</div><div class="v">${esc(w.caliber || '—')}</div>
        <div class="s">${esc(MOVEMENTS[w.movement] || '')}</div></div>
      ${dueFact(svc, svc?.label || 'Prochaine révision')}
      ${dueFact(wat, "Prochaine étanchéité")}
    </div>
    ${w.notes ? `<div class="notes">${esc(w.notes)}</div>` : ''}
    <div class="section-title"><div><h2>Historique</h2><p>Touchez un entretien pour le supprimer</p></div></div>
    <div class="history">
      ${events.map(ev => ev.type === 'acq'
        ? `<button disabled><span class="ic">${I.key}</span><div><div class="t">Entrée dans la collection</div><div class="d">${esc(fmtMonth(ev.date))}</div></div><span class="amt">${p !== null ? money(p) : ''}</span></button>`
        : `<button data-ev="${esc(ev.id)}"><span class="ic">${EVENT_TYPES[ev.type]?.icon || I.note}</span><div><div class="t">${esc(EVENT_TYPES[ev.type]?.label || 'Entretien')}</div><div class="d">${esc(fmtMonth(ev.date))}${ev.note ? ` · ${esc(ev.note)}` : ''}</div></div><span class="amt">${num(ev.cost) !== null ? money(num(ev.cost)) : ''}</span></button>`
      ).join('') || '<button disabled><div class="d">Aucun entretien enregistré</div></button>'}
    </div>
    <div style="height:30px"></div>`;
}

function watchMenu(w) {
  const s = sheet(`<h3>${esc(title(w))}</h3><p class="sub">${esc(w.brand)}${w.reference ? ` · Réf. ${esc(w.reference)}` : ''}</p>
    <div class="menu">
      <button data-a="edit">${I.pencil} Modifier la fiche</button>
      <button data-a="log">${I.wrench} Ajouter un entretien</button>
      ${w.photo ? `<button data-a="zoom">${I.zoom} Voir la photo</button>` : ''}
      <button data-a="del" class="danger-item">${I.trash} Supprimer la montre</button>
    </div>`);
  $$('[data-a]', s).forEach(b => b.onclick = async () => {
    const a = b.dataset.a;
    if (a === 'edit') go(`#/edit/${encodeURIComponent(w.id)}`);
    if (a === 'log') logSheet(w);
    if (a === 'zoom') { const url = await photoURL(w.id); if (url) openViewer(url); }
    if (a === 'del') await removeWatch(w);
  });
}

async function removeWatch(w) {
  if (!confirm(`Supprimer « ${title(w)} » de votre collection ? Cette action est définitive.`)) return;
  await db.deleteWatch(w.id);
  await db.deletePhoto(w.id);
  photoCache.delete(w.id);
  await reload();
  toast('Montre supprimée');
  go(lastTab === location.hash ? '#/' : lastTab);
  if (location.hash === lastTab) route();
}

function eventMenu(w, evId) {
  const ev = (w.history || []).find(e => e.id === evId);
  if (!ev) return;
  const s = sheet(`<h3>${esc(EVENT_TYPES[ev.type]?.label || 'Entretien')}</h3>
    <p class="sub">${esc(fmtMonth(ev.date))}${num(ev.cost) !== null ? ` · ${money(num(ev.cost))}` : ''}${ev.note ? ` · ${esc(ev.note)}` : ''}</p>
    <div class="menu"><button class="danger-item" data-a="del">${I.trash} Supprimer cet entretien</button></div>`);
  $('[data-a="del"]', s).onclick = async () => {
    w.history = w.history.filter(e => e.id !== evId);
    await saveWatch(w);
    closeLayer();
    toast('Entretien supprimé');
    route();
  };
}

function logSheet(w, type = 'service') {
  const types = ['service', 'water', ...(w.movement === 'quartz' ? ['battery'] : []), 'other'];
  const short = { service: 'Révision', water: 'Étanchéité', battery: 'Pile', other: 'Autre' };
  const s = sheet(`<h3>Nouvel entretien</h3><p class="sub">${esc(w.brand)} ${esc(title(w))}</p>
    <div class="seg" role="group">${types.map(t => `<button type="button" data-t="${t}" aria-pressed="${t === type}">${short[t]}</button>`).join('')}</div>
    <div class="group">
      <label class="field"><span>Date</span><input type="month" name="date" value="${thisMonth()}" max="${thisMonth()}"></label>
      <label class="field"><span>Coût</span><input name="cost" inputmode="decimal" placeholder="0 €"></label>
      <label class="field"><span>Atelier / note</span><input name="note" placeholder="Facultatif"></label>
    </div>
    <div class="form-actions"><button class="cta" id="log-save">Enregistrer</button></div>`);
  let current = type;
  $$('[data-t]', s).forEach(b => b.onclick = () => {
    current = b.dataset.t;
    $$('[data-t]', s).forEach(x => x.setAttribute('aria-pressed', x === b));
  });
  $('#log-save', s).onclick = async () => {
    const date = $('[name=date]', s).value || thisMonth();
    w.history = [...(w.history || []), {
      id: uid(), type: current, date,
      cost: num($('[name=cost]', s).value), note: $('[name=note]', s).value.trim(),
    }];
    await saveWatch(w);
    closeLayer();
    toast('Entretien enregistré');
    route();
  };
}

/* ---------------- Révisions ---------------- */

function renderServices() {
  setTab('services');
  const all = watches.flatMap(w => ['service', 'water'].map(k => ({ w, d: due(w, k) }))).filter(x => x.d);
  const items = all.filter(x => svcFilter === 'all' || x.d.kind === svcFilter).sort((a, b) => a.d.left - b.d.left);
  const undated = watches.filter(w => !due(w, 'service'));
  const late = all.filter(x => x.d.status === 'late').length;
  const unknown = all.filter(x => x.d.unknown).length;
  const within12 = all.filter(x => !x.d.unknown && x.d.left <= 12).length;
  const next = all.filter(x => x.d.left >= 0).sort((a, b) => a.d.left - b.d.left)[0];

  const tag = late || unknown
    ? `<span class="tag late">${[late && `${late} en retard`, unknown && `${unknown} à vérifier`].filter(Boolean).join(' · ')}</span>`
    : next ? `<span class="tag">Prochaine ${rel(next.d.left)}</span>`
    : `<span class="tag ok">Tout est à jour</span>`;

  app.innerHTML = `<section class="screen">
    <div class="aura">
      <div class="spacer"></div>
      ${tag}
      <h1 class="title-xl" style="margin-top:14px">Révisions</h1>
      <p class="lede">${watches.length
        ? `${within12} entretien${within12 > 1 ? 's' : ''} à prévoir dans les 12 prochains mois. Touchez une ligne une fois l'entretien fait.`
        : 'Ajoutez des montres pour suivre leurs révisions.'}</p>
    </div>
    <div class="seg" role="group" aria-label="Type d'entretien">
      <button data-f="all" aria-pressed="${svcFilter === 'all'}">Tout</button>
      <button data-f="service" aria-pressed="${svcFilter === 'service'}">Mouvement</button>
      <button data-f="water" aria-pressed="${svcFilter === 'water'}">Étanchéité</button>
    </div>
    ${items.map(({ w, d }) => `
      <button class="svc" data-id="${esc(w.id)}" data-k="${d.kind}">
        <div class="row">
          <div class="thumb">${w.photo ? `<img data-photo="${esc(w.id)}" alt="">` : placeholder(w)}</div>
          <div class="who"><div class="t">${esc(d.label)}</div><div class="d">${esc(w.brand)} ${esc(title(w))}</div></div>
          <div class="pct">${d.unknown ? '?' : `${d.pct}%`}</div>
        </div>
        <div class="bar"><i class="${d.status}" style="width:${d.unknown ? 100 : d.pct}%"></i></div>
        <div class="foot">
          ${d.unknown
            ? `<span>Occasion sans historique · faire contrôler, puis noter la date</span><b class="unknown">À vérifier</b>`
            : `<span>${d.fromPurchase ? 'Depuis l’achat' : 'Dernier'} : ${esc(fmtMonthShort(d.base))} · ${yearsLabel(d.interval)}</span>
          <b class="${d.status}">${d.left < 0 ? `Retard ${span(d.left)}` : esc(fmtMonthShort(d.dueYM))}</b>`}
        </div>
      </button>`).join('')}
    ${undated.length ? `<p class="footnote">${undated.length} montre${undated.length > 1 ? 's' : ''} sans date d'achat ni de révision : ${undated.map(w => esc(title(w))).join(', ')}.</p>` : ''}
    <p class="footnote">Intervalles basés sur les recommandations des fabricants, ajustés selon l'âge de la montre et la fréquence à laquelle elle est portée. Pour une montre neuve sans révision, le calcul part de la date d'achat ; pour une occasion sans historique, faites-la contrôler puis notez la date. Tout est réglable dans chaque fiche. Une dérive de plus de 20 secondes par jour, de la buée sous le verre ou un choc justifient un contrôle sans attendre.</p>
  </section>`;

  $$('[data-f]', app).forEach(b => b.onclick = () => { svcFilter = b.dataset.f; renderServices(); });
  $$('.svc', app).forEach(b => b.onclick = () => {
    const w = watches.find(x => x.id === b.dataset.id);
    serviceSheet(w, b.dataset.k);
  });
  hydrate();
}

function serviceSheet(w, kind) {
  const d = due(w, kind);
  const s = sheet(`<h3>${esc(d.label)}</h3>
    <p class="sub">${esc(w.brand)} ${esc(title(w))} · ${d.unknown
      ? "historique d'entretien inconnu : faites-la contrôler par un horloger, puis notez la date ici."
      : `prévue en ${esc(fmtMonth(d.dueYM))} (${dueText(d).toLowerCase()})`}</p>
    <div class="menu">
      <button data-a="done">${kind === 'water' ? I.drop : I.wrench} Marquer comme fait…</button>
      <button data-a="open">${I.search} Voir la fiche</button>
    </div>`);
  $('[data-a="done"]', s).onclick = () => logSheet(w, kind === 'water' ? 'water' : w.movement === 'quartz' ? 'battery' : 'service');
  $('[data-a="open"]', s).onclick = () => go(`#/watch/${encodeURIComponent(w.id)}`);
}

/* ---------------- Timeline ---------------- */

function renderTimeline() {
  setTab('timeline');
  const events = [];
  for (const w of watches) {
    if (w.purchaseDate) events.push({ date: w.purchaseDate, type: 'acq', w });
    for (const ev of w.history || []) events.push({ date: ev.date, type: ev.type, w, ev });
  }
  events.sort((a, b) => b.date.localeCompare(a.date));
  const years = [...new Set(events.map(e => yearOf(e.date)))];
  const undated = watches.filter(w => !w.purchaseDate);
  const t = totals(watches);
  const first = years.length ? years[years.length - 1] : null;

  const evHTML = e => e.type === 'acq'
    ? `<a class="ev acq" href="#/watch/${encodeURIComponent(e.w.id)}">
        <div class="thumb">${e.w.photo ? `<img data-photo="${esc(e.w.id)}" alt="">` : placeholder(e.w)}</div>
        <div style="min-width:0"><div class="t">${esc(title(e.w))}</div>
          <div class="d">Entrée · ${esc(e.w.brand)}${e.w.year && isVintage(e.w) ? ` · montre de ${e.w.year}` : ''}</div></div>
        <div class="m">${num(e.w.purchasePrice) !== null ? `<b>${money(num(e.w.purchasePrice))}</b>` : ''}${esc(fmtMonthShort(e.date))}</div>
      </a>`
    : `<a class="ev" href="#/watch/${encodeURIComponent(e.w.id)}">
        <div class="ic">${EVENT_TYPES[e.type]?.icon || I.note}</div>
        <div style="min-width:0"><div class="t">${esc(EVENT_TYPES[e.type]?.label || 'Entretien')}</div>
          <div class="d">${esc(e.w.brand)} ${esc(title(e.w))}${e.ev.note ? ` · ${esc(e.ev.note)}` : ''}</div></div>
        <div class="m">${num(e.ev.cost) !== null ? `<b>${money(num(e.ev.cost))}</b>` : ''}${esc(fmtMonthShort(e.date))}</div>
      </a>`;

  app.innerHTML = `<section class="screen">
    <div style="height:48px"></div>
    <div class="eyebrow">${first ? `Depuis ${first}` : 'Votre histoire'}</div>
    <h1 class="title-xl">Timeline</h1>
    <p class="lede">Chaque entrée dans la collection et chaque entretien.</p>
    <div class="stats-row">
      <div class="stat"><div class="k">Montres</div><div class="v">${watches.length}</div></div>
      <div class="stat"><div class="k">Investi</div><div class="v">${money(t.invested)}</div></div>
      <div class="stat"><div class="k">Années</div><div class="v">${first ? today.getFullYear() - first + 1 : '—'}</div></div>
    </div>
    ${events.length ? `<div class="tl">${years.map(y => `
      <div class="year">${y}</div>
      ${events.filter(e => yearOf(e.date) === y).map(evHTML).join('')}`).join('')}
    </div>` : `<p class="footnote" style="margin-top:30px">Renseignez la date d'achat de vos montres pour construire la timeline.</p>`}
    ${undated.length ? `<p class="footnote">Sans date d'achat : ${undated.map(w => esc(title(w))).join(', ')}.</p>` : ''}
  </section>`;
  hydrate();
}

/* ---------------- Ajout / modification ---------------- */

function renderForm(id) {
  setTab(null);
  const existing = id ? watches.find(w => w.id === id) : null;
  if (id && !existing) return go('#/');
  const w = existing ? structuredClone(existing) : { id: uid(), movement: 'auto', history: [], createdAt: Date.now() };
  let newPhoto = null;
  const backHref = existing ? `#/watch/${encodeURIComponent(w.id)}` : lastTab;
  const v = k => esc(w[k] ?? '');
  const lastSvc = lastOf(w, 'service') || '';
  const lastWater = w.declaredWater || (w.history || []).filter(e => e.type === 'water').map(e => e.date).sort().pop() || '';

  app.innerHTML = `<section class="screen">
    <header class="topbar">
      <a class="icon-btn" href="${backHref}" aria-label="Annuler">${I.close}</a>
      <div class="center">${existing ? 'Modifier' : 'Nouvelle montre'}</div>
      <span style="width:42px"></span>
    </header>
    <h1 class="form-title">${existing ? esc(title(w)) : 'Quelle montre ?'}</h1>

    <div class="search">${I.search}
      <input id="q" type="search" placeholder="Modèle, surnom ou référence (ex. 126610, Pepsi)" autocomplete="off" enterkeyhint="search">
    </div>
    <div class="results" id="results"></div>
    <p class="hint">Le catalogue contient ${CATALOG.length} références courantes. Absente ? Remplissez la fiche à la main.</p>

    <label class="photo-drop" id="photo">
      ${w.photo ? `<img data-photo="${esc(w.id)}" alt="">` : ''}
      <span class="lbl" ${w.photo ? 'hidden' : ''}>${I.camera}Ajouter une photo</span>
      <span class="swap" ${w.photo ? '' : 'hidden'}>Changer</span>
      <input type="file" accept="image/*" id="file">
    </label>

    <form id="f" autocomplete="off">
      <fieldset><legend>Identité</legend><div class="group">
        <label class="field"><span>Marque</span><input name="brand" value="${v('brand')}" placeholder="Rolex" required></label>
        <label class="field"><span>Modèle</span><input name="model" value="${v('model')}" placeholder="Submariner"></label>
        <label class="field"><span>Référence</span><input name="reference" value="${v('reference')}" placeholder="124060"></label>
        <label class="field"><span>Surnom</span><input name="nickname" value="${v('nickname')}" placeholder="Facultatif"></label>
        <label class="field"><span>Calibre</span><input name="caliber" value="${v('caliber')}" placeholder="3230"></label>
        <label class="field"><span>Mouvement</span><select name="movement">
          ${Object.entries(MOVEMENTS).map(([k, l]) => `<option value="${k}" ${w.movement === k ? 'selected' : ''}>${l}</option>`).join('')}
        </select></label>
      </div></fieldset>

      <fieldset><legend>Dates</legend><div class="group">
        <label class="field"><span>Année de la montre</span><input name="year" inputmode="numeric" maxlength="4" value="${v('year')}" placeholder="Si vintage, ex. 1968"></label>
        <label class="field"><span>Entrée dans la collection</span><input name="purchaseDate" type="month" value="${v('purchaseDate')}" max="${thisMonth()}"></label>
        <label class="field"><span>Achetée</span><select name="condition">
          <option value="" ${!w.condition ? 'selected' : ''}>—</option>
          <option value="new" ${w.condition === 'new' ? 'selected' : ''}>Neuve</option>
          <option value="used" ${w.condition === 'used' ? 'selected' : ''}>D'occasion</option>
        </select></label>
      </div><p class="hint" id="years-hint"></p></fieldset>

      <fieldset><legend>Valeur</legend><div class="group">
        <label class="field"><span>Prix d'achat</span><input name="purchasePrice" inputmode="decimal" value="${v('purchasePrice')}" placeholder="€"></label>
        <label class="field"><span>Estimation actuelle</span><input name="estimatedValue" inputmode="decimal" value="${v('estimatedValue')}" placeholder="€"></label>
      </div><p class="hint" id="value-hint"></p></fieldset>

      <fieldset><legend>Entretien</legend><div class="group">
        <label class="field"><span>Dernière révision</span><input name="declaredService" type="month" value="${esc(lastSvc)}" max="${thisMonth()}"></label>
        <label class="field"><span>Dernière étanchéité</span><input name="declaredWater" type="month" value="${esc(lastWater)}" max="${thisMonth()}"></label>
        <label class="field"><span>Portée</span><select name="wear">
          ${Object.entries(WEAR).map(([k, o]) => `<option value="${k}" ${(w.wear || 'regular') === k ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select></label>
        <label class="field"><span>Révision tous les</span><input name="serviceInterval" inputmode="decimal" value="${v('serviceInterval')}" placeholder=""></label>
        <label class="field"><span>Étanchéité tous les</span><input name="waterInterval" inputmode="decimal" value="${v('waterInterval')}" placeholder=""></label>
      </div><p class="hint" id="interval-hint"></p></fieldset>

      <fieldset><legend>Notes</legend><div class="group">
        <label class="field col"><textarea name="notes" placeholder="Boîte et papiers, provenance, bracelet…">${v('notes')}</textarea></label>
      </div></fieldset>

      <div class="form-actions"><button class="cta" type="submit">Enregistrer</button></div>
      ${existing ? `<button type="button" class="danger" id="del">Supprimer cette montre</button>` : ''}
    </form>
  </section>`;

  const form = $('#f');
  const field = n => form.elements[n];

  const refreshHints = () => {
    const probe = { ...w, brand: field('brand').value, movement: field('movement').value, year: num(field('year').value),
      wear: field('wear').value, condition: field('condition').value };
    const sv = suggestedInterval(probe, 'service'), wt = suggestedInterval(probe, 'water');
    const fmtY = n => `${String(n).replace('.', ',')} an${n > 1 ? 's' : ''}`;
    field('serviceInterval').placeholder = fmtY(sv.years);
    field('waterInterval').placeholder = fmtY(wt.years);
    $('#interval-hint').textContent = `Conseillé : révision ${yearsLabel(sv.years)} (${sv.why}), étanchéité ${yearsLabel(wt.years)} (${wt.why}). Laissez vide pour suivre ces conseils, ou indiquez vos propres intervalles en années.`
      + (!field('declaredService').value && historyUnknown(probe) ? " Sans date de dernière révision, la montre sera marquée « à vérifier »." : '');
    $('#value-hint').innerHTML = w.catalogMarket
      ? `Cote indicative du catalogue : ~${money(w.catalogMarket)}${w.catalogRetail ? ` (neuf ${money(w.catalogRetail)})` : ''}. <button type="button" id="apply-est">Utiliser</button>`
      : '';
    const ab = $('#apply-est');
    if (ab) ab.onclick = () => { field('estimatedValue').value = w.catalogMarket; };
    $('#years-hint').textContent = w.catalogYears ? `Référence produite ${w.catalogYears}.` : '';
  };
  ['brand', 'movement', 'year', 'wear', 'condition', 'declaredService'].forEach(n => field(n).addEventListener('input', refreshHints));
  refreshHints();

  // Recherche dans le catalogue
  const q = $('#q'), results = $('#results');
  q.addEventListener('input', () => {
    const found = searchCatalog(q.value);
    if (!q.value.trim()) { results.innerHTML = ''; return; }
    results.innerHTML = found.length
      ? found.map((it, i) => `<button type="button" data-i="${i}">
          <div class="t">${esc(it.brand)} ${esc(it.model)}${it.nick ? ` <span style="color:var(--muted);font-weight:500">« ${esc(it.nick)} »</span>` : ''}</div>
          <div class="d">Réf. ${esc(it.ref)} · cal. ${esc(it.caliber)} · ${it.from}${it.to ? `–${it.to}` : '–auj.'} · ~${money(it.market)}</div>
        </button>`).join('')
      : '<div class="none">Aucune référence trouvée. Essayez la marque, le modèle ou une partie de la référence.</div>';
    $$('[data-i]', results).forEach(b => b.onclick = () => applyCatalog(found[Number(b.dataset.i)]));
  });

  const applyCatalog = it => {
    field('brand').value = it.brand;
    field('model').value = it.model;
    field('reference').value = it.ref;
    field('caliber').value = it.caliber;
    field('movement').value = it.movement;
    if (it.nick && !field('nickname').value) field('nickname').value = it.nick;
    w.catalogService = it.service || null;
    w.catalogWater = it.water || null;
    if (!field('estimatedValue').value) field('estimatedValue').value = it.market;
    w.catalogMarket = it.market;
    w.catalogRetail = it.retail;
    w.catalogYears = it.to ? `de ${it.from} à ${it.to}` : `depuis ${it.from}`;
    q.value = '';
    results.innerHTML = '';
    if (!existing) $('.form-title').textContent = it.model;
    refreshHints();
    toast('Fiche pré-remplie');
  };

  // Photo
  $('#file').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      newPhoto = await compress(file);
      const drop = $('#photo');
      let img = $('img', drop);
      if (!img) { img = document.createElement('img'); drop.prepend(img); }
      img.removeAttribute('data-photo');
      img.src = URL.createObjectURL(newPhoto);
      $('.lbl', drop).hidden = true;
      $('.swap', drop).hidden = false;
    } catch {
      toast("Impossible de lire cette image");
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    if (!f.brand.trim() && !f.model.trim()) { toast('Indiquez au moins la marque ou le modèle'); return; }
    const year = num(f.year);
    Object.assign(w, {
      brand: f.brand.trim(), model: f.model.trim(), reference: f.reference.trim(), nickname: f.nickname.trim(),
      caliber: f.caliber.trim(), movement: f.movement,
      year: year && year > 1800 && year <= today.getFullYear() ? Math.round(year) : null,
      purchaseDate: f.purchaseDate || null,
      purchasePrice: num(f.purchasePrice), estimatedValue: num(f.estimatedValue),
      serviceInterval: num(f.serviceInterval), waterInterval: num(f.waterInterval),
      condition: f.condition || null, wear: f.wear || 'regular',
      notes: f.notes.trim(), updatedAt: Date.now(),
    });
    // N'enregistre la date déclarée que si elle diffère de ce que l'historique sait déjà.
    w.declaredService = f.declaredService && f.declaredService !== lastOfHistory(w, 'service') ? f.declaredService : null;
    w.declaredWater = f.declaredWater && f.declaredWater !== lastOfHistory(w, 'water') ? f.declaredWater : null;
    if (newPhoto) {
      await db.putPhoto(w.id, newPhoto);
      const old = photoCache.get(w.id);
      if (old) URL.revokeObjectURL(old);
      photoCache.delete(w.id);
      w.photo = true;
    }
    await saveWatch(w);
    toast(existing ? 'Fiche mise à jour' : 'Montre ajoutée à la collection');
    go(`#/watch/${encodeURIComponent(w.id)}`);
  });

  const del = $('#del');
  if (del) del.onclick = () => removeWatch(existing);
  hydrate();
}

function lastOfHistory(w, kind) {
  const types = kind === 'service' ? ['service', ...(w.movement === 'quartz' ? ['battery'] : [])] : ['water'];
  return (w.history || []).filter(e => types.includes(e.type)).map(e => e.date).sort().pop() || null;
}

/* ---------------- Réglages ---------------- */

const THEMES = { auto: 'Auto', light: 'Clair', dark: 'Sombre' };
function getTheme() {
  try { return localStorage.getItem('ecrin-theme') || 'auto'; } catch { return 'auto'; }
}
function applyTheme(t) {
  try { t === 'auto' ? localStorage.removeItem('ecrin-theme') : localStorage.setItem('ecrin-theme', t); } catch { /* stockage indisponible */ }
  if (t === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  // Couleur de la barre du navigateur : suit le thème forcé, sinon le réglage de l'iPhone.
  $$('meta[name="theme-color"]').forEach(m => {
    const scheme = m.media.includes('light') ? 'light' : 'dark';
    m.content = t === 'auto' ? (scheme === 'light' ? '#f4f2ee' : '#0a0a0b') : (t === 'light' ? '#f4f2ee' : '#0a0a0b');
  });
}

async function renderSettings() {
  setTab(null);
  let usage = '';
  try {
    const est = await navigator.storage?.estimate?.();
    if (est?.usage) usage = `${(est.usage / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo utilisés sur cet appareil`;
  } catch { /* indisponible */ }

  app.innerHTML = `<section class="screen">
    <header class="topbar">
      <a class="icon-btn square" href="#/" aria-label="Retour">${I.back}</a>
      <div class="center">Réglages</div><span style="width:42px"></span>
    </header>
    <h1 class="form-title">Réglages</h1>

    <div class="section-title"><div><h2>Apparence</h2><p>« Auto » suit le réglage clair/sombre de l'iPhone</p></div></div>
    <div class="seg" role="group" aria-label="Thème" style="margin-top:0">
      ${Object.entries(THEMES).map(([k, l]) => `<button data-theme-opt="${k}" aria-pressed="${getTheme() === k}">${l}</button>`).join('')}
    </div>

    <div class="section-title"><div><h2>Sauvegarde</h2><p>${esc(usage || 'Vos données restent sur cet appareil')}</p></div></div>
    <div class="list">
      <button id="export">Exporter la collection <small>photos incluses</small></button>
      <label>Importer une sauvegarde <small>.json</small><input type="file" accept="application/json,.json" id="import"></label>
    </div>
    <p class="prose">Exportez de temps en temps (vers Fichiers ou iCloud Drive) : c'est votre filet de sécurité si vous changez de téléphone.</p>

    <div class="section-title"><div><h2>Installer sur l'iPhone</h2></div></div>
    <p class="prose">Dans Safari : bouton Partager, puis « Sur l'écran d'accueil ». Écrin s'ouvre alors en plein écran, comme une app, et fonctionne hors ligne.</p>

    <div class="section-title"><div><h2>Données</h2></div></div>
    <div class="list">
      <button id="demo">Ajouter des montres d'exemple</button>
      <button id="wipe" style="color:var(--late)">Tout effacer</button>
    </div>
    <p class="prose">Écrin · ${CATALOG.length} références au catalogue. Les cotes sont indicatives et varient selon l'état, la boîte et les papiers.</p>
  </section>`;

  $$('[data-theme-opt]', app).forEach(b => b.onclick = () => {
    applyTheme(b.dataset.themeOpt);
    $$('[data-theme-opt]', app).forEach(x => x.setAttribute('aria-pressed', x === b));
  });
  $('#export').onclick = exportData;
  $('#import').onchange = e => e.target.files[0] && importData(e.target.files[0]);
  $('#demo').onclick = async () => { await loadDemo(); toast('Exemples ajoutés'); go('#/'); };
  $('#wipe').onclick = async () => {
    if (!confirm('Effacer toute la collection et les photos de cet appareil ?')) return;
    if (!confirm('Vraiment ? Pensez à exporter une sauvegarde avant.')) return;
    await db.clearAll();
    photoCache.clear();
    await reload();
    toast('Collection effacée');
    go('#/');
  };
}

const blobToDataURL = blob => new Promise(resolve => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.readAsDataURL(blob);
});

async function exportData() {
  const photos = {};
  for (const w of watches) {
    if (!w.photo) continue;
    const blob = await db.getPhoto(w.id);
    if (blob) photos[w.id] = await blobToDataURL(blob);
  }
  const data = JSON.stringify({ app: 'ecrin', version: 1, exportedAt: new Date().toISOString(), watches, photos });
  const name = `ecrin-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([data], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Sauvegarde Écrin' }); return; }
    catch (err) { if (err.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

async function importData(file) {
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== 'ecrin' || !Array.isArray(data.watches)) throw new Error('format');
    if (!confirm(`Importer ${data.watches.length} montre(s) ? Les fiches existantes portant le même identifiant seront remplacées.`)) return;
    for (const w of data.watches) {
      await db.putWatch(w);
      const url = data.photos?.[w.id];
      if (url) {
        await db.putPhoto(w.id, await (await fetch(url)).blob());
        photoCache.delete(w.id);
      }
    }
    await reload();
    toast('Sauvegarde importée');
    go('#/');
  } catch {
    toast("Ce fichier n'est pas une sauvegarde Écrin");
  }
}

// Exemples illustrés par des photos libres de droits (Wikimedia Commons), téléchargées au chargement.
const COMMONS = 'https://upload.wikimedia.org/wikipedia/commons/';
const THUMB = (path, file) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/${file}/1280px-${file}`;

async function loadDemo() {
  const demo = [
    { brand: 'Rolex', model: 'GMT-Master II', reference: '116710LN', caliber: '3186', movement: 'auto', year: 2014, purchaseDate: '2015-03', purchasePrice: 7400, estimatedValue: 13000, declaredWater: '2025-06', condition: 'new', wear: 'daily',
      history: [{ id: uid(), type: 'service', date: '2024-01', cost: 890, note: 'Service Rolex, Paris' }],
      notes: 'Boîte et papiers. Première vraie montre de la collection.',
      photo: THUMB('1/17', 'Rolex_GMT_Master_II_%284657617812%29.jpg'), credit: 'Håkan Dahlström, CC BY 2.0' },
    { brand: 'Rolex', model: 'Datejust 36', reference: '126234', caliber: '3235', movement: 'auto', year: 2022, purchaseDate: '2022-09', purchasePrice: 9200, estimatedValue: 10000, declaredWater: '2025-10',
      photo: THUMB('8/81', 'Rolex_Datejust_126234.jpg'), credit: 'ajay_suresh, CC BY 2.0' },
    { brand: 'Omega', model: 'Speedmaster Professional', reference: '3570.50', nickname: 'Moonwatch', caliber: '1861', movement: 'manuel', year: 2004, purchaseDate: '2018-05', purchasePrice: 3600, estimatedValue: 4800, declaredWater: '2025-08',
      history: [{ id: uid(), type: 'service', date: '2021-02', cost: 590, note: 'Service Omega, Bienne' }],
      photo: COMMONS + '2/27/OMEGA-Speedmaster-Professional-Front_%28cropped%29.jpg', credit: 'Torsten Bolten, domaine public' },
    { brand: 'Rolex', model: 'Datejust', reference: '16013', caliber: '3035', movement: 'auto', year: 1984, purchaseDate: '2019-11', purchasePrice: 5200, estimatedValue: 6200, condition: 'used',
      notes: 'Or et acier, cadran champagne. Achetée chez un marchand vintage à Genève.',
      history: [{ id: uid(), type: 'service', date: '2023-03', cost: 650, note: 'Horloger indépendant' }, { id: uid(), type: 'water', date: '2026-01', cost: 40 }],
      photo: THUMB('9/9d', 'Rolex_Datejust_16013.jpg'), credit: 'anna2005, CC0' },
    { brand: 'Rolex', model: 'Submariner Date', reference: '16800', caliber: '3035', movement: 'auto', year: 1986, purchaseDate: '2016-04', purchasePrice: 6800, estimatedValue: 10500, condition: 'used', declaredWater: '2026-04',
      history: [{ id: uid(), type: 'service', date: '2018-05', cost: 720, note: 'Service Rolex' }],
      photo: THUMB('f/f3', 'The_Rolex_Submariner_Professional.JPG'), credit: 'Dr.K., CC BY-SA 3.0' },
    { brand: 'Grand Seiko', model: 'Spring Drive', reference: 'SBGA011', nickname: 'Snowflake', caliber: '9R65', movement: 'spring', year: 2012, purchaseDate: '2021-01', purchasePrice: 3900, estimatedValue: 4400, condition: 'used', wear: 'occasional',
      photo: THUMB('d/d2', 'Grand_Seiko_SBGA011.jpg'), credit: 'Faustine seiko, CC BY-SA 3.0' },
    { brand: 'Omega', model: 'Seamaster Planet Ocean Chronograph', reference: '2210.51.00', catalogWater: 1, caliber: '3313', movement: 'auto', year: 2009, purchaseDate: '2017-07', purchasePrice: 3100, estimatedValue: 3500, declaredService: '2022-09', declaredWater: '2026-03',
      photo: THUMB('2/21', 'Omega_Seamaster_Planet_Ocean_Chronograph_2210.51.00.jpg'), credit: 'John Torcasio, CC BY-SA 3.0' },
    { brand: 'Tudor', model: 'Black Bay Chrono', reference: '79350', catalogWater: 1, caliber: 'MT5813', movement: 'auto', year: 2018, purchaseDate: '2023-06', purchasePrice: 3900, estimatedValue: 3800, declaredWater: '2026-05',
      photo: THUMB('3/30', 'Tudor_Black_Bay_Chrono_ref._79350.jpg'), credit: 'EMore98, CC BY-SA 4.0' },
    { brand: 'Cartier', model: 'Tank Must', reference: 'WSTA0041', caliber: 'Quartz', movement: 'quartz', year: 2021, purchaseDate: '2024-02', purchasePrice: 2900, estimatedValue: 2600, declaredWater: '2025-12',
      photo: COMMONS + 'f/fc/Cartier_Tank_Must%2C_2021.jpg', credit: 'EMore98, CC BY-SA 4.0' },
  ];
  toast('Chargement des exemples…');
  let t = Date.now();
  await Promise.all(demo.map(async ({ photo, credit, ...d }, i) => {
    const w = { id: uid(), history: [], createdAt: t - i, demo: true, ...d };
    w.notes = [d.notes, `Photo d'exemple : ${credit}, via Wikimedia Commons.`].filter(Boolean).join('\n');
    try {
      const res = await fetch(photo);
      if (!res.ok) throw new Error(res.status);
      await db.putPhoto(w.id, await compress(await res.blob(), 1400));
      w.photo = true;
    } catch { /* hors ligne : l'exemple reste sans photo */ }
    await db.putWatch(w);
  }));
  await reload();
}

/* ---------------- Démarrage ---------------- */

window.addEventListener('hashchange', route);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLayer(); });

(async function boot() {
  db.requestPersistence();
  applyTheme(getTheme());
  await reload();
  route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
