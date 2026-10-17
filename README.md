# Écrin — ma collection de montres

Web app installable sur iPhone (PWA). Aucune installation sur l'ordinateur, aucune réinstallation :
une fois ajoutée à l'écran d'accueil, elle s'ouvre en plein écran et fonctionne hors ligne.
Les données (fiches et photos) restent **sur l'iPhone** ; pensez à exporter une sauvegarde de temps en temps
(Réglages → Exporter la collection → Fichiers / iCloud Drive).

## Mettre l'app sur ton iPhone (une seule fois, ~5 min)

L'app est publiée avec GitHub Pages, sur ton compte perso, à l'adresse **https://stratisbakas.com/watches/**
(ton site de profil utilise déjà ce domaine, GitHub y sert automatiquement les autres dépôts).

1. Sur github.com, connecté à ton compte perso : New repository → nom **`watches`** → Public → Create.
2. « uploading an existing file » → glisse **le contenu** de ce dossier `watches/`
   (index.html, app.js, styles.css, db.js, catalog.js, sw.js, manifest.webmanifest et le dossier icons) → Commit.
3. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)` → Save.
4. Une à deux minutes plus tard, l'adresse est en ligne.
5. Sur l'iPhone, ouvre l'adresse dans **Safari** → bouton Partager → **Sur l'écran d'accueil**.
   Remplis ta collection dans l'app de l'écran d'accueil, pas dans l'onglet Safari (sur iPhone, ce sont deux espaces séparés).

Le site est public mais ne contient que le code : tes fiches et tes photos restent sur ton iPhone.

**Ne renomme jamais le dépôt et ne change pas le domaine du site de profil** : les données sont rattachées à
l'adresse. Si l'adresse change, l'app repart vide et il faut réimporter une sauvegarde.

Pour une mise à jour : glisse à nouveau les fichiers modifiés dans le dépôt, puis rouvre l'app (deux fois si besoin).
Exporte une sauvegarde avant une grosse mise à jour (Réglages → Exporter la collection).

## Tester sur le Mac

```bash
cd watches && python3 -m http.server 5173
```
puis http://localhost:5173

## Contenu

- `index.html`, `styles.css`, `app.js` : l'interface (accueil en grille, fiche détaillée + zoom photo, révisions, timeline, formulaire).
- `catalog.js` : le catalogue local de références (prix indicatifs, intervalles de révision). Ajoute tes propres lignes au même format.
- `db.js` : stockage IndexedDB sur l'appareil.
- `sw.js`, `manifest.webmanifest`, `icons/` : installation et mode hors ligne.
