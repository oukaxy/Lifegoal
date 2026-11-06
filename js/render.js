/* ============================================================
 * LifeGoal — render.js
 * Menggambar: filter, grid kartu, hero stats, dan modal detail
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const filterState = { cat: 'all', rarity: 'all' };
  let shownXp = 0;
  let currentModalId = null;

  /* ---------- Util DOM ---------- */
  const $ = (sel) => document.querySelector(sel);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function fmt(n) {
    return n.toLocaleString('id-ID');
  }

  /* ---------- Kartu ---------- */
  function cardHTML(a) {
    const unlocked = G.state.isUnlocked(a.id);
    const cat = G.CATEGORIES[a.cat];
    const rar = G.RARITIES[a.rarity];
    const stateCls = unlocked ? 'is-unlocked' : 'is-locked';
    const status = unlocked
      ? '<span class="card-status is-done">✓ Tercapai</span>'
      : '<span class="card-status">🔒 Terkunci</span>';

    return (
      '<article class="card ' + stateCls + '" data-id="' + a.id + '" tabindex="0" role="button"' +
      ' style="--rc:' + rar.color + '" aria-label="' + esc(a.title) + (unlocked ? ' (tercapai)' : '') + '">' +
      '<div class="card-top">' +
      '<div class="glyph"><span class="glyph-icon">' + a.icon + '</span></div>' +
      '<div class="card-badges">' +
      '<span class="badge badge-rarity">' + rar.label + '</span>' +
      '<span class="badge badge-cat">' + cat.icon + ' ' + cat.name + '</span>' +
      '</div>' +
      '</div>' +
      '<h3 class="card-title">' + a.title + '</h3>' +
      '<p class="card-desc">' + a.desc + '</p>' +
      '<div class="card-foot">' +
      '<span class="xp-pill">+' + fmt(a.xp) + ' XP</span>' +
      status +
      '</div>' +
      (unlocked ? '<span class="seal" aria-hidden="true">✓</span>' : '<span class="lock-dot" aria-hidden="true">🔒</span>') +
      '</article>'
    );
  }

  /* ---------- Grid & filter ---------- */
  function buildFilters() {
    const catRow = $('#catFilters');
    const rarRow = $('#rarityFilters');

    const catBtn = (key, icon, label, count) =>
      '<button class="chip' + (filterState.cat === key ? ' is-active' : '') + '" data-cat="' + key + '">' +
      icon + ' ' + label + ' <span class="count">' + count + '</span></button>';

    let catHtml = catBtn('all', '⚜', 'Semua', G.ACHIEVEMENTS.length);
    Object.keys(G.CATEGORIES).forEach((key) => {
      const c = G.CATEGORIES[key];
      const n = G.ACHIEVEMENTS.filter((a) => a.cat === key).length;
      catHtml += catBtn(key, c.icon, c.name, n);
    });
    catRow.innerHTML = catHtml;

    const rarBtn = (key, label, color, count) =>
      '<button class="chip' + (filterState.rarity === key ? ' is-active' : '') + '" data-rarity="' + key + '">' +
      '<i class="dot" style="--rc:' + color + '"></i> ' + label + ' <span class="count">' + count + '</span></button>';

    let rarHtml = rarBtn('all', 'Semua', '#c9a227', G.ACHIEVEMENTS.length);
    Object.keys(G.RARITIES).forEach((key) => {
      const r = G.RARITIES[key];
      const n = G.ACHIEVEMENTS.filter((a) => a.rarity === key).length;
      rarHtml += rarBtn(key, r.label, r.color, n);
    });
    rarRow.innerHTML = rarHtml;
  }

  function setFilter(kind, value) {
    filterState[kind] = value;
    renderGrid();
    buildFilters();
  }

  function filtered() {
    return G.ACHIEVEMENTS.filter(
      (a) =>
        (filterState.cat === 'all' || a.cat === filterState.cat) &&
        (filterState.rarity === 'all' || a.rarity === filterState.rarity)
    );
  }

  function renderGrid() {
    const grid = $('#grid');
    const list = filtered();
    const done = list.filter((a) => G.state.isUnlocked(a.id)).length;

    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<p class="empty">Tidak ada pencapaian pada kombinasi filter ini.</p>';

    $('#boardCount').textContent =
      fmt(list.length) + ' catatan · ' + fmt(done) + ' tercapai';

    G.anim.cardsIn(grid);
    G.anim.bindCardHover(grid);
  }

  /* ---------- Hero ---------- */
  function buildStats() {
    const total = G.ACHIEVEMENTS.length;
    $('#statRow').innerHTML =
      '<span class="stat"><b id="statDone">0</b>/' + total + ' Tercapai</span>' +
      '<span class="stat">✦ <b id="statXp">0</b> XP Terkumpul</span>' +
      '<span class="stat">★ <b id="statLeg">0</b> Legendaris</span>';
  }

  function updateHero() {
    const xp = G.state.totalXp();
    const lvl = G.state.levelInfo();

    $('#levelChip').textContent =
      'Lv. ' + lvl.level + ' · ' + lvl.title + (lvl.isMax ? ' ✦ MAKS' : '');

    G.anim.xpTo($('#xpFill'), Math.round(lvl.pct * 100));

    $('#xpNumbers').textContent = lvl.isMax
      ? 'Level maksimum tercapai — ' + fmt(xp) + ' XP'
      : fmt(lvl.cur) + ' / ' + fmt(lvl.need) + ' XP ke level berikut';

    G.anim.countTo($('#statXp'), shownXp, xp, '');
    shownXp = xp;
    $('#statDone').textContent = fmt(G.state.unlockedCount());
    $('#statLeg').textContent = fmt(G.state.legendaryCount());
  }

  /* ---------- Modal ---------- */
  function modalHTML(a) {
    const unlocked = G.state.isUnlocked(a.id);
    const cat = G.CATEGORIES[a.cat];
    const rar = G.RARITIES[a.rarity];

    return (
      '<button class="modal-close" data-action="close" aria-label="Tutup">✕</button>' +
      '<div class="modal-head">' +
      '<div class="glyph glyph-lg"><span class="glyph-icon">' + a.icon + '</span></div>' +
      '<div>' +
      '<p class="modal-eyebrow" style="color:' + rar.color + '">' + rar.label + ' · ' + cat.icon + ' ' + cat.name + '</p>' +
      '<h3 class="modal-title" id="modalTitle">' + a.title + '</h3>' +
      '</div>' +
      '</div>' +
      '<p class="modal-desc">' + a.desc + '</p>' +
      '<div class="modal-foot">' +
      '<span class="modal-xp">+' + fmt(a.xp) + ' XP</span>' +
      '<button class="btn ' + (unlocked ? 'btn-ghost' : 'btn-primary') + '" data-action="toggle">' +
      (unlocked ? '↺ Batalkan Tanda' : '⚑ Tandai Tercapai') +
      '</button>' +
      '</div>' +
      (unlocked ? '<div class="stamp">TERCAPAI</div>' : '')
    );
  }

  function renderModal(id) {
    const a = G.ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return;
    $('#modal').innerHTML = modalHTML(a);
  }

  function openModal(id) {
    currentModalId = id;
    renderModal(id);
    G.anim.openModal($('#modalBackdrop'), $('#modal'));
  }

  function refreshModal() {
    if (currentModalId) {
      renderModal(currentModalId);
      G.anim.popModal($('#modal'));
    }
  }

  function closeModal() {
    currentModalId = null;
    G.anim.closeModal($('#modalBackdrop'));
  }

  /* ---------- Refresh menyeluruh ---------- */
  function fullRefresh() {
    renderGrid();
    updateHero();
    refreshModal();
  }

  G.render = {
    buildFilters,
    buildStats,
    renderGrid,
    updateHero,
    openModal,
    closeModal,
    setFilter,
    fullRefresh,
    get currentModalId() {
      return currentModalId;
    },
  };
})(window.LIFEGOAL);
