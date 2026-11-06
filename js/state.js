/* ============================================================
 * LifeGoal — state.js
 * Status pemain: achievement terbuka, nama, XP, level (localStorage)
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const KEY = 'lifegoal.state.v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { unlocked: parsed.unlocked || {}, name: parsed.name || '' };
        }
      }
    } catch (e) { /* localStorage tidak tersedia — pakai default */ }
    return { unlocked: {}, name: '' };
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* noop */ }
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
    isUnlocked(id) {
      return !!state.unlocked[id];
    },

    unlockedCount() {
      return Object.keys(state.unlocked).length;
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

    get name() {
      return state.name;
    },

    setName(name) {
      state.name = name;
      save();
    },

    totalXp() {
      return G.ACHIEVEMENTS.reduce(
        (sum, a) => sum + (state.unlocked[a.id] ? a.xp : 0),
        0
      );
    },

    legendaryCount() {
      return G.ACHIEVEMENTS.filter(
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
