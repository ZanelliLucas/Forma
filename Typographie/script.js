/* ============================================================
   FORMA Magazine — Typographie / script.js
   ============================================================ */

// ── Barre de progression au scroll ────────────────────────
(function initProgressBar() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const d = document.documentElement;
    const scrolled = d.scrollTop / (d.scrollHeight - d.clientHeight);
    bar.style.width = (scrolled * 100) + '%';
  });
})();

// ── Toggle Light / Dark ────────────────────────────────────
(function initThemeToggle() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const KEY  = 'forma-theme';
  if (!btn) return;

  const saved = localStorage.getItem(KEY);
  if (saved) html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'light';
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
  });
})();

// ── Filtres thèmes ─────────────────────────────────────────
(function initFilters() {
  const buttons = document.querySelectorAll('.fb-btn');
  const cards   = document.querySelectorAll('.art-card[data-tags]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Mettre à jour le bouton actif
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.textContent.trim().toLowerCase();

      cards.forEach(card => {
        const tags = card.dataset.tags || '';

        if (filter === 'tout voir' || tags.split(' ').includes(filter)) {
          // Afficher
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          // Masquer avec transition
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            if (btn.classList.contains('active') &&
                !tags.split(' ').includes(btn.textContent.trim().toLowerCase())) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
})();

// ── Scroll Reveal ──────────────────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.art-card, .ff-stat, .trend-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
