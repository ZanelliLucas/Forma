/* ============================================================
   FORMA Magazine — Architecture / script.js
   Logique interactive : filtres, modales, newsletter, toast
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── UTILITAIRES MODALES ─────────────────────────────────
  function openOverlay(id) {
    document.getElementById(id).style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = '';
  }

  // Fermer en cliquant le fond ou le bouton ✕
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay(overlay.id);
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const map = { article: 'articleOverlay', sub: 'subOverlay', info: 'infoOverlay' };
      closeOverlay(map[btn.dataset.close]);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['articleOverlay', 'subOverlay', 'infoOverlay'].forEach(closeOverlay);
      document.body.style.overflow = '';
    }
  });

  // ─── MODAL ARTICLE ───────────────────────────────────────
  function openArticle(title, rt) {
    document.getElementById('articleTitle').textContent = title;
    document.getElementById('articleRt').textContent = (rt || '10') + ' min de lecture';
    openOverlay('articleOverlay');
  }

  // Bouton À la Une
  document.querySelectorAll('.read-link').forEach(btn => {
    btn.addEventListener('click', () => openArticle(btn.dataset.title, btn.dataset.rt));
  });

  // Cartes articles — clic sur toute la carte
  document.querySelectorAll('.art-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.querySelector('.c-title').textContent.trim();
      const rt    = card.querySelector('.c-rt').textContent.replace(' min', '').trim();
      openArticle(title, rt);
    });
  });

  // Tendances sidebar
  document.querySelectorAll('.trend-item').forEach(item => {
    item.addEventListener('click', () => openArticle(item.dataset.title, item.dataset.rt));
  });

  // Bouton dossier du mois
  document.querySelectorAll('.ff-link').forEach(btn => {
    btn.addEventListener('click', () => openArticle(btn.dataset.title, btn.dataset.rt));
  });

  // Bouton "S'abonner pour lire" dans la modal article
  document.getElementById('articleSubBtn').addEventListener('click', () => {
    closeOverlay('articleOverlay');
    openOverlay('subOverlay');
  });

  // ─── MODAL ABONNEMENT ────────────────────────────────────
  function openSub() { openOverlay('subOverlay'); }

  document.getElementById('btnAbonner').addEventListener('click', openSub);

  // Sélection de plan
  ['planMensuel', 'planAnnuel'].forEach(id => {
    document.getElementById(id).addEventListener('click', function () {
      document.querySelectorAll('.sub-plan').forEach(p => p.classList.remove('sub-plan--selected'));
      this.classList.add('sub-plan--selected');
    });
  });

  // Soumission abonnement
  document.getElementById('subSubmit').addEventListener('click', () => {
    const email = document.getElementById('subEmail').value.trim();
    if (!email.includes('@')) {
      document.getElementById('subEmail').focus();
      document.getElementById('subEmail').style.borderColor = 'var(--accent)';
      return;
    }
    document.getElementById('subEmail').style.borderColor = '';
    document.getElementById('subSubmit').textContent = '…';
    document.getElementById('subSubmit').disabled = true;
    setTimeout(() => {
      document.getElementById('subFormWrap').style.display = 'none';
      document.getElementById('subOk').style.display = 'block';
    }, 700);
  });
  document.getElementById('subEmail').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('subSubmit').click();
  });

  // ─── NEWSLETTER SIDEBAR ──────────────────────────────────
  document.getElementById('nlSubmit').addEventListener('click', () => {
    const email = document.getElementById('nlEmail').value.trim();
    if (!email.includes('@')) {
      document.getElementById('nlEmail').focus();
      document.getElementById('nlEmail').style.borderColor = 'var(--accent)';
      return;
    }
    document.getElementById('nlEmail').style.borderColor = '';
    document.getElementById('nlSubmit').textContent = '…';
    document.getElementById('nlSubmit').disabled = true;
    setTimeout(() => {
      document.getElementById('nlForm').style.display = 'none';
      document.getElementById('nlConfirm').style.display = 'block';
    }, 600);
  });
  document.getElementById('nlEmail').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('nlSubmit').click();
  });

  // ─── FILTRES ─────────────────────────────────────────────
  const allFilterBtns = document.querySelectorAll('.fb-btn[data-filter]');
  const allCards      = document.querySelectorAll('.art-card[data-tags]');

  function applyFilter(tag) {
    let n = 0;
    allCards.forEach(card => {
      const show = tag === 'all' || card.dataset.tags.includes(tag);
      card.style.display = show ? '' : 'none';
      if (show) n++;
    });
    document.getElementById('noResults').style.display = n === 0 ? 'flex' : 'none';
    // Sync pills
    document.querySelectorAll('.tag-pill[data-filter]').forEach(p => {
      p.classList.toggle('pill-active', p.dataset.filter === tag);
    });
  }

  allFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      allFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  // Tag pills → filtre + scroll
  document.querySelectorAll('.tag-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      const f = pill.dataset.filter;
      allFilterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === f));
      applyFilter(f);
      document.querySelector('.filter-bar').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Tag pills sans filtre → toast
  document.querySelectorAll('.tag-pill.no-filter').forEach(pill => {
    pill.addEventListener('click', () => showToast('"' + pill.textContent + '" — bientôt disponible'));
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
      body: '<p><strong>Rédaction</strong><br>redaction@forma-magazine.fr</p><p><strong>Partenariats &amp; publicité</strong><br>partenaires@forma-magazine.fr</p><p><strong>Abonnements</strong><br>abo@forma-magazine.fr</p><p><strong>Adresse</strong><br>12 rue du Faubourg Saint-Antoine<br>75011 Paris, France</p>'
    },
    mentions: {
      eyebrow: 'Légal',
      title: 'Mentions légales',
      body: '<p><strong>Éditeur</strong><br>FORMA SAS — capital 50 000 €<br>RCS Paris B 123 456 789</p><p><strong>Directeur de publication</strong><br>Sophie Beaumont</p><p><strong>Hébergeur</strong><br>OVH SAS, 2 rue Kellermann, 59100 Roubaix</p>'
    },
    confidentialite: {
      eyebrow: 'Confidentialité',
      title: 'Protection des données',
      body: '<p>FORMA collecte uniquement les données nécessaires à la gestion des abonnements et à l\'envoi de la newsletter.</p><p>Vos données ne sont jamais cédées à des tiers. Vous disposez d\'un droit d\'accès, de modification et de suppression conformément au RGPD.</p><p><strong>DPO :</strong> dpo@forma-magazine.fr</p>'
    },
    cgu: {
      eyebrow: 'CGU',
      title: 'Conditions générales',
      body: '<p>L\'utilisation du site FORMA Magazine implique l\'acceptation pleine des présentes conditions.</p><p>Tout le contenu publié est protégé par le droit d\'auteur © FORMA 2010–2026.</p><p>Toute reproduction sans autorisation écrite est interdite.</p>'
    }
  };

  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const key = link.dataset.modal;
      if (key === 'abonnement') { openSub(); return; }
      const c = infoContent[key];
      if (!c) return;
      document.getElementById('infoEyebrow').textContent = c.eyebrow;
      document.getElementById('infoTitle').textContent   = c.title;
      document.getElementById('infoBody').innerHTML      = c.body;
      openOverlay('infoOverlay');
    });
  });

  // ─── TOAST ───────────────────────────────────────────────
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

});
