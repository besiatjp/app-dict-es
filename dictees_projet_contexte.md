# Projet : Nouvelles Dictées FLE/FLS
*Fichier de contexte pour Claude Project — mis à jour mars 2026*

---

## Vue d'ensemble

Application web éducative de dictées en français langue étrangère/seconde (FLE/FLS), fondée sur la pédagogie Silent Way de Caleb Gattegno. Public cible : enfants, adolescents, jeunes adultes apprenant le français.

**Philosophie pédagogique** : feedback minimal et progressif, pas d'explication explicite, l'apprenant découvre par lui-même. Aucun mot de la phrase n'est révélé avant que l'apprenant l'ait cherché.

---

## Stack technique

- HTML + CSS + JS vanille (pas de framework, pas de build tool)
- Ouverture directe dans le navigateur (Mac Mini)
- Audio : fichiers `.m4a` (convertis depuis `.aif` originaux) + TTS en fallback
- Persistance : `localStorage` pour les statistiques
- Hébergeable tel quel sur WordPress ou tout serveur statique

## Structure des fichiers

```
dictees/
├── index.html       — structure et layout
├── style.css        — styles (Source Sans 3 + Lato)
├── app.js           — logique principale
├── data.js          — corpus des phrases (4 thèmes)
└── sons/
    ├── maison/      — maison_p1.m4a, maison_p2.m4a…
    ├── chambre/
    ├── salon/
    └── habitation/
```

Convention audio : `sons/[thème]/[thème]_p[numéro].m4a`

---

## Corpus

4 thèmes, phrases ordonnées par difficulté croissante :

| Thème | Nb phrases |
|-------|-----------|
| Maison | 22 |
| Chambre | 35 |
| Salon | 14 |
| Habitation | 25 |

---

## Layout

- **Header fixe** : titre + bouton Stats
- **Ligne 1** : carte thèmes (4 boutons avec mini-barre de progression)
- **Ligne 2** : 3 colonnes
  - Gauche (240px) : liste des phrases avec badges ✓ et barre de progression
  - Centre (flex) : espace de travail — boutons, textarea, résultat, indices
  - Droite (200px) : historique des feedbacks (disparaît < 900px)

---

## Logique de vérification

### Séquence sur "Vérifier"
1. Comparaison exacte normalisée → succès
2. Majuscule initiale manquante
3. Compte de mots (signalé seulement si incorrect)
4. Analyse mot à mot → classification des erreurs

### Classification des erreurs (7 types + sous-types ponctuation)
| Type | Description |
|------|-------------|
| `manquant` | mot absent |
| `accent` | même mot sans accents |
| `majuscule` | casse seule |
| `ponctuation_manquante/en_trop/incorrecte` | ponctuation attachée au mot |
| `apostrophe_manquante/en_trop` | apostrophe |
| `frappe` | distance Levenshtein 1, ou 2 sur mot ≥ 6 lettres |
| `syntaxe` | accord genre/nombre (préfixe commun ≥ 55%, terminaison d'accord) |
| `inf_participe` | confusion infinitif → participe passé |
| `participe_inf` | confusion participe passé → infinitif |
| `orthographe` | reste |

### Indices progressifs (3 niveaux, re-analyse la saisie courante à chaque clic)
1. **Soulignement** des mots erronés (couleur selon type, survol = mot attendu)
2. **Type d'erreur** détaillé mot par mot
3. **Phrase correcte** complète

### Bouton Contexte (indépendant des indices)
Indique la position du mot erroné par rapport à ses voisins, sans révéler le mot.

---

## Statistiques

Persistées en `localStorage` sous la clé `dictees_stats`.

Structure : `stats[theme][phraseIndex] = { reussie, tentatives, indices, erreurs: {mot: count} }`

Panneau stats (modal) : par thème — barre de progression, tentatives, indices/tentative, top 5 mots ratés.

---

## Lexique verbal (`LEXIQUE_VERBAL` dans `app.js`)

Lexique des formes verbales du corpus pour détecter les confusions infinitif/participe.
**En cours de constitution** — fichier Excel `lexique_corpus.xlsx` en cours d'annotation par Jean-Pierre.

### Points d'attention relevés lors de l'annotation
- Certains mots sont ambigus (nom + participe passé) : ex. *entrée*, *rangée*, *passé* — à gérer par contexte (mots voisins)
- Les élisions (`d'habitude`, `l'armoire`) ont été extraites comme un seul token → **à corriger** : séparer `d'` + `habitude`, `l'` + `armoire`, etc. et inclure les formes élidées (`l'`, `d'`, `j'`, `s'`, etc.) dans le lexique
- 4 mots composés avec tirets dans le corpus : `couvre-lit`, `peut-être`, `sous-sol`, `week-end` — traités comme 1 mot (choix délibéré, cas marginaux)

---

## Travaux en cours / prochaines étapes

### Lexique corpus (priorité 1)
- [ ] Jean-Pierre finalise l'annotation du fichier `lexique_corpus.xlsx`
- [ ] Révision de l'extraction : séparer les élisions correctement
- [ ] Intégration du lexique annoté dans `app.js` pour remplacer l'heuristique actuelle

### Améliorations prévues (par priorité)
1. **Module infinitif/participe** — affiner avec le lexique annoté
2. **Levenshtein** — mieux calibrer frappe vs orthographe
3. **Ponctuation détaillée** — déjà implémentée, à valider sur le corpus

### Fonctionnalités non encore implémentées
- Fidel interactif (tableau phonétique Silent Way) — prévu pour une phase ultérieure
- Fonction `autour` de l'original (mots voisins, version étendue)
- Écoute ralentie / répétition
- Comptes utilisateurs / progression multi-apprenants

---

## Historique des décisions techniques

| Décision | Raison |
|----------|--------|
| HTML/JS vanille (pas React) | Ouverture directe sans serveur, maintenable par Jean-Pierre |
| `.m4a` pour l'audio | Safari lit `.aif` nativement, Chrome/Firefox non |
| `localStorage` pour les stats | Pas de backend, suffit pour usage local |
| 2 premiers mots dans la liste | Ne pas révéler la phrase avant écoute (Silent Way) |
| Nombre de mots non affiché si correct | Inutile comme indice si le compte est juste |
| Mots composés avec tirets = 1 mot | Cas marginaux, cohérence avec le corpus |
| Sublime Text pour éditions mineures | Accessible à Jean-Pierre sans environnement de dev |

---

## Localisation

- Fichiers sur iCloud : `~/Library/Mobile Documents/com~apple~CloudDocs/Perso CREIPAC/Mille Dictees`
- Site de dev WordPress : `dev.toshikoakahori.com` (projet séparé)
- Jean-Pierre travaille sur Mac Mini, navigateurs Safari et Chrome
