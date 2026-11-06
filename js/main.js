/* ============================================================
 * LifeGoal — main.js
 * Bootstrap & event: buka form/detail, submit form (create
 * & edit), hapus, toggle selesai, edit nama, reset.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  let levelIdx = 0;

  /* ---------- Kartu pemain ---------- */
  function initNameEditor() {
    const nameEl = $('#playerName');
    if (G.state.name) nameEl.textContent = G.state.name;

    nameEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nameEl.blur();
      }
    });

    nameEl.addEventListener('blur', () => {
      const text = nameEl.textContent.trim().slice(0, 40);
      nameEl.textContent = text || 'Petualang';
      G.state.setName(text);
    });
  }

  /* ---------- Aksi pencapaian ---------- */
  function toggleAchievement(id) {
    const a = G.state.get(id);
    if (!a) return;

    const added = G.state.toggle(id);
    refreshAll();
    G.render.refreshDetail();

    if (added) {
      G.anim.toast('Pencapaian Selesai', a.title, '+' + a.xp.toLocaleString('id-ID') + ' XP');
      const lvl = G.state.levelInfo();
      if (lvl.index > levelIdx) {
        levelIdx = lvl.index;
        window.setTimeout(() => G.anim.levelUp(lvl), 1000);
      }
    } else {
      levelIdx = G.state.levelInfo().index;
    }
  }

  function submitForm(form) {
    const mode = form.dataset.mode;
    const id = form.dataset.id;
    const data = {
      icon: G.render.selectedEmoji,
      title: $('#fTitle').value,
      desc: $('#fDesc').value,
      cat: $('#fCat').value,
      rarity: $('#fRarity').value,
      xp: $('#fXp').value,
    };

    let ok = false;
    if (mode === 'edit' && id) {
      ok = G.state.updateCustom(id, data);
      if (ok) G.anim.toast('Perubahan Disimpan', data.title.trim());
    } else {
      const created = G.state.addCustom(data);
      ok = !!created;
      if (created) G.anim.toast('Pencapaian Baru', created.title, '+' + created.xp.toLocaleString('id-ID') + ' XP');
    }

    if (!ok) return;
    levelIdx = Math.min(levelIdx, G.state.levelInfo().index);
    G.render.closeModal();
    refreshAll();
  }

  function deleteAchievement(id) {
    const a = G.state.get(id);
    if (!a) return;
    if (!window.confirm('Hapus "' + a.title + '" dari papan? Tanda selesainya juga ikut hilang.')) return;
    G.state.deleteCustom(id);
    levelIdx = G.state.levelInfo().index;
    G.render.closeModal();
    refreshAll();
  }

  /* ---------- Refresh menyeluruh ---------- */
  function refreshAll() {
    G.render.buildFilters();
    G.render.renderGrid();
    G.render.updateHero();
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    /* Buat pencapaian */
    $('#addBtn').addEventListener('click', () => G.render.openForm());

    /* Filter */
    $('#catFilters').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-cat]');
      if (chip) G.render.setFilter('cat', chip.dataset.cat);
    });
    $('#rarityFilters').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-rarity]');
      if (chip) G.render.setFilter('rarity', chip.dataset.rarity);
    });

    /* Grid: kartu → detail, empty state → form */
    $('#grid').addEventListener('click', (e) => {
      const createBtn = e.target.closest('[data-action="create"]');
      if (createBtn) {
        G.render.openForm();
        return;
      }
      const card = e.target.closest('.card');
      if (card) G.render.openDetail(card.dataset.id);
    });

    /* Modal: semua aksi lewat delegasi */
    $('#modal').addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (!action) return;
      switch (action.dataset.action) {
        case 'close':
          G.render.closeModal();
          break;
        case 'toggle':
          toggleAchievement(G.render.modalId);
          break;
        case 'edit':
          G.render.openForm(G.render.modalId);
          break;
        case 'delete':
          deleteAchievement(G.render.modalId);
          break;
        case 'create':
          G.render.openForm();
          break;
      }
    });

    /* Emoji picker + rarity → XP default */
    $('#modal').addEventListener('click', (e) => {
      const opt = e.target.closest('.emoji-opt');
      if (!opt) return;
      G.render.selectedEmoji = opt.dataset.emoji;
      $('#fIcon').value = opt.dataset.emoji;
      $('#modal').querySelectorAll('.emoji-opt').forEach((b) => {
        b.classList.toggle('is-selected', b === opt);
      });
    });

    $('#modal').addEventListener('change', (e) => {
      if (e.target.id === 'fRarity') {
        $('#fXp').value = G.RARITIES[e.target.value].xp;
      }
    });

    /* Submit form */
    $('#modal').addEventListener('submit', (e) => {
      if (e.target.id === 'achForm') {
        e.preventDefault();
        submitForm(e.target);
      }
    });

    /* Backdrop & Esc menutup modal */
    $('#backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) G.render.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') G.render.closeModal();
    });

    /* Reset tanda selesai */
    $('#resetBtn').addEventListener('click', () => {
      if (!window.confirm('Kosongkan semua tanda selesai? Pencapaiannya tetap ada di papan.')) return;
      G.state.resetProgress();
      levelIdx = G.state.levelInfo().index;
      refreshAll();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    levelIdx = G.state.levelInfo().index;

    $('#addBtn').innerHTML = G.icon('plus');
    initNameEditor();
    G.render.buildStats();
    G.render.buildFilters();
    G.render.renderGrid();
    G.render.updateHero();
    G.anim.heroIntro();
    bindEvents();
  }

  init();
})(window.LIFEGOAL);
