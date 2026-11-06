/* ============================================================
 * LifeGoal — data.js
 * Kategori, rarity, level, dan konfigurasi form.
 * Semua achievement dibuat user (custom), tidak ada preset.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  /* ---------- Kategori ---------- */
  G.CATEGORIES = {
    karier:      { name: 'Karier',      icon: 'briefcase' },
    kesehatan:   { name: 'Kesehatan',   icon: 'heart' },
    keuangan:    { name: 'Keuangan',    icon: 'coins' },
    skill:       { name: 'Skill',       icon: 'book' },
    hubungan:    { name: 'Hubungan',    icon: 'users' },
    petualangan: { name: 'Petualangan', icon: 'map' },
  };

  /* ---------- Rarity + XP default ---------- */
  G.RARITIES = {
    biasa:      { label: 'Biasa',      color: '#94A3B8', xp: 100 },
    langka:     { label: 'Langka',     color: '#60A5FA', xp: 250 },
    epik:       { label: 'Epik',       color: '#C084FC', xp: 500 },
    legendaris: { label: 'Legendaris', color: '#F0B429', xp: 800 },
  };

  /* ---------- Level (ambang XP kumulatif) ---------- */
  G.LEVELS = [
    { xp: 0,    title: 'Pemula' },
    { xp: 200,  title: 'Petualang' },
    { xp: 500,  title: 'Penjelajah' },
    { xp: 900,  title: 'Ksatria' },
    { xp: 1400, title: 'Veteran' },
    { xp: 2000, title: 'Elit' },
    { xp: 2700, title: 'Master' },
    { xp: 3500, title: 'Grandmaster' },
    { xp: 4500, title: 'Legenda' },
  ];

  /* ---------- Pilihan emoji ikon kartu (konten user) ---------- */
  G.ICON_CHOICES = [
    '⚑', '⚔️', '💰', '📖', '🏰', '💎',
    '💍', '🏠', '💪', '🎓', '🏆', '🎯',
  ];

  /* ---------- Statistik ring XP ---------- */
  G.RING = { radius: 36, stroke: 8 }; // circumference = 2 * PI * r
  G.RING_CIRC = 2 * Math.PI * G.RING.radius;
})(window.LIFEGOAL);
