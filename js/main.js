/* ============================================================
 * LifeGoal — main.js
 * Bootstrap & event handling: klik kartu, modal, filter,
 * edit nama, toggle achievement, level-up.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  let levelIdx = 0;
  let lastXp = 0;

  /* ---------- Aksi toggle achievement ---------- */
  function toggleAchievement(id) {
    const achievement = G.ACHIEVEMENTS.find((x) => x.id === id);
    if (!achievement) return;

    const added = G.state.toggle(id);
    G.render.fullRefresh();

    if (added) {
      G.anim.showToast(achievement);
      const lvl = G.state.levelInfo();
      if (lvl.index > levelIdx) {
        levelIdx = lvl.index;
        window.setTimeout(() => G.anim.levelUp(lvl), 1100);
      }
    } else {
      levelIdx = G.state.levelInfo().index;
    }
    lastXp = G.state.totalXp();
  }

  /* ---------- Edit nama petualang ---------- */
  function initNameEditor() {
    const nameEl = $('#playerName');
    const saved = G.state.name;
    if (saved) nameEl.textContent = saved;

    nameEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nameEl.blur();
      }
    });

    nameEl.addEventListener('blur', () => {
      const text = nameEl.textContent.trim().slice(0, 40);
      nameEl.textContent = text || 'Petualang Tanpa Nama';
      G.state.setName(text);
    });
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    /* Filter */
    $('#catFilters').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-cat]');
      if (chip) G.render.setFilter('cat', chip.dataset.cat);
    });
    $('#rarityFilters').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-rarity]');
      if (chip) G.render.setFilter('rarity', chip.dataset.rarity);
    });

    /* Grid → modal (klik + keyboard) */
    $('#grid').addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card) G.render.openModal(card.dataset.id);
    });
    $('#grid').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.card');
      if (card) {
        e.preventDefault();
        G.render.openModal(card.dataset.id);
      }
    });

    /* Modal */
    $('#modal').addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (!action) return;
      if (action.dataset.action === 'close') {
        G.render.closeModal();
      } else if (action.dataset.action === 'toggle') {
        toggleAchievement(G.render.currentModalId);
      }
    });
    $('#modalBackdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) G.render.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') G.render.closeModal();
    });

    /* Reset */
    $('#resetBtn').addEventListener('click', () => {
      if (!window.confirm('Kosongkan semua tanda pencapaian?')) return;
      G.state.resetProgress();
      levelIdx = 0;
      lastXp = 0;
      G.render.fullRefresh();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    levelIdx = G.state.levelInfo().index;
    lastXp = G.state.totalXp();

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
