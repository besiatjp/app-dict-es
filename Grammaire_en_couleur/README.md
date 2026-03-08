# Application Pédagogique — Grammaire en Couleurs

Projet HTML/JS d'apprentissage de la grammaire française  
Pédagogie : Silent Way / Caleb Gattegno — La Grammaire en Couleurs© (Maurice Laurent)  
Co-développé avec un praticien Gattegno au Japon — Mars 2026

---

## Principe de l'application

L'apprenant reçoit une phrase issue du corpus de dictées.  
Il place chaque mot dans la case colorée correspondant à sa catégorie grammaticale, sur un tableau muet.  
Le tableau est **muet** : aucun label, aucune explication. L'apprenant construit sa connaissance par l'expérience.  
En cas d'erreur, le mot revient silencieusement à sa place — sans message, sans sanction.

---

## Tableau des catégories (palette de travail)

| Catégorie | Couleur | Hex |
|---|---|---|
| Nom | vert sauge | `#7AAF8A` |
| Verbe | abricot | `#E8A868` |
| Déterminant | jaune paille | `#D4C060` |
| Pronom | mauve rosé | `#B07A8A` |
| Adjectif | lavande | `#9B8EC4` |
| Préposition | corail | `#D07070` |
| Adverbe | bleu gris | `#7A9BB5` |
| Conjonction | ardoise | `#7A8896` |
| Interjection | gris neutre | `#A8A8A0` |

**Cases pivots** (mots à double appartenance) :
- Pronom/Adverbe → dégradé mauve rosé / bleu gris — ex : *y*, *en*
- Déterminant/Préposition → dégradé jaune paille / corail

---

## Règles d'annotation du corpus

### Tokenisation
- Les élisions sont séparées : `l'` + `armoire` → deux tokens (`l'` = déterminant, `armoire` = nom)
- Les mots composés figés sont des blocs uniques : `salle à manger`, `table de nuit`, `chambre à coucher` → un seul token nom
- Les locutions adverbiales sont des blocs : `d'habitude`, `en général`, `à pied`, `à pied`
- Les locutions verbales sont des blocs : `a lieu`

### Catégories — règles spécifiques

**Déterminant**
- Articles contractés `du`, `au`, `aux`, `des` → déterminant
- `chaque`, `plusieurs`, `certaines` devant un nom → déterminant
- Numéraux devant un nom (`deux`, `six`, `sept`…) → déterminant

**Pronom**
- `autre/autres` en position nominale (sans nom après) → pronom
- `où`, `dont`, `qui`, `que` relatifs → voir Conjonction ci-dessous
- `on`, `se`, `me`, `m'`, `l'` (COD) → pronom
- `certains/certaines` seul (sans nom après) → pronom

**Pivot (y, en)**
- `y` et `en` pronoms adverbiaux → pivot (case à cheval pronom/adverbe)
- `où` relatif → pronom simple (pas pivot)

**Verbe**
- Participe passé dans temps composé ou voix passive → verbe
- Participe passé adjectival détaché du verbe → adjectif

**Adjectif**
- `tout/toute/tous/toutes` devant déterminant + nom → adjectif indéfini
- Couleurs après `en` de matière (`peints en blanc`) → adjectif
- `beau` dans `il fait beau` → adjectif

**Adverbe**
- `bon` dans `sentir bon` → adverbe
- `peut-être` → adverbe (attention : `peut-être que` = locution conjonctive)
- `autour` → adverbe (suivi de `de` préposition séparée)
- `plus` dans `de plus d'un étage` → adverbe

**Préposition**
- `en` devant saison/mois/matière (`en hiver`, `en porcelaine`) → préposition
- `suivant` + COD → préposition
- `avant de` → deux tokens préposition + préposition

**Conjonction**
- `que` subordonnant (`c'est là que`, `la somme que`) → conjonction
- `quand`, `ou`, `et`, `mais` → conjonction

---

## Structure des fichiers

```
Grammaire_en_couleur/
├── README.md                 ← ce fichier
├── annotation_corpus.js      ← corpus annoté (base de correction)
└── index.html                ← application (en développement)
```

Le corpus de phrases (`data.js`) reste à la racine du dépôt `app-dict-es`, partagé avec l'application de dictées.

---

## Références

- Gattegno, C. (1963). *Teaching Foreign Languages in Schools: The Silent Way*. Educational Solutions.
- Laurent, M. (2004, rééd. 2014). *Les jeunes, la langue, la grammaire*. UEPD.
- [lagrammaireencouleurs.com](http://lagrammaireencouleurs.com)
- [uneeducationpourdemain.org](http://uneeducationpourdemain.org)
