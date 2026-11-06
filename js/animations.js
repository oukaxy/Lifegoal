/* ============================================================
 * LifeGoal — animations.js
 * Semua animasi GSAP: intro, scroll reveal, XP bar, toast,
 * modal, dan overlay level-up. Degradasi anggun tanpa GSAP.
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  const g = window.gsap;
  const reduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (g && window.ScrollTrigger) g.registerPlugin(window.ScrollTrigger);

  function fmt(n) {
    return n.toLocaleString('id-ID');
  }

  function makeSparks(host, count, size) {
    const sparks = [];
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      host.appendChild(s);
      sparks.push({
        el: s,
        angle: Math.random() * Math.PI * 2,
        dist: 40 + Math.random() * 70,
        delay: 0.2 + Math.random() * 0.35,
        scale: 0.5 + Math.random() * (size || 1),
      });
    }
    return sparks;
  }

  G.anim = {
    /* ---------- Intro hero ---------- */
    heroIntro() {
      if (!g || reduced) return;
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .from('.hero', { y: -26, opacity: 0, duration: 0.5 })
        .from(
          '.glyph-crest',
          { scale: 0.5, rotation: -10, opacity: 0, duration: 0.55, ease: 'back.out(1.7)' },
          '-=0.25'
        )
        .from('.hero-title', { letterSpacing: '0.55em', opacity: 0, duration: 0.6 }, '-=0.3')
        .from(
          '.player-row > *',
          { y: 14, opacity: 0, stagger: 0.08, duration: 0.4 },
          '-=0.35'
        )
        .from(
          '.stat-row .stat',
          { scale: 0.8, opacity: 0, stagger: 0.07, duration: 0.35, ease: 'back.out(2)' },
          '-=0.2'
        );
    },

    /* ---------- Scroll reveal kartu ---------- */
    cardsIn(grid) {
      const cards = grid.querySelectorAll('.card');
      if (!cards.length) return;
      if (g && window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.set(cards, { opacity: 0, y: 26 });
        window.ScrollTrigger.batch(cards, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.07,
              ease: 'power2.out',
              overwrite: true,
            }),
        });
        window.ScrollTrigger.refresh();
      } else {
        cards.forEach((c) => (c.style.opacity = 1));
      }
    },

    /* ---------- Hover kartu ---------- */
    bindCardHover(grid) {
      if (!g || reduced) return;
      grid.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('pointerenter', () =>
          gsap.to(card, { y: -6, scale: 1.02, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
        );
        card.addEventListener('pointerleave', () =>
          gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        );
      });
    },

    /* ---------- XP bar & angka ---------- */
    xpTo(fillEl, pct) {
      if (!g || reduced) {
        fillEl.style.width = pct + '%';
        return;
      }
      gsap.to(fillEl, { width: pct + '%', duration: 0.9, ease: 'power3.out' });
    },

    countTo(el, from, to, suffix) {
      const text = (v) => fmt(v) + (suffix || '');
      if (!g || reduced) {
        el.textContent = text(to);
        return;
      }
      const obj = { v: from };
      gsap.to(obj, {
        v: to,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = text(Math.round(obj.v))),
      });
    },

    /* ---------- Toast unlock ---------- */
    showToast(achievement) {
      const region = document.getElementById('toastRegion');
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML =
        '<div class="glyph glyph-sm"><span class="glyph-icon">' + achievement.icon + '</span></div>' +
        '<div class="toast-body">' +
        '<p class="toast-caption">Pencapaian Diperoleh!</p>' +
        '<p class="toast-title">' + achievement.title + '</p>' +
        '</div>' +
        '<span class="toast-xp">+' + fmt(achievement.xp) + ' XP</span>';
      region.appendChild(toast);

      if (!g) {
        setTimeout(() => toast.remove(), 2600);
        return;
      }

      gsap.set(toast, { xPercent: -50 });
      const tl = gsap.timeline({ onComplete: () => toast.remove() });
      tl.fromTo(
        toast,
        { y: -90, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );

      if (!reduced) {
        makeSparks(toast, 12).forEach((sp) => {
          tl.fromTo(
            sp.el,
            { x: 0, y: 0, opacity: 1, scale: sp.scale },
            {
              x: Math.cos(sp.angle) * sp.dist,
              y: Math.sin(sp.angle) * sp.dist - 24,
              opacity: 0,
              scale: 0,
              duration: 0.9,
              ease: 'power2.out',
            },
            sp.delay
          );
        });
      }
      tl.to(toast, { y: -70, opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=1.8');
    },

    /* ---------- Modal ---------- */
    openModal(backdrop, modal) {
      backdrop.hidden = false;
      if (!g || reduced) return;
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modal,
        { scale: 0.9, y: 18, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    },

    closeModal(backdrop) {
      if (!g || reduced) {
        backdrop.hidden = true;
        return;
      }
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => (backdrop.hidden = true),
      });
    },

    popModal(modal) {
      if (!g || reduced) return;
      gsap.fromTo(modal, { scale: 0.97 }, { scale: 1, duration: 0.25, ease: 'power2.out' });
    },

    /* ---------- Overlay level-up ---------- */
    levelUp(lvl) {
      const overlay = document.getElementById('levelUp');
      overlay.innerHTML =
        '<div class="lv-flash"></div>' +
        '<div class="lv-stack">' +
        '<div class="lv-ring"></div>' +
        '<div class="lv-crown">👑</div>' +
        '<div class="lv-text">' +
        '<p class="lv-caption">✦ Naik Level ✦</p>' +
        '<h2 class="lv-title">Level ' + lvl.level + '</h2>' +
        '<p class="lv-sub">' + lvl.title + '</p>' +
        '</div>' +
        '</div>';
      overlay.hidden = false;

      const finish = () => {
        overlay.hidden = true;
        overlay.innerHTML = '';
      };

      if (!g) {
        setTimeout(finish, 2500);
        return;
      }

      gsap.set(overlay, { opacity: 1 });
      const ring = overlay.querySelector('.lv-ring');
      gsap.set(ring, { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(
        overlay.querySelector('.lv-flash'),
        { opacity: 0 },
        { opacity: 1, duration: 0.16, yoyo: true, repeat: 1 }
      )
        .fromTo(
          ring,
          { scale: 0.2, opacity: 0.9 },
          { scale: 1.5, opacity: 0, duration: 1.1, ease: 'power2.out' },
          0.1
        )
        .fromTo(
          overlay.querySelector('.lv-crown'),
          { y: '-55vh', scale: 0.6 },
          { y: 0, scale: 1, duration: 0.8, ease: 'bounce.out' },
          0.15
        )
        .fromTo(
          overlay.querySelector('.lv-text'),
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' },
          0.55
        );

      if (!reduced) {
        makeSparks(overlay.querySelector('.lv-stack'), 20, 1.6).forEach((sp) => {
          tl.fromTo(
            sp.el,
            { x: 0, y: 0, opacity: 1, scale: sp.scale },
            {
              x: Math.cos(sp.angle) * sp.dist,
              y: Math.sin(sp.angle) * sp.dist,
              opacity: 0,
              scale: 0,
              duration: 1,
              ease: 'power2.out',
            },
            0.55 + sp.delay * 0.4
          );
        });
      }

      tl.to(overlay, { opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=1.2');
    },
  };
})(window.LIFEGOAL);
