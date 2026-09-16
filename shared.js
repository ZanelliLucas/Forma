/* ============================================================
   FORMA Magazine — shared.js
   Chargé par toutes les pages (accueil comprise) :
   thème, progression, menu mobile, modales, filtres, newsletter
   Le thème sauvegardé est appliqué par un petit script dans <head>
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Stockage (localStorage peut être bloqué) ─────────────
  const store = {
    get(k)    { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // ── Toggle Light / Dark ────────────────────────────────
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html    = document.documentElement;
      const current = html.getAttribute('data-theme') || 'light';
      const next    = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      store.set('forma-theme', next);
    });
  }

  // ── Barre de progression au scroll ──────────────────────
  const bar = document.getElementById('progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const d   = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      bar.style.width = (max > 0 ? d.scrollTop / max * 100 : 0) + '%';
    }, { passive: true });
  }

  // ── Menu burger mobile ───────────────────────────────────
  const nav      = document.querySelector('nav');
  const navCats  = document.querySelector('.nav-cats');
  const navRight = document.querySelector('.nav-right');

  if (nav && navCats && navRight) {
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

  // ─── UTILITAIRES ─────────────────────────────────────────
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const text     = el => el ? el.innerText.replace(/\s+/g, ' ').trim() : '';
  const minutes  = el => el ? el.textContent.replace(/[^0-9]/g, '') : '';
  const slug     = s => s.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')      // supprime accents
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); // « Marché de l'art » → marche-de-l-art

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'forma-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-in'));
    setTimeout(() => {
      t.classList.remove('toast-in');
      setTimeout(() => t.remove(), 300);
    }, 2500);
  }

  // Validation e-mail + état « envoi » commun à tous les formulaires
  function bindEmailForm(input, button, onDone, delay) {
    if (!input || !button) return;
    const submit = () => {
      if (!EMAIL_RE.test(input.value.trim())) {
        input.focus();
        input.style.borderColor = 'var(--accent)';
        return;
      }
      input.style.borderColor = '';
      button.textContent = '…';
      button.disabled = true;
      setTimeout(onDone, delay);
    };
    button.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  // ─── MODALES ─────────────────────────────────────────────
  // Architecture et Intérieur ont leurs modales dans le HTML ;
  // les autres pages reçoivent la même structure ici.
  const section = text(document.querySelector('.sh-title'));

  if (!document.getElementById('articleOverlay')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-overlay" id="articleOverlay">
        <div class="modal-box">
          <button class="modal-close" data-close="article" aria-label="Fermer">✕</button>
          <div class="modal-inner">
            <p class="modal-eyebrow">${section ? section + ' — ' : ''}FORMA Magazine</p>
            <h2 class="modal-title" id="articleTitle">Titre</h2>
            <div class="modal-meta">
              <span>Mars 2026</span>
              <span class="modal-sep">·</span>
              <span id="articleRt">10 min de lecture</span>
            </div>
            <div class="modal-body">
              <p>Vous lisez un aperçu de cet article. Le contenu intégral — reportages, analyses et références — est réservé aux abonnés FORMA.</p>
              <p>FORMA est un magazine indépendant fondé en 2010, lu par des milliers de passionnés de design chaque mois.</p>
            </div>
            <button class="modal-cta" id="articleSubBtn">Lire l'article complet — S'abonner →</button>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="subOverlay">
        <div class="modal-box modal-wide">
          <button class="modal-close" data-close="sub" aria-label="Fermer">✕</button>
          <div class="modal-inner">
            <p class="modal-eyebrow">Rejoindre FORMA</p>
            <h2 class="modal-title">Choisissez votre formule</h2>
            <p class="modal-desc">Accès illimité aux articles, archives depuis 2010, newsletter hebdomadaire.</p>
            <div class="sub-plans">
              <div class="sub-plan" id="planMensuel">
                <p class="plan-name">Mensuel</p>
                <p class="plan-price">9 <span>€/mois</span></p>
                <ul>
                  <li>✓ Tous les articles</li>
                  <li>✓ Newsletter</li>
                  <li>✓ Application mobile</li>
                </ul>
              </div>
              <div class="sub-plan sub-plan--featured" id="planAnnuel">
                <p class="plan-name">Annuel <span class="plan-promo">−30%</span></p>
                <p class="plan-price">75 <span>€/an</span></p>
                <ul>
                  <li>✓ Tous les articles</li>
                  <li>✓ Newsletter</li>
                  <li>✓ Application mobile</li>
                  <li>✓ Archives complètes 2010–2026</li>
                  <li>✓ Magazine papier (12 numéros)</li>
                </ul>
              </div>
            </div>
            <div id="subFormWrap">
              <input class="modal-input" type="email" id="subEmail" placeholder="votre@email.com">
              <button class="modal-cta" id="subSubmit">Commencer mon abonnement →</button>
              <p class="sub-legal">Sans engagement · Résiliation en 1 clic · Paiement sécurisé</p>
            </div>
            <p class="sub-ok" id="subOk" style="display:none;">✓ Merci ! Un email de confirmation arrive dans votre boîte.</p>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="infoOverlay">
        <div class="modal-box">
          <button class="modal-close" data-close="info" aria-label="Fermer">✕</button>
          <div class="modal-inner">
            <p class="modal-eyebrow" id="infoEyebrow">FORMA</p>
            <h2 class="modal-title" id="infoTitle"></h2>
            <div class="modal-body" id="infoBody"></div>
          </div>
        </div>
      </div>`);
  }

  const OVERLAYS = { article: 'articleOverlay', sub: 'subOverlay', info: 'infoOverlay' };

  function openOverlay(id) {
    document.getElementById(id).style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = '';
  }

  // Fermer en cliquant le fond, le bouton ✕ ou Échap
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeOverlay(overlay.id);
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeOverlay(OVERLAYS[btn.dataset.close]));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') Object.values(OVERLAYS).forEach(closeOverlay);
  });

  // ─── MODAL ARTICLE ───────────────────────────────────────
  function openArticle(title, rt) {
    document.getElementById('articleTitle').textContent = title;
    document.getElementById('articleRt').textContent = (rt || '10') + ' min de lecture';
    openOverlay('articleOverlay');
  }

  function bindArticle(selector, getInfo) {
    document.querySelectorAll(selector).forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', e => {
        e.preventDefault();
        const info = getInfo(el);
        openArticle(info.title, info.rt);
      });
    });
  }

  // À la Une
  bindArticle('.read-link', el => ({
    title: el.dataset.title || text(document.querySelector('.feat-title')),
    rt:    el.dataset.rt    || minutes([...document.querySelectorAll('.feat-meta .mdate')].pop())
  }));
  // Dossier du mois
  bindArticle('.ff-link', el => ({
    title: el.dataset.title || text(el.closest('.full-feat').querySelector('.ff-title')),
    rt:    el.dataset.rt    || '16'
  }));
  // Cartes, tendances, sélection rédac', à la une de l'accueil
  bindArticle('.art-card',     el => ({ title: text(el.querySelector('.c-title')),    rt: minutes(el.querySelector('.c-rt')) }));
  bindArticle('.trend-item',   el => ({ title: el.dataset.title || text(el.querySelector('.t-title')), rt: el.dataset.rt || '5' }));
  bindArticle('.ep-card',      el => ({ title: text(el.querySelector('.ep-ttl')),     rt: minutes(el.querySelector('.ep-rt')) }));
  bindArticle('.sp-side-card', el => ({ title: text(el.querySelector('.sp-s-title')), rt: minutes(el.querySelector('.sp-s-rt')) }));

  // ─── MODAL ABONNEMENT ────────────────────────────────────
  function openSub() { openOverlay('subOverlay'); }

  document.querySelectorAll('.btn-sub').forEach(btn => btn.addEventListener('click', openSub));

  document.getElementById('articleSubBtn').addEventListener('click', () => {
    closeOverlay('articleOverlay');
    openSub();
  });

  document.querySelectorAll('.sub-plan').forEach(plan => {
    plan.addEventListener('click', () => {
      document.querySelectorAll('.sub-plan').forEach(p => p.classList.remove('sub-plan--selected'));
      plan.classList.add('sub-plan--selected');
    });
  });

  bindEmailForm(document.getElementById('subEmail'), document.getElementById('subSubmit'), () => {
    document.getElementById('subFormWrap').style.display = 'none';
    document.getElementById('subOk').style.display = 'block';
  }, 700);

  // ─── NEWSLETTER (sidebar + accueil) ──────────────────────
  document.querySelectorAll('.nl-form').forEach(form => {
    let confirm = form.nextElementSibling;
    if (!confirm || !confirm.classList.contains('nl-confirm')) {
      confirm = document.createElement('p');
      confirm.className = 'nl-confirm';
      confirm.textContent = '✓ Vous êtes inscrit·e !';
      confirm.style.display = 'none';
      form.after(confirm);
    }
    bindEmailForm(form.querySelector('.nl-inp'), form.querySelector('.nl-btn'), () => {
      form.style.display = 'none';
      confirm.style.display = 'block';
    }, 600);
  });

  // ─── FOOTER LIENS ────────────────────────────────────────
  const infoContent = {
    archives: {
      eyebrow: 'Archives',
      title: '16 ans d\'archives FORMA',
      body: '<p>Plus de <strong>700 articles</strong>, 48 numéros et des centaines d\'interviews disponibles depuis 2010.</p><p>L\'accès aux archives complètes est réservé aux abonnés annuels.</p>'
    },
    equipe: {
      eyebrow: 'L\'équipe',
      title: 'Qui fait FORMA ?',
      body: '<p><strong>Sophie Beaumont</strong><br>Rédactrice en chef · Architecture</p><p><strong>Marc Delacroix</strong><br>Rédacteur · Photographie &amp; Design</p><p><strong>Yuna Kim</strong><br>Rédactrice · Art &amp; Culture numérique</p><p><strong>Alex Morin</strong><br>Rédacteur · Marques &amp; Identités</p><p><strong>Emma Torres</strong><br>Rédactrice · Typographie &amp; Web</p><p><strong>Kaito Nakamura</strong><br>Rédacteur · Intérieur &amp; Matériaux</p>'
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Nous écrire',
      body: '<p><strong>Projet fictif</strong><br>FORMA est un magazine imaginaire réalisé pour un portfolio : les adresses ci-dessous sont des exemples et ne doivent pas être utilisées.</p><p><strong>Rédaction</strong><br>redaction@forma-magazine.fr</p><p><strong>Partenariats &amp; publicité</strong><br>partenaires@forma-magazine.fr</p><p><strong>Abonnements</strong><br>abo@forma-magazine.fr</p><p><strong>Adresse</strong><br>12 rue du Faubourg Saint-Antoine<br>75011 Paris, France</p>'
    },
    mentions: {
      eyebrow: 'Légal',
      title: 'Mentions légales',
      body: '<p><strong>Projet fictif</strong><br>FORMA est un magazine imaginaire réalisé pour un portfolio. L\'éditeur, le numéro RCS, l\'hébergeur et les noms ci-dessous sont fictifs, et aucune donnée saisie sur ce site n\'est collectée.</p><p><strong>Éditeur</strong><br>FORMA SAS — capital 50 000 €<br>RCS Paris B 123 456 789</p><p><strong>Directeur de publication</strong><br>Sophie Beaumont</p><p><strong>Hébergeur</strong><br>OVH SAS, 2 rue Kellermann, 59100 Roubaix</p>'
    },
    confidentialite: {
      eyebrow: 'Confidentialité',
      title: 'Protection des données',
      body: '<p><strong>Projet fictif</strong><br>Ce site est une démonstration réalisée pour un portfolio : aucun formulaire n\'envoie de données. Seul votre choix de thème clair/sombre est enregistré, dans votre navigateur. Le texte ci-dessous est un exemple.</p><p>FORMA collecte uniquement les données nécessaires à la gestion des abonnements et à l\'envoi de la newsletter.</p><p>Vos données ne sont jamais cédées à des tiers. Vous disposez d\'un droit d\'accès, de modification et de suppression conformément au RGPD.</p><p><strong>DPO :</strong> dpo@forma-magazine.fr</p>'
    },
    cgu: {
      eyebrow: 'CGU',
      title: 'Conditions générales',
      body: '<p>L\'utilisation du site FORMA Magazine implique l\'acceptation pleine des présentes conditions.</p><p>Tout le contenu publié est protégé par le droit d\'auteur © FORMA 2010–2026.</p><p>Toute reproduction sans autorisation écrite est interdite.</p>'
    }
  };
  const FOOTER_KEYS = {
    'Abonnement': 'abonnement', 'Archives': 'archives', 'Équipe': 'equipe', 'Contact': 'contact',
    'Mentions légales': 'mentions', 'Confidentialité': 'confidentialite', 'CGU': 'cgu'
  };

  document.querySelectorAll('.fcol a[href="#"]').forEach(link => {
    const key = link.dataset.modal || FOOTER_KEYS[link.textContent.trim()];
    if (!key) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      if (key === 'abonnement') { openSub(); return; }
      const c = infoContent[key];
      document.getElementById('infoEyebrow').textContent = c.eyebrow;
      document.getElementById('infoTitle').textContent   = c.title;
      document.getElementById('infoBody').innerHTML      = c.body;
      openOverlay('infoOverlay');
    });
  });

  // ─── FILTRES THÈMES ──────────────────────────────────────
  // Clé d'un bouton/pill : data-filter sinon son texte ; tags d'une carte :
  // data-tags + libellés .ctag, le tout normalisé par slug().
  const filterBtns = [...document.querySelectorAll('.fb-btn')];
  const cards      = [...document.querySelectorAll('.art-card')];
  const keyOf      = el => slug(el.dataset.filter || el.textContent);
  const isAll      = key => key === 'all' || key === 'tout-voir';

  if (filterBtns.length && cards.length) {
    const cardTags = new Map(cards.map(card => {
      const raw = (card.dataset.tags || '').split(/\s+/)
        .concat([...card.querySelectorAll('.ctag')].map(t => t.textContent));
      return [card, raw.map(slug).filter(Boolean)];
    }));

    let noResults = document.querySelector('.no-results');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = '<p>Aucun article pour ce thème pour l\'instant.</p>';
      cards[cards.length - 1].after(noResults);
    }
    noResults.style.display = 'none';

    const pills = [...document.querySelectorAll('.tag-pill')];
    const keys  = filterBtns.map(keyOf);

    function applyFilter(key) {
      let shown = 0;
      cards.forEach(card => {
        const show = isAll(key) || cardTags.get(card).includes(key);
        card.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      noResults.style.display = shown ? 'none' : 'flex';
      filterBtns.forEach(b => b.classList.toggle('active', keyOf(b) === key));
      pills.forEach(p => p.classList.toggle('pill-active', keyOf(p) === key));
    }

    filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(keyOf(btn))));

    // Pills : filtre si le thème existe, sinon « bientôt disponible »
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const key = keyOf(pill);
        if (keys.includes(key)) {
          applyFilter(key);
          document.querySelector('.filter-bar').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          showToast('"' + pill.textContent.trim() + '" — bientôt disponible');
        }
      });
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
  }, { threshold: 0.08 });

  document.querySelectorAll('.art-card, .ff-stat, .trend-item, .rub-card, .sp-side-card, .stat-item, .sp-main').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

});
