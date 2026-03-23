/* ============================================================
   FORMA Magazine — Intérieur / script.js
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

  document.querySelectorAll('.read-link').forEach(btn => {
    btn.addEventListener('click', () => openArticle(btn.dataset.title, btn.dataset.rt));
  });

  document.querySelectorAll('.art-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.querySelector('.c-title').textContent.trim();
      const rt    = card.querySelector('.c-rt').textContent.replace(' min', '').trim();
      openArticle(title, rt);
    });
  });

  document.querySelectorAll('.trend-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.t-title').textContent.trim();
      openArticle(title, '5');
    });
  });

  document.querySelectorAll('.ep-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.ep-ttl').textContent.trim();
      const rt    = card.querySelector('.ep-rt').textContent.replace(' min', '').trim();
      openArticle(title, rt);
    });
  });

  document.querySelectorAll('.ff-link').forEach(btn => {
    btn.addEventListener('click', () => openArticle(btn.dataset.title, btn.dataset.rt));
  });

  document.getElementById('articleSubBtn').addEventListener('click', () => {
    closeOverlay('articleOverlay');
    openOverlay('subOverlay');
  });

  // ─── MODAL ABONNEMENT ────────────────────────────────────
  function openSub() { openOverlay('subOverlay'); }

  document.getElementById('btnAbonner').addEventListener('click', openSub);

  ['planMensuel', 'planAnnuel'].forEach(id => {
    document.getElementById(id).addEventListener('click', function () {
      document.querySelectorAll('.sub-plan').forEach(p => p.classList.remove('sub-plan--selected'));
      this.classList.add('sub-plan--selected');
    });
  });

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
  const nlForm  = document.querySelector('.nl-form');
  const nlEmail = document.querySelector('.nl-inp');
  const nlBtn   = document.querySelector('.nl-btn');

  if (nlBtn && nlEmail) {
    const nlConfirm = document.createElement('p');
    nlConfirm.className = 'nl-confirm';
    nlConfirm.textContent = '✓ Vous êtes inscrit·e !';
    nlConfirm.style.display = 'none';
    nlForm.parentNode.insertBefore(nlConfirm, nlForm.nextSibling);

    nlBtn.addEventListener('click', () => {
      if (!nlEmail.value.trim().includes('@')) {
        nlEmail.focus();
        nlEmail.style.borderColor = 'rgba(255,69,0,0.8)';
        return;
      }
      nlEmail.style.borderColor = '';
      nlBtn.textContent = '…';
      nlBtn.disabled = true;
      setTimeout(() => {
        nlForm.style.display = 'none';
        nlConfirm.style.display = 'block';
      }, 600);
    });
    nlEmail.addEventListener('keydown', e => {
      if (e.key === 'Enter') nlBtn.click();
    });
  }

  // ─── FILTRES ─────────────────────────────────────────────
  const allFilterBtns = document.querySelectorAll('.fb-btn');

  // Construire data-tags depuis les ctag de chaque carte
  document.querySelectorAll('.art-card').forEach(card => {
    const tags = [...card.querySelectorAll('.ctag')].map(t => t.textContent.trim()).join(' ');
    card.dataset.tags = tags;
  });

  function applyFilter(label) {
    document.querySelectorAll('.art-card').forEach(card => {
      const show = label === 'Tout voir' || (card.dataset.tags || '').includes(label);
      card.style.display = show ? '' : 'none';
    });
  }

  allFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      allFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.textContent.trim());
    });
  });

  // Tag pills
  document.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const label = pill.textContent.trim();
      const match = [...allFilterBtns].find(b => b.textContent.trim() === label);
      if (match) {
        allFilterBtns.forEach(b => b.classList.remove('active'));
        match.classList.add('active');
        applyFilter(label);
        document.querySelector('.filter-bar').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        showToast('"' + label + '" — bientôt disponible');
      }
    });
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
