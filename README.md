# FORMA — magazine de design (projet fictif)

Site vitrine d'un magazine imaginaire consacré au design, à l'architecture et aux arts visuels, réalisé pour mon portfolio.

**Voir le site :** https://zanellilucas.github.io/Forma/ · https://forma-lilac.vercel.app/

> FORMA n'existe pas : les noms, articles, chiffres et informations légales du site sont inventés.

## Fonctionnalités

- Page d'accueil et 6 rubriques : Architecture, Intérieur, Typographie, Photographie, Marques, Art
- Thème clair / sombre, mémorisé d'une visite à l'autre
- Filtres d'articles par thème, étiquettes cliquables
- Fenêtres d'aperçu d'article, d'abonnement et d'informations (contact, mentions légales…)
- Formulaires newsletter et abonnement avec validation (aucune donnée n'est envoyée)
- Menu mobile, barre de progression de lecture, apparition des cartes au défilement
- Utilisable au clavier, images WebP chargées à la demande

## Structure

```
index.html              Accueil
Architecture/index.html Rubriques (une page par dossier)
Interieur/index.html
Typographie/index.html
Photographie/index.html
Marques/index.html
Art/index.html
assets/
  css/  home.css, shared.css (thème, menu, fenêtres) et une feuille par rubrique
  js/   shared.js — toute l'interactivité, commune aux 7 pages
  img/  illustrations des articles (WebP)
  icons/ favicon et icône Apple
```

## Technique

HTML, CSS et JavaScript sans framework ni étape de build. Polices Playfair Display et DM Sans (Google Fonts).

Pour le lancer en local, servir le dossier avec n'importe quel serveur statique, par exemple :

```bash
python -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Auteur

Design et développement : Lucas
