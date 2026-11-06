/* ============================================================
 * LifeGoal — render.js
 * Menggambar: filter, grid kartu (atau empty state), kartu
 * pemain (XP ring), modal detail, dan modal form.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const filterState = { cat: 'all', rarity: 'all' };
  let modalMode = null; // null | 'detail' | 'form'
  let modalId = null;
  let selectedEmoji = '⚑';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function fmt(n) {
    return n.toLocaleString('id-ID');
  }

  /* ============================================================
   * FILTER
   * ============================================================ */
  function buildFilters() {
    const catRow = $('#catFilters');
    const rarRow = $('#rarityFilters');

    const catBtn = (key, icon, label, count) =>
      '<button class="chip' + (filterState.cat === key ? ' is-active' : '') + '" data-cat="' + key + '" role="tab" aria-selected="' + (filterState.cat === key) + '">' +
      G.icon(icon) + label + ' <span class="count">' + count + '</span></button>';

    let catHtml = catBtn('all', 'target', 'Semua', G.state.customs().length);
    Object.keys(G.CATEGORIES).forEach((key) => {
      const c = G.CATEGORIES[key];
      const n = G.state.customs().filter((a) => a.cat === key).length;
      catHtml += catBtn(key, c.icon, c.name, n);
    });
    catRow.innerHTML = catHtml;

    const rarBtn = (key, label, color, count) =>
      '<button class="chip' + (filterState.rarity === key ? ' is-active' : '') + '" data-rarity="' + key + '" role="tab" aria-selected="' + (filterState.rarity === key) + '">' +
      '<i class="dot" style="--rc:' + color + '"></i>' + label + ' <span class="count">' + count + '</span></button>';

    let rarHtml = rarBtn('all', 'Semua', '#F0B429', G.state.customs().length);
    Object.keys(G.RARITIES).forEach((key) => {
      const r = G.RARITIES[key];
      const n = G.state.customs().filter((a) => a.rarity === key).length;
      rarHtml += rarBtn(key, r.label, r.color, n);
    });
    rarRow.innerHTML = rarHtml;

    $('#filters').hidden = G.state.customs().length === 0;
  }

  function setFilter(kind, value) {
    filterState[kind] = value;
    renderGrid();
    buildFilters();
  }

  /* ============================================================
   * GRID
   * ============================================================ */
  function filtered() {
    return G.state.customs().filter(
      (a) =>
        (filterState.cat === 'all' || a.cat === filterState.cat) &&
        (filterState.rarity === 'all' || a.rarity === filterState.rarity)
    );
  }

  function cardHTML(a) {
    const unlocked = G.state.isUnlocked(a.id);
    const cat = G.CATEGORIES[a.cat];
    const rar = G.RARITIES[a.rarity];
    const status = unlocked
      ? '<span class="card-status is-done">' + G.icon('check') + 'Selesai</span>'
      : '<span class="card-status">' + G.icon('lock') + 'Terkunci</span>';

    return (
      '<button class="card ' + (unlocked ? 'is-done' : 'is-locked') + '" data-id="' + a.id + '"' +
      ' style="--rc:' + rar.color + '" aria-label="' + esc(a.title) + (unlocked ? ' (selesai)' : '') + '">' +
      '<span class="card-icon"><span>' + a.icon + '</span>' +
      (unlocked ? '' : '<span class="card-lock">' + G.icon('lock') + '</span>') +
      '</span>' +
      '<span class="card-main">' +
      '<span class="card-tags">' +
      '<span class="pill pill-rarity">' + rar.label + '</span>' +
      '<span class="pill pill-xp">+' + fmt(a.xp) + ' XP</span>' +
      '</span>' +
      '<span class="card-title">' + esc(a.title) + '</span>' +
      (a.desc ? '<span class="card-desc">' + esc(a.desc) + '</span>' : '') +
      '<span class="card-foot">' +
      '<span class="card-cat">' + G.icon(cat.icon) + cat.name + '</span>' +
      status +
      '</span>' +
      '</span>' +
      '</button>'
    );
  }

  function emptyHTML() {
    return (
      '<div class="empty-state">' +
      '<div class="empty-icon">' + G.icon('target') + '</div>' +
      '<h3>Papanmu masih kosong</h3>' +
      '<p>Pencapaian pertamamu menentukan arah. Buat satu quest kecil yang benar-benar bisa kamu kejar minggu ini.</p>' +
      '<button class="btn btn-accent" data-action="create">' + G.icon('plus') + 'Buat Pencapaian Pertama</button>' +
      '</div>'
    );
  }

  function renderGrid() {
    const grid = $('#grid');
    const list = filtered();
    const done = list.filter((a) => G.state.isUnlocked(a.id)).length;
    const hasAny = G.state.customs().length > 0;

    grid.innerHTML = !hasAny
      ? emptyHTML()
      : list.length
        ? list.map(cardHTML).join('')
        : '<div class="empty-state"><h3>Tidak ada yang cocok</h3><p>Tidak ada pencapaian pada kombinasi filter ini.</p></div>';

    $('#boardCount').textContent = hasAny
      ? fmt(list.length) + ' pencapaian · ' + fmt(done) + ' selesai'
      : '';

    G.anim.cardsIn(grid);
  }

  /* ============================================================
   * HERO / KARTU PEMAIN
   * ============================================================ */
  function buildStats() {
    const total = Math.max(G.state.customs().length, 0);
    $('#statRow').innerHTML =
      '<span class="stat"><b id="statDone">0</b>/' + total + ' selesai</span>' +
      '<span class="stat"><b id="statXp">0</b> XP</span>' +
      '<span class="stat"><b id="statLeg">0</b> legendaris</span>';
  }

  function updateHero() {
    const xp = G.state.totalXp();
    const lvl = G.state.levelInfo();
    const total = G.state.customs().length;

    $('#levelNum').textContent = lvl.level;
    $('#levelTitle').textContent = lvl.isMax
      ? lvl.title + ' ✦ Maks'
      : lvl.title;
    $('#playerName').textContent = G.state.name || 'Petualang';

    G.anim.ringTo($('#ringFill'), lvl.pct);
    G.anim.xpTo($('#xpFill'), Math.round(lvl.pct * 100));
    $('#xpNumbers').textContent = lvl.isMax
      ? fmt(xp) + ' XP — level maksimum'
      : fmt(lvl.cur) + ' / ' + fmt(lvl.need) + ' XP ke Lv.' + (lvl.level + 1);

    $('#statRow').innerHTML =
      '<span class="stat"><b>' + fmt(G.state.unlockedCount()) + '</b>/' + total + ' selesai</span>' +
      '<span class="stat"><b id="statXp">' + fmt(lastXp) + '</b> XP</span>' +
      '<span class="stat"><b>' + fmt(G.state.legendaryCount()) + '</b> legendaris</span>';
    G.anim.countTo($('#statXp'), lastXp, xp, '');
    lastXp = xp;
  }

  let lastXp = 0;

  /* ============================================================
   * MODAL DETAIL
   * ============================================================ */
  function detailHTML(a) {
    const unlocked = G.state.isUnlocked(a.id);
    const cat = G.CATEGORIES[a.cat];
    const rar = G.RARITIES[a.rarity];

    return (
      '<button class="modal-close" data-action="close" aria-label="Tutup">' + G.icon('close') + '</button>' +
      '<div class="detail-head" style="--rc:' + rar.color + '">' +
      '<span class="detail-icon">' + a.icon + '</span>' +
      '<span>' +
      '<span class="detail-tags">' +
      '<span class="pill pill-rarity">' + rar.label + '</span>' +
      '<span class="pill pill-xp">+' + fmt(a.xp) + ' XP</span>' +
      '</span>' +
      '<h3 class="detail-title">' + esc(a.title) + '</h3>' +
      '</span>' +
      '</div>' +
      '<p class="detail-desc">' +
      '<span class="card-cat" style="display:inline-flex">' + G.icon(cat.icon) + cat.name + '</span>' +
      (a.desc ? '<br>' + esc(a.desc) : '') +
      '</p>' +
      '<div class="detail-actions">' +
      '<button class="btn ' + (unlocked ? 'btn-ghost' : 'btn-accent') + '" data-action="toggle">' +
      G.icon(unlocked ? 'undo' : 'flag') + (unlocked ? 'Batalkan Tanda' : 'Tandai Selesai') +
      '</button>' +
      '<button class="btn btn-ghost" data-action="edit">' + G.icon('pencil') + 'Edit</button>' +
      '<button class="btn btn-danger" data-action="delete">' + G.icon('trash') + 'Hapus</button>' +
      '</div>'
    );
  }

  /* ============================================================
   * MODAL FORM
   * ============================================================ */
  function emojiGridHTML() {
    return G.ICON_CHOICES.map((e) =>
      '<button type="button" class="emoji-opt' + (e === selectedEmoji ? ' is-selected' : '') + '" data-emoji="' + e + '" aria-label="Ikon ' + e + '">' + e + '</button>'
    ).join('');
  }

  function formHTML(a) {
    const isEdit = !!a;
    selectedEmoji = a ? a.icon : '⚑';

    const catOptions = Object.keys(G.CATEGORIES).map((key) =>
      '<option value="' + key + '"' + (a && a.cat === key ? ' selected' : '') + '>' + G.CATEGORIES[key].name + '</option>'
    ).join('');
    const rarOptions = Object.keys(G.RARITIES).map((key) =>
      '<option value="' + key + '"' + ((a ? a.rarity : 'biasa') === key ? ' selected' : '') + '>' + G.RARITIES[key].label + '</option>'
    ).join('');

    return (
      '<button class="modal-close" data-action="close" aria-label="Tutup">' + G.icon('close') + '</button>' +
      '<h3 class="form-title">' + (isEdit ? 'Edit Pencapaian' : 'Buat Pencapaian') + '</h3>' +
      '<form id="achForm" data-mode="' + (isEdit ? 'edit' : 'create') + '" data-id="' + (a ? a.id : '') + '">' +
      '<div class="form-field"><label>Ikon</label>' +
      '<input type="hidden" id="fIcon" value="' + esc(selectedEmoji) + '">' +
      '<div class="emoji-grid" id="emojiGrid">' + emojiGridHTML() + '</div>' +
      '</div>' +
      '<div class="form-field" style="margin-top:12px"><label for="fTitle">Judul *</label>' +
      '<input type="text" id="fTitle" maxlength="60" required placeholder="cth: Lunas utang kartu kredit" value="' + (a ? esc(a.title) : '') + '"></div>' +
      '<div class="form-field" style="margin-top:12px"><label for="fDesc">Deskripsi</label>' +
      '<textarea id="fDesc" maxlength="200" placeholder="Detail atau syarat selesainya (opsional)">' + (a ? esc(a.desc) : '') + '</textarea></div>' +
      '<div class="form-grid" style="margin-top:12px">' +
      '<div class="form-field"><label for="fCat">Kategori</label><select id="fCat">' + catOptions + '</select></div>' +
      '<div class="form-field"><label for="fRarity">Rarity</label><select id="fRarity">' + rarOptions + '</select></div>' +
      '</div>' +
      '<div class="form-field" style="margin-top:12px"><label for="fXp">XP</label>' +
      '<input type="number" id="fXp" min="10" max="5000" step="10" value="' + (a ? a.xp : G.RARITIES.biasa.xp) + '"></div>' +
      '<div class="form-actions" style="margin-top:16px">' +
      '<button type="button" class="btn btn-ghost" data-action="close">Batal</button>' +
      '<button type="submit" class="btn btn-accent">' + G.icon('check') + (isEdit ? 'Simpan Perubahan' : 'Tambah ke Papan') + '</button>' +
      '</div>' +
      '</form>'
    );
  }

  /* ============================================================
   * MODAL CONTROL
   * ============================================================ */
  function openDetail(id) {
    const a = G.state.get(id);
    if (!a) return;
    modalMode = 'detail';
    modalId = id;
    $('#modal').innerHTML = detailHTML(a);
    G.anim.openModal($('#backdrop'), $('#modal'));
  }

  function openForm(id) {
    const a = id ? G.state.get(id) : null;
    modalMode = 'form';
    modalId = id || null;
    $('#modal').innerHTML = formHTML(a);
    G.anim.openModal($('#backdrop'), $('#modal'));
    const title = $('#fTitle');
    if (title && !a) title.focus();
  }

  function closeModal() {
    modalMode = null;
    modalId = null;
    G.anim.closeModal($('#backdrop'));
  }

  /* Render ulang konten modal (setelah toggle / edit tersimpan) */
  function refreshModal() {
    if (modalMode === 'detail' && modalId) {
      const a = G.state.get(modalId);
      if (a) $('#modal').innerHTML = detailHTML(a);
      G.anim.popModal($('#modal'));
    }
  }

  /* Dipanggil main.js */
  G.render = {
    buildFilters: buildFilters,
    buildStats: buildStats,
    renderGrid: renderGrid,
    updateHero: updateHero,
    openDetail: openDetail,
    openForm: openForm,
    closeModal: closeModal,
    setFilter: setFilter,
    refreshDetail: refreshModal,
    get modalMode() { return modalMode; },
    get modalId() { return modalId; },
    get selectedEmoji() { return selectedEmoji; },
    set selectedEmoji(v) { selectedEmoji = v; },
  };
})(window.LIFEGOAL);
