/* ============================================================
 * LifeGoal — state.js
 * Penyimpanan localStorage: nama, achievement custom,
 * status selesai, dan kalkulasi XP/level.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const KEY = 'lifegoal.state.v2';
  const DEFAULT_ICON = '⚑';

  function emptyState() {
    return { name: '', customs: [], unlocked: {}, seq: 0 };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p === 'object') {
          const s = emptyState();
          s.name = typeof p.name === 'string' ? p.name : '';
          s.customs = Array.isArray(p.customs) ? p.customs : [];
          s.unlocked = p.unlocked && typeof p.unlocked === 'object' ? p.unlocked : {};
          s.seq = Number.isInteger(p.seq) ? p.seq : s.customs.length;
          /* Buang unlock yang tidak merujuk achievement manapun (migrasi) */
          const ids = new Set(s.customs.map((a) => a.id));
          for (const id of Object.keys(s.unlocked)) {
            if (!ids.has(id)) delete s.unlocked[id];
          }
          return s;
        }
      }
    } catch (e) { /* localStorage tidak tersedia — pakai default */ }
    return emptyState();
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* noop */ }
  }

  function normalizeCustom(data) {
    const rarities = G.RARITIES;
    const rarity = rarities[data.rarity] ? data.rarity : 'biasa';
    let xp = Math.round(Number(data.xp));
    if (!Number.isFinite(xp)) xp = rarities[rarity].xp;
    xp = Math.min(5000, Math.max(10, xp || rarities[rarity].xp));
    const icon = (data.icon || DEFAULT_ICON).trim().slice(0, 4) || DEFAULT_ICON;
    return {
      title: String(data.title || '').trim().slice(0, 60),
      desc: String(data.desc || '').trim().slice(0, 200),
      cat: G.CATEGORIES[data.cat] ? data.cat : 'karier',
      rarity: rarity,
      xp: xp,
      icon: icon,
    };
  }

  function levelFromXp(xp) {
    const levels = G.LEVELS;
    let idx = 0;
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].xp) idx = i;
    }
    const base = levels[idx];
    const next = levels[idx + 1];
    const cur = xp - base.xp;
    const need = next ? next.xp - base.xp : 0;
    return {
      index: idx,
      level: idx + 1,
      title: base.title,
      cur: cur,
      need: need,
      pct: next ? cur / need : 1,
      isMax: !next,
    };
  }

  G.state = {
    /* ---------- Achievement custom ---------- */
    customs() {
      return state.customs;
    },

    get(id) {
      return state.customs.find((a) => a.id === id) || null;
    },

    addCustom(data) {
      const clean = normalizeCustom(data);
      if (!clean.title) return null;
      const achievement = Object.assign(
        { id: 'custom-' + Date.now().toString(36) + '-' + (state.seq++), createdAt: Date.now() },
        clean
      );
      state.customs.unshift(achievement); // terbaru di atas
      save();
      return achievement;
    },

    updateCustom(id, data) {
      const achievement = this.get(id);
      if (!achievement) return false;
      const clean = normalizeCustom(data);
      if (!clean.title) return false;
      Object.assign(achievement, clean);
      save();
      return true;
    },

    deleteCustom(id) {
      const i = state.customs.findIndex((a) => a.id === id);
      if (i === -1) return false;
      state.customs.splice(i, 1);
      delete state.unlocked[id];
      save();
      return true;
    },

    /* ---------- Status selesai ---------- */
    isUnlocked(id) {
      return !!state.unlocked[id];
    },

    toggle(id) {
      if (state.unlocked[id]) {
        delete state.unlocked[id];
        save();
        return false;
      }
      state.unlocked[id] = Date.now();
      save();
      return true;
    },

    /* ---------- Nama pemain ---------- */
    get name() {
      return state.name;
    },

    setName(name) {
      state.name = name;
      save();
    },

    /* ---------- Statistik ---------- */
    totalXp() {
      return state.customs.reduce(
        (sum, a) => sum + (state.unlocked[a.id] ? a.xp : 0),
        0
      );
    },

    unlockedCount() {
      return state.customs.filter((a) => state.unlocked[a.id]).length;
    },

    legendaryCount() {
      return state.customs.filter(
        (a) => a.rarity === 'legendaris' && state.unlocked[a.id]
      ).length;
    },

    levelInfo() {
      return levelFromXp(this.totalXp());
    },

    resetProgress() {
      state.unlocked = {};
      save();
    },
  };
})(window.LIFEGOAL);
