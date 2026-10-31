/* AI Lookbook — outfit engine and UI.
   All personal data lives in wardrobe.js (window.WARDROBE). You normally don't need to edit this file. */
(function () {
  const W = window.WARDROBE;
  if (!W) { document.body.insertAdjacentHTML('afterbegin', '<p style="padding:24px">wardrobe.js is missing or has a syntax error.</p>'); return; }

  const C = W.colors || {};
  const RU = W.rules || {};
  const NEUT = new Set(RU.neutrals || ['white', 'cream', 'ivory', 'beige', 'camel', 'grey', 'black', 'navy', 'denim', 'brown', 'chocolate']);
  const LIGHT = new Set(RU.lights || ['white', 'cream', 'ivory', 'beige']);
  const pairKey = (a, b) => [a, b].sort().join('|');
  const ALLOW = new Set((RU.allowedAccentPairs || []).map(p => pairKey(p[0], p[1])));
  const CLASH = new Set((RU.clashingPairs || []).map(p => pairKey(p[0], p[1])));
  const PATTERNS = ['print', 'stripe', 'graphic'];

  // fill in anything an AI-written wardrobe file left out, so one missing field never breaks the page
  const I = (W.items || []).filter(x => x && x.id && x.cat).map(x => ({
    set: '', fabric: 'matte', formality: [1, 3], seasons: ['su', 'ms', 'wi'], ...x,
    flags: Array.isArray(x.flags) ? x.flags : []
  }));
  const byId = Object.fromEntries(I.map(x => [x.id, x]));
  const has = (x, f) => x && x.flags.includes(f);
  const canTop = x => x.cat === 'top' || has(x, 'alsoTop');
  const canLayer = x => x.cat === 'layer' || has(x, 'alsoLayer');
  const acc = x => !NEUT.has(x.color), light = x => LIGHT.has(x.color), patt = x => PATTERNS.includes(x.fabric);

  // ---------- swatches ----------
  function fabStyle(x) {
    const c = C[x.color] || '#ccc';
    const p = x.printColors || ['#D4A43A', '#E7A0B0'];
    switch (x.fabric) {
      case 'satin': return `background:linear-gradient(125deg,${c} 0%,color-mix(in srgb,${c} 55%,white) 36%,${c} 60%,color-mix(in srgb,${c} 78%,black) 100%)`;
      case 'tweed': return `background:repeating-linear-gradient(45deg,rgba(0,0,0,.08) 0 2px,transparent 2px 5px),repeating-linear-gradient(-45deg,rgba(255,255,255,.55) 0 1px,transparent 1px 4px),${c}`;
      case 'linen': return `background:repeating-linear-gradient(0deg,rgba(0,0,0,.06) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 1px,transparent 1px 4px),${c}`;
      case 'knit': return `background:repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 6px),${c}`;
      case 'denim': return `background:repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 1px,transparent 1px 3px),${c}`;
      case 'stripe': return `background:repeating-linear-gradient(90deg,${p[0]} 0 6px,${c} 6px 12px)`;
      case 'graphic': return `background:radial-gradient(circle at 30% 28%,${p[0]} 0 17%,transparent 18%),radial-gradient(circle at 72% 66%,${p[0]} 0 21%,transparent 22%),repeating-linear-gradient(0deg,${p[0]} 0 3px,${c} 3px 17px)`;
      case 'print': return `background:radial-gradient(circle at 25% 30%,${p[0]} 0 10%,transparent 11%),radial-gradient(circle at 70% 58%,${p[1] || p[0]} 0 9%,transparent 10%),radial-gradient(circle at 42% 82%,${p[0]} 0 7%,transparent 8%),${c}`;
      default: return `background:${c}`;
    }
  }

  // ---------- matching rules ----------
  function pairOk(a, b) {
    if (a.set && a.set === b.set) return true;
    const k = pairKey(a.color, b.color);
    if (acc(a) && acc(b) && (a.color === b.color || !ALLOW.has(k))) return false; // max one accent colour
    if (patt(a) && patt(b)) return false;                                          // max one pattern
    if (CLASH.has(k)) return false;                                                // e.g. black + navy
    if (a.fabric === 'tweed' && b.fabric === 'tweed') return false;               // one textured piece
    return true;
  }

  const OCC = { 1: 'City', 2: 'Work', 3: 'Evening' };
  const ROLES = [['', 'Any role'], ['stage', 'Stage'], ['client', 'Clients & investors'], ['mentor', 'Mentoring'], ['workshop', 'Workshop'], ['net', 'Networking & evening']];
  const ROLE_N = Object.fromEntries(ROLES);

  const favKey = o => [o.layer, o.top, o.bottom, o.dress].filter(Boolean).map(x => x.id).sort().join('+');
  const FAV = (W.favourites || []).map(f => ({ title: f.title, o: { layer: byId[f.layer], top: byId[f.top], bottom: byId[f.bottom], dress: byId[f.dress] } }));
  const FAVKEYS = {}; FAV.forEach(f => { FAVKEYS[favKey(f.o)] = f.title; });

  function evalOutfit(o, season) {
    const p = [o.layer, o.top, o.bottom, o.dress].filter(Boolean);
    if (!p.every(x => x.seasons.includes(season))) return null;
    if (o.layer && o.top && has(o.top, 'noLayer')) return null;
    if (season === 'wi' && o.top && has(o.top, 'sleeveless') && !o.layer) return null;
    for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (!pairOk(p[i], p[j])) return null;
    const lo = Math.max(...p.map(x => x.formality[0])), hi = Math.min(...p.map(x => x.formality[1]));
    if (lo > hi) return null;

    const accN = p.filter(acc).length, sat = p.filter(x => x.fabric === 'satin').length;
    const sameSet = p.length > 1 && p.every(x => x.set && x.set === p[0].set);
    let s = 0, why;
    if (p.every(light)) { s += 3; why = 'Light monochrome'; }
    else if (p.some(light) && accN <= 1) { s += 2; why = accN ? 'Light base with one colour accent' : 'Light base with a deep tone'; }
    else why = accN ? 'Colour accent on a deep base' : 'Deep palette';
    if (sameSet) { s += .5; why = 'A ready-made set'; }
    if (sat && sat < p.length) { s += 1; why += ' · sheen next to matte'; }
    if (sat >= 2 && !sameSet) s -= 1;
    if (o.layer && lo >= 2) s += .5;
    const key = favKey(o), fav = FAVKEYS[key];
    if (fav) s += 1.5;

    const tw = p.some(x => x.fabric === 'tweed'), roles = [];
    const casualKnit = p.some(x => x.fabric === 'knit' && !has(x, 'fineKnit'));
    if (hi >= 2 && accN <= 1 && !p.some(x => x.fabric === 'denim') && !casualKnit &&
        (p.every(light) || sameSet || tw || (o.layer && lo >= 2) || has(o.dress, 'stage'))) roles.push('stage');
    if (lo <= 2 && hi >= 2 && o.layer && accN <= 1 && !p.some(patt)) roles.push('client');
    if (lo <= 2 && (p.some(x => x.fabric === 'denim' || x.fabric === 'stripe' || x.fabric === 'knit') || has(o.layer, 'relaxed'))) roles.push('mentor');
    if (lo === 1 && o.bottom && ['trousers', 'jeans'].includes(o.bottom.kind)) roles.push('workshop');
    if (hi === 3 && (accN >= 1 || sat > 0 || o.dress)) roles.push('net');

    return { ...o, p, lo, hi, s, why, key, fav, season, roles };
  }

  function shoes(o) {
    const S = W.shoes || {};
    if (o.season === 'wi') return S.winter || 'Heeled ankle boots';
    if (o.lo === 3) return S.evening || 'Strappy heeled sandals';
    if (o.season === 'su' && o.lo === 1) return S.summerCasual || 'Flat sandals';
    return S.default || 'Pointed slingbacks';
  }

  // proportion hints, driven by item flags and W.proportions toggles
  function fit(o) {
    const P = W.proportions || {}, h = [], { top: t, bottom: b, layer: l, dress: d } = o;
    if (P.raiseWaist && t && !has(t, 'cropped')) h.push(t.cat === 'layer' ? 'Tuck the cardigan in and add a belt' : 'Tuck the top in to raise the waist');
    if (P.raiseWaist && l && has(l, 'longLayer')) h.push('Wear the jacket buttoned or belted at the waist');
    if (P.lengthenLegs && b) {
      if (LIGHT.has(b.color)) h.push('Nude shoes matching the trousers lengthen the legs');
      else if (b.color === 'black') h.push('Black shoes to match the bottom half');
      else if (b.kind === 'skirt') h.push('A heel with this skirt');
    }
    if (d) {
      if (has(d, 'mini')) h.push('A mini shows off the legs');
      else if (has(d, 'beltIt')) h.push('Cinch the belt at the narrowest point');
      else if (P.lengthenLegs) h.push('Heels or slingbacks for leg length');
    }
    return h.length ? h.slice(0, 2).join('. ') + '.' : '';
  }

  function generate(ids, season) {
    const it = ids.map(i => byId[i]).filter(Boolean);
    const tops = it.filter(canTop), bots = it.filter(x => x.cat === 'bottom'), lays = it.filter(canLayer), drs = it.filter(x => x.cat === 'dress');
    const out = [], seen = new Set();
    const add = o => { const r = evalOutfit(o, season); if (r && !seen.has(r.key)) { seen.add(r.key); out.push(r); } };
    for (const d of drs) { add({ dress: d }); for (const l of lays) add({ dress: d, layer: l }); }
    for (const t of tops) for (const b of bots) { add({ top: t, bottom: b }); for (const l of lays) if (l !== t) add({ top: t, bottom: b, layer: l }); }
    return out;
  }

  // ---------- rendering ----------
  const PART = { layer: 'Layer', top: 'Top', bottom: 'Bottom', dress: 'Dress' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function card(o, label) {
    const parts = ['layer', 'top', 'dress', 'bottom'].filter(r => o[r]).map(r => [r, o[r]]);
    const occ = []; for (let k = o.lo; k <= o.hi; k++) occ.push(`<span class="tag">${OCC[k]}</span>`);
    const f = fit(o);
    return `<article class="look">
      <div class="top">${label ? `<span class="daytag">${label}</span>` : (o.fav ? `<span class="title">${esc(o.fav)}</span>` : '<span></span>')}
        <div class="occ">${o.fav && label ? '<span class="tag fav">favourite</span>' : ''}${occ.join('')}</div></div>
      <div class="fabs">${parts.map(([r, x]) => `<div class="fab"><span class="sw" style="${fabStyle(x)}" title="${esc(x.name)}"></span><small>${PART[r]}</small></div>`).join('')}</div>
      <ul class="names">${parts.map(([, x]) => `<li>${esc(x.name)}</li>`).join('')}</ul>
      <p class="why">${o.why}</p>
      ${o.roles.length ? `<div class="occ">${o.roles.map(r => `<span class="tag fav">${ROLE_N[r]}</span>`).join('')}</div>` : ''}
      <p class="shoe">Shoes: ${esc(shoes(o))}</p>
      ${f ? `<p class="shoe"><b>Proportions:</b> ${f}</p>` : ''}
    </article>`;
  }

  const $ = id => document.getElementById(id);
  const NS = 'lookbook-' + (W.id || 'me') + '-';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(NS + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { } }
  };

  // header from profile
  const PR = W.profile || {};
  document.title = PR.title || 'Lookbook';
  $('eyebrow').textContent = PR.eyebrow || '';
  $('headline').innerHTML = esc(PR.headline || 'My lookbook').replace(/\*(.+?)\*/g, '<em>$1</em>');
  $('lede').textContent = PR.lede || 'Tick the pieces you’re packing and see every outfit they make.';
  $('formula').innerHTML = (PR.formula || []).map(r => `<div class="rule"><b>${esc(r.title)}</b><span>${esc(r.text)}</span></div>`).join('') +
    `<div class="rule"><b>Palette</b><div class="palette">${(PR.palette || Object.keys(C)).map(f => `<span class="dot" style="background:${C[f]}" title="${esc(f)}"></span>`).join('')}</div></div>`;
  $('note').textContent = PR.note || '';

  // ---------- trip builder ----------
  const CLIM = [['su', 'Hot'], ['ms', 'Spring or autumn'], ['wi', 'Cold']];
  const PRESETS = W.presets || [];
  let st = { clim: store.get('clim', PRESETS[0] ? PRESETS[0].climate : 'ms'), sel: new Set(store.get('sel', PRESETS[0] ? PRESETS[0].items : I.map(x => x.id))), occ: 0, role: '', showOff: false, limit: 12, jit: 0 };
  const save = () => { store.set('clim', st.clim); store.set('sel', [...st.sel]); };

  function renderClimate() {
    $('climate').innerHTML = CLIM.map(([k, n]) => `<button class="chip" data-c="${k}" aria-pressed="${st.clim === k}">${n}</button>`).join('');
    $('presets').innerHTML = PRESETS.length ? '<span class="why" style="align-self:center">Ready-made sets:</span>' + PRESETS.map((p, i) => `<button class="chip ghost" data-p="${i}">${esc(p.name)}</button>`).join('') : '';
  }
  const GROUPS = [['Jackets & cardigans', x => x.cat === 'layer'], ['Shirts & tops', x => x.cat === 'top'], ['Trousers & skirts', x => x.cat === 'bottom'], ['Dresses', x => x.cat === 'dress']];
  function renderPickers() {
    $('pickers').innerHTML = GROUPS.map(([g, fn]) => {
      const list = I.filter(fn).filter(x => st.showOff || x.seasons.includes(st.clim) || st.sel.has(x.id));
      if (!list.length) return '';
      return `<div class="group"><h3>${g}</h3><div class="picks">${list.map(x =>
        `<button class="pick" data-id="${x.id}" aria-pressed="${st.sel.has(x.id)}"><span class="sw" style="${fabStyle(x)}"></span><span>${esc(x.name)}</span><span class="tick">✓</span></button>`).join('')}</div></div>`;
    }).join('');
  }
  function looksNow() {
    let L = generate([...st.sel], st.clim);
    if (st.occ) L = L.filter(o => o.lo <= st.occ && st.occ <= o.hi);
    if (st.role) L = L.filter(o => o.roles.includes(st.role));
    const r = n => st.jit ? Math.sin(n * 9301 + st.jit * 49297) * 0.9 : 0;
    L.forEach((o, i) => { o.rank = o.s + r(i + o.key.length); });
    return L.sort((a, b) => b.rank - a.rank);
  }
  const pl = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  function renderResults() {
    const L = looksNow();
    $('count').innerHTML = `<b>${L.length}</b> ${L.length === 1 ? 'outfit' : 'outfits'} from ${pl(st.sel.size, 'piece', 'pieces')}`;
    $('occ').innerHTML = [[0, 'All'], [1, 'City'], [2, 'Work'], [3, 'Evening']].map(([k, n]) => `<button class="chip" data-o="${k}" aria-pressed="${st.occ === k}">${n}</button>`).join('');
    $('role').innerHTML = ROLES.map(([k, n]) => `<button class="chip ghost" data-r="${k}" aria-pressed="${st.role === k}">${n}</button>`).join('');
    $('results').innerHTML = L.length ? L.slice(0, st.limit).map(o => card(o)).join('') : '<p class="empty">No outfits yet from this selection. Add at least one top and one bottom, or a dress.</p>';
    $('more').hidden = L.length <= st.limit;
  }
  function plan() {
    const L = looksNow(), n = Math.max(1, Math.min(21, +$('days').value || 1)), used = {}, out = [], taken = new Set();
    for (let d = 0; d < n; d++) {
      let best = null, bs = -1e9;
      for (const o of L) {
        if (taken.has(o.key)) continue;
        const pen = o.p.reduce((a, x) => a + (used[x.id] || 0), 0);
        const prev = out[out.length - 1], rep = prev && o.p.some(x => prev.p.includes(x)) ? 1.2 : 0;
        const sc = o.rank - pen * 1.4 - rep;
        if (sc > bs) { bs = sc; best = o; }
      }
      if (!best) break;
      taken.add(best.key); out.push(best); best.p.forEach(x => { used[x.id] = (used[x.id] || 0) + 1; });
    }
    $('planOut').innerHTML = out.map((o, i) => card(o, `Day ${i + 1}`)).join('');
    if (out.length < n && L.length) $('planOut').insertAdjacentHTML('beforeend', `<p class="empty">Enough for ${pl(out.length, 'day', 'days')} without repeats. Add a couple more pieces to cover the whole trip.</p>`);
  }
  const renderTrip = () => { renderClimate(); renderPickers(); renderResults(); };

  // ---------- by season ----------
  let bookSeason = 'ms', bookLimit = 12, bookRole = '';
  function renderBook() {
    $('seasons').innerHTML = [['su', 'Summer'], ['ms', 'Spring & autumn'], ['wi', 'Winter']].map(([k, n]) => `<button class="chip" data-s="${k}" aria-pressed="${bookSeason === k}">${n}</button>`).join('');
    $('broles').innerHTML = ROLES.map(([k, n]) => `<button class="chip ghost" data-br="${k}" aria-pressed="${bookRole === k}">${n}</button>`).join('');
    const rf = o => !bookRole || o.roles.includes(bookRole);
    const favs = FAV.map(f => evalOutfit(f.o, bookSeason)).filter(Boolean).filter(rf);
    const all = generate(I.map(x => x.id), bookSeason).filter(o => !o.fav).filter(rf).sort((a, b) => b.s - a.s);
    $('bookCount').textContent = `${favs.length + all.length} ${favs.length + all.length === 1 ? 'combination' : 'combinations'} from your wardrobe for this season.`;
    $('bookFav').innerHTML = favs.length ? favs.map(o => card(o)).join('') : '<p class="empty">No favourites for this season and role yet.</p>';
    $('bookMore').innerHTML = all.slice(0, bookLimit).map(o => card(o)).join('');
    $('bookMoreBtn').hidden = all.length <= bookLimit;
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.c) { st.clim = d.c; st.limit = 12; save(); renderTrip(); $('planOut').innerHTML = ''; }
    else if (d.p) { const p = PRESETS[+d.p]; st.clim = p.climate; st.sel = new Set(p.items); st.limit = 12; save(); renderTrip(); plan(); }
    else if (d.id) { st.sel.has(d.id) ? st.sel.delete(d.id) : st.sel.add(d.id); b.setAttribute('aria-pressed', st.sel.has(d.id)); save(); renderResults(); $('planOut').innerHTML = ''; }
    else if (d.o !== undefined) { st.occ = +d.o; st.limit = 12; renderResults(); }
    else if (d.r !== undefined) { st.role = d.r; st.limit = 12; renderResults(); $('planOut').innerHTML = ''; }
    else if (d.s) { bookSeason = d.s; bookLimit = 12; renderBook(); }
    else if (d.br !== undefined) { bookRole = d.br; bookLimit = 12; renderBook(); }
    else switch (b.id) {
      case 'all-on': I.filter(x => x.seasons.includes(st.clim)).forEach(x => st.sel.add(x.id)); save(); renderTrip(); break;
      case 'all-off': st.sel.clear(); save(); renderTrip(); $('planOut').innerHTML = ''; break;
      case 'show-off': st.showOff = !st.showOff; b.setAttribute('aria-pressed', st.showOff); renderPickers(); break;
      case 'more': st.limit += 12; renderResults(); break;
      case 'plan': plan(); break;
      case 'shuffle': st.jit = (st.jit + 1) % 997; renderResults(); plan(); break;
      case 'bookMoreBtn': bookLimit += 12; renderBook(); break;
      case 'tab-trip': case 'tab-book': {
        const t = b.id === 'tab-book';
        $('tab-trip').setAttribute('aria-selected', !t); $('tab-book').setAttribute('aria-selected', t);
        $('view-trip').hidden = t; $('view-book').hidden = !t; if (t) renderBook(); store.set('tab', t ? 1 : 0);
      }
    }
  });

  renderTrip();
  if (store.get('tab', 0) === 1) $('tab-book').click();
})();
