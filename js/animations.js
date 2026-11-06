/* ============================================================
 * LifeGoal — animations.js
 * Animasi GSAP: XP ring & bar, reveal kartu, toast, modal,
 * overlay level-up. Motion grammar: entrance <300ms ease-out,
 * exit lebih cepat, partikel hanya di momen langka.
 * Degradasi anggun tanpa GSAP / reduced-motion.
 *
 * Catatan: reveal kartu sengaja TIDAK pakai ScrollTrigger —
 * kartu yang sudah berada di atas garis viewport saat render
 * tidak pernah memicu onEnter dan tetap opacity 0. Tween
 * langsung menjamin kartu selalu terlihat di posisi scroll mana pun.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const g = window.gsap;
  const reduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(n) {
    return n.toLocaleString('id-ID');
  }

  function makeSparks(host, count) {
    const sparks = [];
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      host.appendChild(s);
      sparks.push({
        el: s,
        angle: Math.random() * Math.PI * 2,
        dist: 36 + Math.random() * 64,
        delay: 0.15 + Math.random() * 0.3,
      });
    }
    return sparks;
  }

  G.anim = {
    /* ---------- Intro kartu pemain ---------- */
    heroIntro() {
      if (!g || reduced) return;
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .from('.topbar', { y: -14, opacity: 0, duration: 0.35 })
        .from('.player', { y: 16, opacity: 0, duration: 0.4 }, '-=0.15')
        .from('.ring-label', { scale: 0.7, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2')
        .from('.stat', { scale: 0.85, opacity: 0, stagger: 0.05, duration: 0.3 }, '-=0.15');
    },

    /* ---------- XP ring (stroke-dashoffset) ---------- */
    ringTo(el, pct) {
      const offset = G.RING_CIRC * (1 - Math.min(Math.max(pct, 0), 1));
      if (!g || reduced) {
        el.style.strokeDashoffset = offset;
        return;
      }
      gsap.to(el, { strokeDashoffset: offset, duration: 0.9, ease: 'power3.out', overwrite: true });
    },

    /* ---------- XP bar ---------- */
    xpTo(el, pct) {
      if (!g || reduced) {
        el.style.width = pct + '%';
        return;
      }
      gsap.to(el, { width: pct + '%', duration: 0.9, ease: 'power3.out', overwrite: true });
    },

    /* ---------- Angka berjalan ---------- */
    countTo(el, from, to, suffix) {
      const text = (v) => fmt(v) + (suffix || '');
      if (!el) return;
      if (!g || reduced) {
        el.textContent = text(to);
        return;
      }
      const obj = { v: from };
      gsap.to(obj, {
        v: to,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => (el.textContent = text(Math.round(obj.v))),
      });
    },

    /* ---------- Reveal kartu (langsung, tanpa scroll trigger) ---------- */
    cardsIn(grid) {
      const cards = grid.querySelectorAll('.card');
      if (!cards.length) return;
      if (!g || reduced) {
        cards.forEach((c) => (c.style.opacity = 1));
        return;
      }
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'transform',
        }
      );
    },

    /* ---------- Toast (momen langka: unlock / tambah / edit) ---------- */
    toast(caption, title, xpText) {
      const region = document.getElementById('toastRegion');
      const t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML =
        '<span class="toast-icon">' + G.icon('trophy') + '</span>' +
        '<span><span class="toast-caption">' + caption + '</span>' +
        '<span class="toast-title" style="display:block">' + escHtml(title) + '</span></span>' +
        (xpText ? '<span class="toast-xp">' + xpText + '</span>' : '');
      region.appendChild(t);

      if (!g) {
        setTimeout(() => t.remove(), 2600);
        return;
      }

      gsap.set(t, { xPercent: -50 });
      const tl = gsap.timeline({ onComplete: () => t.remove() });
      tl.fromTo(
        t,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
      );

      if (!reduced) {
        makeSparks(t, 10).forEach((sp) => {
          tl.fromTo(
            sp.el,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: Math.cos(sp.angle) * sp.dist,
              y: Math.sin(sp.angle) * sp.dist - 20,
              opacity: 0,
              scale: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            sp.delay
          );
        });
      }
      tl.to(t, { y: -60, opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=1.9');
    },

    /* ---------- Modal ---------- */
    openModal(backdrop, modal) {
      backdrop.hidden = false;
      if (!g || reduced) return;
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        modal,
        { scale: 0.96, y: 12, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
    },

    closeModal(backdrop) {
      if (!g || reduced) {
        backdrop.hidden = true;
        return;
      }
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.16,
        onComplete: () => (backdrop.hidden = true),
      });
    },

    popModal(modal) {
      if (!g || reduced) return;
      gsap.fromTo(modal, { scale: 0.98 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
    },

    /* ---------- Overlay level-up (momen langka) ---------- */
    levelUp(lvl) {
      const overlay = document.getElementById('levelUp');
      overlay.innerHTML =
        '<div class="lv-flash"></div>' +
        '<div class="lv-stack">' +
        '<div class="lv-ring"></div>' +
        '<div class="lv-trophy">' + G.icon('trophy') + '</div>' +
        '<p class="lv-caption">Naik Level</p>' +
        '<h2 class="lv-title">LEVEL ' + lvl.level + '</h2>' +
        '<p class="lv-sub">' + lvl.title + '</p>' +
        '</div>';
      overlay.hidden = false;

      const finish = () => {
        overlay.hidden = true;
        overlay.innerHTML = '';
      };

      if (!g) {
        setTimeout(finish, 2400);
        return;
      }

      gsap.set(overlay, { opacity: 1 });
      const ring = overlay.querySelector('.lv-ring');
      gsap.set(ring, { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(
        overlay.querySelector('.lv-flash'),
        { opacity: 0 },
        { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 }
      )
        .fromTo(
          ring,
          { scale: 0.3, opacity: 0.7 },
          { scale: 1.4, opacity: 0, duration: 1, ease: 'power2.out' },
          0.08
        )
        .fromTo(
          overlay.querySelector('.lv-trophy'),
          { y: '-40vh', scale: 0.7 },
          { y: 0, scale: 1, duration: 0.7, ease: 'bounce.out' },
          0.12
        )
        .fromTo(
          overlay.querySelector('.lv-caption'),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3 },
          0.45
        )
        .fromTo(
          overlay.querySelector('.lv-title'),
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' },
          0.45
        )
        .fromTo(
          overlay.querySelector('.lv-sub'),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3 },
          0.6
        );

      if (!reduced) {
        makeSparks(overlay.querySelector('.lv-stack'), 18).forEach((sp) => {
          tl.fromTo(
            sp.el,
            { x: 0, y: 0, opacity: 1, scale: 1.4 },
            {
              x: Math.cos(sp.angle) * sp.dist,
              y: Math.sin(sp.angle) * sp.dist,
              opacity: 0,
              scale: 0,
              duration: 0.9,
              ease: 'power2.out',
            },
            0.5 + sp.delay * 0.4
          );
        });
      }

      tl.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=1.1');
    },
  };

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }
})(window.LIFEGOAL);
