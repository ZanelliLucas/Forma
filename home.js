/* ============================================================
   FORMA Magazine — home.js
   Page d'accueil — même logique que shared.js mais paths adaptés
   ============================================================ */

// ── Thème : appliqué AVANT le rendu ──────────────────────
(function applyThemeEarly() {
  const saved = localStorage.getItem('forma-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  // ── Toggle Light / Dark ──────────────────────────────────
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html    = document.documentElement;
      const current = html.getAttribute('data-theme') || 'light';
      const next    = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('forma-theme', next);
    });
  }

  // ── Barre de progression ─────────────────────────────────
  const bar = document.getElementById('progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const d   = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight);
      bar.style.width = (pct * 100) + '%';
    }, { passive: true });
  }

  // ── Menu burger mobile ───────────────────────────────────
  const nav      = document.querySelector('nav');
  const navCats  = document.querySelector('.nav-cats');
  const navRight = document.querySelector('.nav-right');

  if (nav && navCats) {
    const burger = document.createElement('button');
    burger.className = 'btn-burger';
    burger.setAttribute('aria-label', 'Menu');
    burger.innerHTML = `<span></span><span></span><span></span>`;
    navRight.insertBefore(burger, navRight.firstChild);

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile';
    mobileMenu.innerHTML = navCats.innerHTML;
    document.body.appendChild(mobileMenu);

    let open = false;
    const toggleMenu = () => {
      open = !open;
      burger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { if (open) toggleMenu(); });
    });
  }

  // ── Scroll Reveal ────────────────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.rub-card, .sp-side-card, .stat-item, .sp-main').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
