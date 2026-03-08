// annotation_corpus.js — Annotation grammaticale du corpus
// Version 2 — règles finalisées
//
// Catégories : nom, verbe, déterminant, pronom, adjectif, préposition, adverbe, conjonction, pivot
//
// RÈGLES CONSOLIDÉES :
//   - l' + pronom/numéral → deux tokens séparés
//   - "autre/autres" en position nominale → pronom
//   - y, en (pronoms adverbiaux) → pivot
//   - où, dont → pronom
//   - que (relatif/subordonnant) → conjonction
//   - mots composés figés (salle à manger, table de nuit…) → bloc nom unique
//   - participe passé dans temps composé ou voix passive → verbe
//   - participe adjectival détaché → adjectif
//   - tout/toute/tous/toutes devant déterminant → adjectif indéfini
//   - certains/certaines devant nom → déterminant ; seul → pronom
//   - suivant + COD → préposition
//   - peut-être → adverbe
//   - couleurs après "en" (peints en blanc) → adjectif
//   - d'habitude, en général → bloc adverbe
//   - à pied → bloc adverbe
//   - a lieu → bloc verbe
//   - autour → adverbe ; de → préposition (séparés)
//   - de plus d'un étage → tokens séparés
//   - etcaetera → remplacé par "entre" (adverbe) + "autres" (pronom)

const CORPUS_ANNOTE = {

  Maison: [

    {
      phrase: "J'habite une maison.",
      tokens: [
        { mot: "J'", cat: "pronom" },
        { mot: "habite", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "maison", cat: "nom" }
      ]
    },

    {
      phrase: "Dans ma maison on compte quatre pièces principales.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "maison", cat: "nom" },
        { mot: "on", cat: "pronom" },
        { mot: "compte", cat: "verbe" },
        { mot: "quatre", cat: "déterminant" },
        { mot: "pièces", cat: "nom" },
        { mot: "principales", cat: "adjectif" }
      ]
    },

    {
      phrase: "L'une d'elles est la salle à manger.",
      tokens: [
        { mot: "L'", cat: "déterminant" },
        { mot: "une", cat: "pronom" },
        { mot: "d'", cat: "préposition" },
        { mot: "elles", cat: "pronom" },
        { mot: "est", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "salle à manger", cat: "nom" }
      ]
    },

    {
      phrase: "Une autre est une chambre à coucher.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "autre", cat: "pronom" },
        { mot: "est", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "chambre à coucher", cat: "nom" }
      ]
    },

    {
      phrase: "En réalité, il y a deux chambres à coucher.",
      tokens: [
        { mot: "En", cat: "préposition" },
        { mot: "réalité", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "deux", cat: "déterminant" },
        { mot: "chambres à coucher", cat: "nom" }
      ]
    },

    {
      phrase: "Il y a aussi un salon et une cuisine.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "aussi", cat: "adverbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "salon", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "une", cat: "déterminant" },
        { mot: "cuisine", cat: "nom" }
      ]
    },

    {
      phrase: "Les pièces de service ne sont pas comptées dans les pièces principales.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "pièces de service", cat: "nom" },
        { mot: "ne", cat: "adverbe" },
        { mot: "sont", cat: "verbe" },
        { mot: "pas", cat: "adverbe" },
        { mot: "comptées", cat: "verbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "pièces", cat: "nom" },
        { mot: "principales", cat: "adjectif" }
      ]
    },

    {
      phrase: "La cuisine, l'office, entre autres, sont des pièces de service.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "cuisine", cat: "nom" },
        { mot: "l'", cat: "déterminant" },
        { mot: "office", cat: "nom" },
        { mot: "entre", cat: "adverbe" },
        { mot: "autres", cat: "pronom" },
        { mot: "sont", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "pièces de service", cat: "nom" }
      ]
    },

    {
      phrase: "La salle de bains est séparée des W.C.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "salle de bains", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "séparée", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "W.C.", cat: "nom" }
      ]
    },

    {
      phrase: "Dans la salle à manger, nous prenons nos repas.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "salle à manger", cat: "nom" },
        { mot: "nous", cat: "pronom" },
        { mot: "prenons", cat: "verbe" },
        { mot: "nos", cat: "déterminant" },
        { mot: "repas", cat: "nom" }
      ]
    },

    {
      phrase: "Nous dormons dans les chambres à coucher.",
      tokens: [
        { mot: "Nous", cat: "pronom" },
        { mot: "dormons", cat: "verbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "chambres à coucher", cat: "nom" }
      ]
    },

    {
      phrase: "Parfois nous y faisons aussi la sieste.",
      tokens: [
        { mot: "Parfois", cat: "adverbe" },
        { mot: "nous", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "faisons", cat: "verbe" },
        { mot: "aussi", cat: "adverbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "sieste", cat: "nom" }
      ]
    },

    {
      phrase: "Nous utilisons notre salon pour lire, écouter de la musique ou recevoir des invités.",
      tokens: [
        { mot: "Nous", cat: "pronom" },
        { mot: "utilisons", cat: "verbe" },
        { mot: "notre", cat: "déterminant" },
        { mot: "salon", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "lire", cat: "verbe" },
        { mot: "écouter", cat: "verbe" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "musique", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "recevoir", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "invités", cat: "nom" }
      ]
    },

    {
      phrase: "Dans notre salle de bains, il y a une baignoire et une douche, un lavabo et un bidet.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "notre", cat: "déterminant" },
        { mot: "salle de bains", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "baignoire", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "une", cat: "déterminant" },
        { mot: "douche", cat: "nom" },
        { mot: "un", cat: "déterminant" },
        { mot: "lavabo", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "un", cat: "déterminant" },
        { mot: "bidet", cat: "nom" }
      ]
    },

    {
      phrase: "Dans notre salle à manger, il y a une table, six chaises et un buffet.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "notre", cat: "déterminant" },
        { mot: "salle à manger", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "table", cat: "nom" },
        { mot: "six", cat: "déterminant" },
        { mot: "chaises", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "un", cat: "déterminant" },
        { mot: "buffet", cat: "nom" }
      ]
    },

    {
      phrase: "Il y a aussi une pendule qui indique l'heure.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "aussi", cat: "adverbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "pendule", cat: "nom" },
        { mot: "qui", cat: "pronom" },
        { mot: "indique", cat: "verbe" },
        { mot: "l'", cat: "déterminant" },
        { mot: "heure", cat: "nom" }
      ]
    },

    {
      phrase: "Sur le buffet, il y a un vase qui contient souvent des fleurs.",
      tokens: [
        { mot: "Sur", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "buffet", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "vase", cat: "nom" },
        { mot: "qui", cat: "pronom" },
        { mot: "contient", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "fleurs", cat: "nom" }
      ]
    },

    {
      phrase: "Les fleurs changent suivant les saisons.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "fleurs", cat: "nom" },
        { mot: "changent", cat: "verbe" },
        { mot: "suivant", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "saisons", cat: "nom" }
      ]
    },

    {
      phrase: "Dans le buffet se trouvent les couverts et les couteaux.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "buffet", cat: "nom" },
        { mot: "se", cat: "pronom" },
        { mot: "trouvent", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "couverts", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "les", cat: "déterminant" },
        { mot: "couteaux", cat: "nom" }
      ]
    },

    {
      phrase: "Le service de table est en porcelaine.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "service de table", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "en", cat: "préposition" },
        { mot: "porcelaine", cat: "nom" }
      ]
    },

    {
      phrase: "Il comprend une soupière, un saladier, des plats petits ou grands, longs ou ronds, des assiettes, petites ou grandes, creuses ou plates.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "comprend", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "soupière", cat: "nom" },
        { mot: "un", cat: "déterminant" },
        { mot: "saladier", cat: "nom" },
        { mot: "des", cat: "déterminant" },
        { mot: "plats", cat: "nom" },
        { mot: "petits", cat: "adjectif" },
        { mot: "ou", cat: "conjonction" },
        { mot: "grands", cat: "adjectif" },
        { mot: "longs", cat: "adjectif" },
        { mot: "ou", cat: "conjonction" },
        { mot: "ronds", cat: "adjectif" },
        { mot: "des", cat: "déterminant" },
        { mot: "assiettes", cat: "nom" },
        { mot: "petites", cat: "adjectif" },
        { mot: "ou", cat: "conjonction" },
        { mot: "grandes", cat: "adjectif" },
        { mot: "creuses", cat: "adjectif" },
        { mot: "ou", cat: "conjonction" },
        { mot: "plates", cat: "adjectif" }
      ]
    },

    {
      phrase: "Le service des verres comprend des verres de différentes dimensions, destinés aux divers vins.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "service des verres", cat: "nom" },
        { mot: "comprend", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "verres", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "différentes", cat: "adjectif" },
        { mot: "dimensions", cat: "nom" },
        { mot: "destinés", cat: "adjectif" },
        { mot: "aux", cat: "déterminant" },
        { mot: "divers", cat: "adjectif" },
        { mot: "vins", cat: "nom" }
      ]
    }
  ],

  Chambre: [

    {
      phrase: "Ma chambre à coucher est une pièce tranquille.",
      tokens: [
        { mot: "Ma", cat: "déterminant" },
        { mot: "chambre à coucher", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "pièce", cat: "nom" },
        { mot: "tranquille", cat: "adjectif" }
      ]
    },

    {
      phrase: "Dans ma chambre, il y a un lit, une armoire et une commode.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "lit", cat: "nom" },
        { mot: "une", cat: "déterminant" },
        { mot: "armoire", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "une", cat: "déterminant" },
        { mot: "commode", cat: "nom" }
      ]
    },

    {
      phrase: "Mon lit est recouvert d'un couvre-lit.",
      tokens: [
        { mot: "Mon", cat: "déterminant" },
        { mot: "lit", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "recouvert", cat: "verbe" },
        { mot: "d'", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "couvre-lit", cat: "nom" }
      ]
    },

    {
      phrase: "Sur la commode, il y a un miroir.",
      tokens: [
        { mot: "Sur", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "commode", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "miroir", cat: "nom" }
      ]
    },

    {
      phrase: "Je range mes vêtements dans l'armoire.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "range", cat: "verbe" },
        { mot: "mes", cat: "déterminant" },
        { mot: "vêtements", cat: "nom" },
        { mot: "dans", cat: "préposition" },
        { mot: "l'", cat: "déterminant" },
        { mot: "armoire", cat: "nom" }
      ]
    },

    {
      phrase: "La fenêtre de ma chambre donne sur le jardin.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "fenêtre", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "donne", cat: "verbe" },
        { mot: "sur", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "jardin", cat: "nom" }
      ]
    },

    {
      phrase: "Le matin, j'ouvre les rideaux pour laisser entrer la lumière.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "matin", cat: "nom" },
        { mot: "j'", cat: "pronom" },
        { mot: "ouvre", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "rideaux", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "laisser", cat: "verbe" },
        { mot: "entrer", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "lumière", cat: "nom" }
      ]
    },

    {
      phrase: "Le soir, je ferme les volets pour dormir dans l'obscurité.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "soir", cat: "nom" },
        { mot: "je", cat: "pronom" },
        { mot: "ferme", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "volets", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "dormir", cat: "verbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "l'", cat: "déterminant" },
        { mot: "obscurité", cat: "nom" }
      ]
    },

    {
      phrase: "Ma chambre est bien chauffée en hiver.",
      tokens: [
        { mot: "Ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "bien", cat: "adverbe" },
        { mot: "chauffée", cat: "verbe" },
        { mot: "en", cat: "préposition" },
        { mot: "hiver", cat: "nom" }
      ]
    },

    {
      phrase: "En été, j'ouvre la fenêtre pour aérer la pièce.",
      tokens: [
        { mot: "En", cat: "préposition" },
        { mot: "été", cat: "nom" },
        { mot: "j'", cat: "pronom" },
        { mot: "ouvre", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "fenêtre", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "aérer", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "pièce", cat: "nom" }
      ]
    },

    {
      phrase: "Sur ma table de nuit, il y a une lampe et un livre.",
      tokens: [
        { mot: "Sur", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "table de nuit", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "lampe", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "un", cat: "déterminant" },
        { mot: "livre", cat: "nom" }
      ]
    },

    {
      phrase: "Je lis souvent avant de m'endormir.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "lis", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "avant", cat: "préposition" },
        { mot: "de", cat: "préposition" },
        { mot: "m'", cat: "pronom" },
        { mot: "endormir", cat: "verbe" }
      ]
    },

    {
      phrase: "Mon réveil sonne chaque matin à sept heures.",
      tokens: [
        { mot: "Mon", cat: "déterminant" },
        { mot: "réveil", cat: "nom" },
        { mot: "sonne", cat: "verbe" },
        { mot: "chaque", cat: "déterminant" },
        { mot: "matin", cat: "nom" },
        { mot: "à", cat: "préposition" },
        { mot: "sept", cat: "déterminant" },
        { mot: "heures", cat: "nom" }
      ]
    },

    {
      phrase: "Je fais mon lit chaque matin avant de partir.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "fais", cat: "verbe" },
        { mot: "mon", cat: "déterminant" },
        { mot: "lit", cat: "nom" },
        { mot: "chaque", cat: "déterminant" },
        { mot: "matin", cat: "nom" },
        { mot: "avant", cat: "préposition" },
        { mot: "de", cat: "préposition" },
        { mot: "partir", cat: "verbe" }
      ]
    },

    {
      phrase: "Le plancher de ma chambre est recouvert d'un tapis.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "plancher", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "recouvert", cat: "verbe" },
        { mot: "d'", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "tapis", cat: "nom" }
      ]
    },

    {
      phrase: "Les murs sont peints en blanc et bleu.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "murs", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "peints", cat: "verbe" },
        { mot: "en", cat: "préposition" },
        { mot: "blanc", cat: "adjectif" },
        { mot: "et", cat: "conjonction" },
        { mot: "bleu", cat: "adjectif" }
      ]
    },

    {
      phrase: "Il y a des tableaux accrochés aux murs.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "tableaux", cat: "nom" },
        { mot: "accrochés", cat: "adjectif" },
        { mot: "aux", cat: "déterminant" },
        { mot: "murs", cat: "nom" }
      ]
    },

    {
      phrase: "Dans un coin de la chambre, il y a un petit bureau.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "coin", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "petit", cat: "adjectif" },
        { mot: "bureau", cat: "nom" }
      ]
    },

    {
      phrase: "Je travaille parfois à ce bureau le soir.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "travaille", cat: "verbe" },
        { mot: "parfois", cat: "adverbe" },
        { mot: "à", cat: "préposition" },
        { mot: "ce", cat: "déterminant" },
        { mot: "bureau", cat: "nom" },
        { mot: "le", cat: "déterminant" },
        { mot: "soir", cat: "nom" }
      ]
    },

    {
      phrase: "Une bibliothèque occupe tout un pan de mur.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "bibliothèque", cat: "nom" },
        { mot: "occupe", cat: "verbe" },
        { mot: "tout", cat: "adjectif" },
        { mot: "un", cat: "déterminant" },
        { mot: "pan de mur", cat: "nom" }
      ]
    },

    {
      phrase: "Mes livres préférés y sont rangés par ordre alphabétique.",
      tokens: [
        { mot: "Mes", cat: "déterminant" },
        { mot: "livres", cat: "nom" },
        { mot: "préférés", cat: "adjectif" },
        { mot: "y", cat: "pivot" },
        { mot: "sont", cat: "verbe" },
        { mot: "rangés", cat: "verbe" },
        { mot: "par", cat: "préposition" },
        { mot: "ordre alphabétique", cat: "nom" }
      ]
    },

    {
      phrase: "Le plafond de ma chambre est haut.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "plafond", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "haut", cat: "adjectif" }
      ]
    },

    {
      phrase: "Une jolie lustre éclaire toute la pièce.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "jolie", cat: "adjectif" },
        { mot: "lustre", cat: "nom" },
        { mot: "éclaire", cat: "verbe" },
        { mot: "toute", cat: "adjectif" },
        { mot: "la", cat: "déterminant" },
        { mot: "pièce", cat: "nom" }
      ]
    },

    {
      phrase: "La chambre est ma pièce préférée de la maison.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "ma", cat: "déterminant" },
        { mot: "pièce", cat: "nom" },
        { mot: "préférée", cat: "adjectif" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "maison", cat: "nom" }
      ]
    },

    {
      phrase: "J'y passe beaucoup de temps à lire et à me reposer.",
      tokens: [
        { mot: "J'", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "passe", cat: "verbe" },
        { mot: "beaucoup", cat: "adverbe" },
        { mot: "de", cat: "préposition" },
        { mot: "temps", cat: "nom" },
        { mot: "à", cat: "préposition" },
        { mot: "lire", cat: "verbe" },
        { mot: "et", cat: "conjonction" },
        { mot: "à", cat: "préposition" },
        { mot: "me", cat: "pronom" },
        { mot: "reposer", cat: "verbe" }
      ]
    },

    {
      phrase: "Parfois j'écoute de la musique dans ma chambre.",
      tokens: [
        { mot: "Parfois", cat: "adverbe" },
        { mot: "j'", cat: "pronom" },
        { mot: "écoute", cat: "verbe" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "musique", cat: "nom" },
        { mot: "dans", cat: "préposition" },
        { mot: "ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" }
      ]
    },

    {
      phrase: "Je range mes chaussures sous le lit ou dans l'armoire.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "range", cat: "verbe" },
        { mot: "mes", cat: "déterminant" },
        { mot: "chaussures", cat: "nom" },
        { mot: "sous", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "lit", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "dans", cat: "préposition" },
        { mot: "l'", cat: "déterminant" },
        { mot: "armoire", cat: "nom" }
      ]
    },

    {
      phrase: "Ma chambre est toujours bien rangée.",
      tokens: [
        { mot: "Ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "toujours", cat: "adverbe" },
        { mot: "bien", cat: "adverbe" },
        { mot: "rangée", cat: "verbe" }
      ]
    },

    {
      phrase: "Je change les draps chaque semaine.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "change", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "draps", cat: "nom" },
        { mot: "chaque", cat: "déterminant" },
        { mot: "semaine", cat: "nom" }
      ]
    },

    {
      phrase: "Ma mère m'aide parfois à faire le grand ménage.",
      tokens: [
        { mot: "Ma", cat: "déterminant" },
        { mot: "mère", cat: "nom" },
        { mot: "m'", cat: "pronom" },
        { mot: "aide", cat: "verbe" },
        { mot: "parfois", cat: "adverbe" },
        { mot: "à", cat: "préposition" },
        { mot: "faire", cat: "verbe" },
        { mot: "le", cat: "déterminant" },
        { mot: "grand", cat: "adjectif" },
        { mot: "ménage", cat: "nom" }
      ]
    },

    {
      phrase: "Nous lavons les rideaux deux fois par an.",
      tokens: [
        { mot: "Nous", cat: "pronom" },
        { mot: "lavons", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "rideaux", cat: "nom" },
        { mot: "deux", cat: "déterminant" },
        { mot: "fois", cat: "nom" },
        { mot: "par", cat: "préposition" },
        { mot: "an", cat: "nom" }
      ]
    },

    {
      phrase: "La chambre sent bon quand les fleurs du jardin sont en fleur.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "sent", cat: "verbe" },
        { mot: "bon", cat: "adverbe" },
        { mot: "quand", cat: "conjonction" },
        { mot: "les", cat: "déterminant" },
        { mot: "fleurs", cat: "nom" },
        { mot: "du", cat: "déterminant" },
        { mot: "jardin", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "en", cat: "préposition" },
        { mot: "fleur", cat: "nom" }
      ]
    },

    {
      phrase: "Je garde une petite plante verte sur le rebord de la fenêtre.",
      tokens: [
        { mot: "Je", cat: "pronom" },
        { mot: "garde", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "petite", cat: "adjectif" },
        { mot: "plante", cat: "nom" },
        { mot: "verte", cat: "adjectif" },
        { mot: "sur", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "rebord", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "fenêtre", cat: "nom" }
      ]
    },

    {
      phrase: "Ma chambre est mon espace personnel.",
      tokens: [
        { mot: "Ma", cat: "déterminant" },
        { mot: "chambre", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "mon", cat: "déterminant" },
        { mot: "espace", cat: "nom" },
        { mot: "personnel", cat: "adjectif" }
      ]
    },

    {
      phrase: "J'y reçois parfois des amis pour discuter.",
      tokens: [
        { mot: "J'", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "reçois", cat: "verbe" },
        { mot: "parfois", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "amis", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "discuter", cat: "verbe" }
      ]
    }
  ],

  Salon: [

    {
      phrase: "Le salon est la pièce principale de la maison.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "salon", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "pièce", cat: "nom" },
        { mot: "principale", cat: "adjectif" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "maison", cat: "nom" }
      ]
    },

    {
      phrase: "C'est là que nous recevons nos invités.",
      tokens: [
        { mot: "C'", cat: "pronom" },
        { mot: "est", cat: "verbe" },
        { mot: "là", cat: "adverbe" },
        { mot: "que", cat: "conjonction" },
        { mot: "nous", cat: "pronom" },
        { mot: "recevons", cat: "verbe" },
        { mot: "nos", cat: "déterminant" },
        { mot: "invités", cat: "nom" }
      ]
    },

    {
      phrase: "Dans notre salon, il y a un grand canapé et deux fauteuils.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "notre", cat: "déterminant" },
        { mot: "salon", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "grand", cat: "adjectif" },
        { mot: "canapé", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "deux", cat: "déterminant" },
        { mot: "fauteuils", cat: "nom" }
      ]
    },

    {
      phrase: "Une table basse est placée devant le canapé.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "table basse", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "placée", cat: "verbe" },
        { mot: "devant", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "canapé", cat: "nom" }
      ]
    },

    {
      phrase: "Sur la table basse, il y a souvent des magazines et des livres.",
      tokens: [
        { mot: "Sur", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "table basse", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "magazines", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "des", cat: "déterminant" },
        { mot: "livres", cat: "nom" }
      ]
    },

    {
      phrase: "Nous regardons la télévision dans le salon.",
      tokens: [
        { mot: "Nous", cat: "pronom" },
        { mot: "regardons", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "télévision", cat: "nom" },
        { mot: "dans", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "salon", cat: "nom" }
      ]
    },

    {
      phrase: "Le soir, toute la famille se réunit dans le salon.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "soir", cat: "nom" },
        { mot: "toute", cat: "adjectif" },
        { mot: "la", cat: "déterminant" },
        { mot: "famille", cat: "nom" },
        { mot: "se", cat: "pronom" },
        { mot: "réunit", cat: "verbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "salon", cat: "nom" }
      ]
    },

    {
      phrase: "Les enfants jouent parfois sur le tapis du salon.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "enfants", cat: "nom" },
        { mot: "jouent", cat: "verbe" },
        { mot: "parfois", cat: "adverbe" },
        { mot: "sur", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "tapis", cat: "nom" },
        { mot: "du", cat: "déterminant" },
        { mot: "salon", cat: "nom" }
      ]
    },

    {
      phrase: "Notre salon est décoré avec beaucoup de soin.",
      tokens: [
        { mot: "Notre", cat: "déterminant" },
        { mot: "salon", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "décoré", cat: "verbe" },
        { mot: "avec", cat: "préposition" },
        { mot: "beaucoup", cat: "adverbe" },
        { mot: "de", cat: "préposition" },
        { mot: "soin", cat: "nom" }
      ]
    },

    {
      phrase: "Les rideaux sont en tissu épais pour protéger de la lumière.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "rideaux", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "en", cat: "préposition" },
        { mot: "tissu", cat: "nom" },
        { mot: "épais", cat: "adjectif" },
        { mot: "pour", cat: "préposition" },
        { mot: "protéger", cat: "verbe" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "lumière", cat: "nom" }
      ]
    },

    {
      phrase: "Un grand miroir est accroché au mur.",
      tokens: [
        { mot: "Un", cat: "déterminant" },
        { mot: "grand", cat: "adjectif" },
        { mot: "miroir", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "accroché", cat: "verbe" },
        { mot: "au", cat: "déterminant" },
        { mot: "mur", cat: "nom" }
      ]
    },

    {
      phrase: "Des plantes vertes décorent les coins de la pièce.",
      tokens: [
        { mot: "Des", cat: "déterminant" },
        { mot: "plantes", cat: "nom" },
        { mot: "vertes", cat: "adjectif" },
        { mot: "décorent", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "coins", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "pièce", cat: "nom" }
      ]
    },

    {
      phrase: "Le salon communique avec la salle à manger.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "salon", cat: "nom" },
        { mot: "communique", cat: "verbe" },
        { mot: "avec", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "salle à manger", cat: "nom" }
      ]
    },

    {
      phrase: "Nous y écoutons de la musique le week-end.",
      tokens: [
        { mot: "Nous", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "écoutons", cat: "verbe" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "musique", cat: "nom" },
        { mot: "le", cat: "déterminant" },
        { mot: "week-end", cat: "nom" }
      ]
    }
  ],

  Habitation: [

    {
      phrase: "Le lieu où on habite est un logement.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "lieu", cat: "nom" },
        { mot: "où", cat: "pronom" },
        { mot: "on", cat: "pronom" },
        { mot: "habite", cat: "verbe" },
        { mot: "est", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "logement", cat: "nom" }
      ]
    },

    {
      phrase: "On l'appelle aussi le domicile, par opposition avec le bureau ou le lieu où l'on travaille.",
      tokens: [
        { mot: "On", cat: "pronom" },
        { mot: "l'", cat: "pronom" },
        { mot: "appelle", cat: "verbe" },
        { mot: "aussi", cat: "adverbe" },
        { mot: "le", cat: "déterminant" },
        { mot: "domicile", cat: "nom" },
        { mot: "par", cat: "préposition" },
        { mot: "opposition", cat: "nom" },
        { mot: "avec", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "bureau", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "le", cat: "déterminant" },
        { mot: "lieu", cat: "nom" },
        { mot: "où", cat: "pronom" },
        { mot: "l'", cat: "déterminant" },
        { mot: "on", cat: "pronom" },
        { mot: "travaille", cat: "verbe" }
      ]
    },

    {
      phrase: "En ville, les logements sont d'habitude des appartements.",
      tokens: [
        { mot: "En", cat: "préposition" },
        { mot: "ville", cat: "nom" },
        { mot: "les", cat: "déterminant" },
        { mot: "logements", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "d'habitude", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "appartements", cat: "nom" }
      ]
    },

    {
      phrase: "À la campagne ou dans les faubourgs, ce peut-être des maisons de plus d'un étage.",
      tokens: [
        { mot: "À", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "campagne", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "dans", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "faubourgs", cat: "nom" },
        { mot: "ce", cat: "pronom" },
        { mot: "peut-être", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "maisons", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "plus", cat: "adverbe" },
        { mot: "d'", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "étage", cat: "nom" }
      ]
    },

    {
      phrase: "Dans ce cas, la maison peut comporter une cave au sous-sol, un grenier sous le toit et des escaliers pour passer d'un étage à l'autre.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "ce", cat: "déterminant" },
        { mot: "cas", cat: "nom" },
        { mot: "la", cat: "déterminant" },
        { mot: "maison", cat: "nom" },
        { mot: "peut", cat: "verbe" },
        { mot: "comporter", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "cave", cat: "nom" },
        { mot: "au", cat: "déterminant" },
        { mot: "sous-sol", cat: "nom" },
        { mot: "un", cat: "déterminant" },
        { mot: "grenier", cat: "nom" },
        { mot: "sous", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "toit", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "des", cat: "déterminant" },
        { mot: "escaliers", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "passer", cat: "verbe" },
        { mot: "d'", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "étage", cat: "nom" },
        { mot: "à", cat: "préposition" },
        { mot: "l'", cat: "déterminant" },
        { mot: "autre", cat: "pronom" }
      ]
    },

    {
      phrase: "Autour de la maison il peut y avoir un jardin.",
      tokens: [
        { mot: "Autour", cat: "adverbe" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "maison", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "peut", cat: "verbe" },
        { mot: "y", cat: "pivot" },
        { mot: "avoir", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "jardin", cat: "nom" }
      ]
    },

    {
      phrase: "Un jardin où l'on cultive des légumes est appelé un potager.",
      tokens: [
        { mot: "Un", cat: "déterminant" },
        { mot: "jardin", cat: "nom" },
        { mot: "où", cat: "pronom" },
        { mot: "l'", cat: "déterminant" },
        { mot: "on", cat: "pronom" },
        { mot: "cultive", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "légumes", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "appelé", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "potager", cat: "nom" }
      ]
    },

    {
      phrase: "Un jardin où l'on cultive des fruits est appelé un verger.",
      tokens: [
        { mot: "Un", cat: "déterminant" },
        { mot: "jardin", cat: "nom" },
        { mot: "où", cat: "pronom" },
        { mot: "l'", cat: "déterminant" },
        { mot: "on", cat: "pronom" },
        { mot: "cultive", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "fruits", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "appelé", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "verger", cat: "nom" }
      ]
    },

    {
      phrase: "Dans chaque jardin il y a des fleurs plantées en pots ou dans le sol.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "chaque", cat: "déterminant" },
        { mot: "jardin", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "fleurs", cat: "nom" },
        { mot: "plantées", cat: "adjectif" },
        { mot: "en", cat: "préposition" },
        { mot: "pots", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "dans", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "sol", cat: "nom" }
      ]
    },

    {
      phrase: "Quelquefois des plantes grimpantes couvrent une partie de la façade.",
      tokens: [
        { mot: "Quelquefois", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "plantes", cat: "nom" },
        { mot: "grimpantes", cat: "adjectif" },
        { mot: "couvrent", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "partie", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "façade", cat: "nom" }
      ]
    },

    {
      phrase: "Les pelouses dans les jardins sont des surfaces plantées d'herbe verte que l'on coupe régulièrement.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "pelouses", cat: "nom" },
        { mot: "dans", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "jardins", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "surfaces", cat: "nom" },
        { mot: "plantées", cat: "adjectif" },
        { mot: "d'", cat: "préposition" },
        { mot: "herbe", cat: "nom" },
        { mot: "verte", cat: "adjectif" },
        { mot: "que", cat: "conjonction" },
        { mot: "l'", cat: "déterminant" },
        { mot: "on", cat: "pronom" },
        { mot: "coupe", cat: "verbe" },
        { mot: "régulièrement", cat: "adverbe" }
      ]
    },

    {
      phrase: "Les pelouses et les jardins demandent en général beaucoup de soin.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "pelouses", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "les", cat: "déterminant" },
        { mot: "jardins", cat: "nom" },
        { mot: "demandent", cat: "verbe" },
        { mot: "en général", cat: "adverbe" },
        { mot: "beaucoup", cat: "adverbe" },
        { mot: "de", cat: "préposition" },
        { mot: "soin", cat: "nom" }
      ]
    },

    {
      phrase: "Soigner un jardin exige beaucoup de temps et de patience.",
      tokens: [
        { mot: "Soigner", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "jardin", cat: "nom" },
        { mot: "exige", cat: "verbe" },
        { mot: "beaucoup", cat: "adverbe" },
        { mot: "de", cat: "préposition" },
        { mot: "temps", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "de", cat: "préposition" },
        { mot: "patience", cat: "nom" }
      ]
    },

    {
      phrase: "Tout le monde ne fait pas un bon jardinier.",
      tokens: [
        { mot: "Tout", cat: "adjectif" },
        { mot: "le", cat: "déterminant" },
        { mot: "monde", cat: "nom" },
        { mot: "ne", cat: "adverbe" },
        { mot: "fait", cat: "verbe" },
        { mot: "pas", cat: "adverbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "bon", cat: "adjectif" },
        { mot: "jardinier", cat: "nom" }
      ]
    },

    {
      phrase: "Les bons jardiniers sont plutôt rares.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "bons", cat: "adjectif" },
        { mot: "jardiniers", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "plutôt", cat: "adverbe" },
        { mot: "rares", cat: "adjectif" }
      ]
    },

    {
      phrase: "Une haie ou une clôture sépare en général une propriété d'une autre.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "haie", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "une", cat: "déterminant" },
        { mot: "clôture", cat: "nom" },
        { mot: "sépare", cat: "verbe" },
        { mot: "en général", cat: "adverbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "propriété", cat: "nom" },
        { mot: "d'", cat: "préposition" },
        { mot: "une", cat: "déterminant" },
        { mot: "autre", cat: "pronom" }
      ]
    },

    {
      phrase: "Une propriété a une porte ou un portail qui donne sur la route.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "propriété", cat: "nom" },
        { mot: "a", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "porte", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "un", cat: "déterminant" },
        { mot: "portail", cat: "nom" },
        { mot: "qui", cat: "pronom" },
        { mot: "donne", cat: "verbe" },
        { mot: "sur", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "route", cat: "nom" }
      ]
    },

    {
      phrase: "Les routes qui ne sont pas privées sont entretenues par la municipalité ou l'État.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "routes", cat: "nom" },
        { mot: "qui", cat: "pronom" },
        { mot: "ne", cat: "adverbe" },
        { mot: "sont", cat: "verbe" },
        { mot: "pas", cat: "adverbe" },
        { mot: "privées", cat: "adjectif" },
        { mot: "sont", cat: "verbe" },
        { mot: "entretenues", cat: "verbe" },
        { mot: "par", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "municipalité", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "l'", cat: "déterminant" },
        { mot: "État", cat: "nom" }
      ]
    },

    {
      phrase: "Les routes forment un réseau qui relie les divers lieux d'un pays.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "routes", cat: "nom" },
        { mot: "forment", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "réseau", cat: "nom" },
        { mot: "qui", cat: "pronom" },
        { mot: "relie", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "divers", cat: "adjectif" },
        { mot: "lieux", cat: "nom" },
        { mot: "d'", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "pays", cat: "nom" }
      ]
    },

    {
      phrase: "Un appartement est un ensemble de pièces dans un immeuble.",
      tokens: [
        { mot: "Un", cat: "déterminant" },
        { mot: "appartement", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "ensemble", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "pièces", cat: "nom" },
        { mot: "dans", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "immeuble", cat: "nom" }
      ]
    },

    {
      phrase: "Les immeubles peuvent avoir plusieurs étages.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "immeubles", cat: "nom" },
        { mot: "peuvent", cat: "verbe" },
        { mot: "avoir", cat: "verbe" },
        { mot: "plusieurs", cat: "déterminant" },
        { mot: "étages", cat: "nom" }
      ]
    },

    {
      phrase: "On prend l'escalier ou l'ascenseur pour monter.",
      tokens: [
        { mot: "On", cat: "pronom" },
        { mot: "prend", cat: "verbe" },
        { mot: "l'", cat: "déterminant" },
        { mot: "escalier", cat: "nom" },
        { mot: "ou", cat: "conjonction" },
        { mot: "l'", cat: "déterminant" },
        { mot: "ascenseur", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "monter", cat: "verbe" }
      ]
    },

    {
      phrase: "Chaque appartement a sa propre entrée.",
      tokens: [
        { mot: "Chaque", cat: "déterminant" },
        { mot: "appartement", cat: "nom" },
        { mot: "a", cat: "verbe" },
        { mot: "sa", cat: "déterminant" },
        { mot: "propre", cat: "adjectif" },
        { mot: "entrée", cat: "nom" }
      ]
    },

    {
      phrase: "Le loyer est la somme que l'on paie chaque mois pour habiter un logement.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "loyer", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "la", cat: "déterminant" },
        { mot: "somme", cat: "nom" },
        { mot: "que", cat: "conjonction" },
        { mot: "l'", cat: "déterminant" },
        { mot: "on", cat: "pronom" },
        { mot: "paie", cat: "verbe" },
        { mot: "chaque", cat: "déterminant" },
        { mot: "mois", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "habiter", cat: "verbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "logement", cat: "nom" }
      ]
    },

    {
      phrase: "Les propriétaires louent leurs biens à des locataires.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "propriétaires", cat: "nom" },
        { mot: "louent", cat: "verbe" },
        { mot: "leurs", cat: "déterminant" },
        { mot: "biens", cat: "nom" },
        { mot: "à", cat: "préposition" },
        { mot: "des", cat: "déterminant" },
        { mot: "locataires", cat: "nom" }
      ]
    }
  ],

  Quartier: [

    {
      phrase: "J'habite dans un quartier.",
      tokens: [
        { mot: "J'", cat: "pronom" },
        { mot: "habite", cat: "verbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "un", cat: "déterminant" },
        { mot: "quartier", cat: "nom" }
      ]
    },

    {
      phrase: "Mon quartier est calme.",
      tokens: [
        { mot: "Mon", cat: "déterminant" },
        { mot: "quartier", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "calme", cat: "adjectif" }
      ]
    },

    {
      phrase: "Il y a une rue principale.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "rue", cat: "nom" },
        { mot: "principale", cat: "adjectif" }
      ]
    },

    {
      phrase: "La rue est large et animée.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "rue", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "large", cat: "adjectif" },
        { mot: "et", cat: "conjonction" },
        { mot: "animée", cat: "adjectif" }
      ]
    },

    {
      phrase: "Il y a des trottoirs de chaque côté.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "trottoirs", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "chaque", cat: "déterminant" },
        { mot: "côté", cat: "nom" }
      ]
    },

    {
      phrase: "Dans mon quartier, il y a des commerces.",
      tokens: [
        { mot: "Dans", cat: "préposition" },
        { mot: "mon", cat: "déterminant" },
        { mot: "quartier", cat: "nom" },
        { mot: "il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "commerces", cat: "nom" }
      ]
    },

    {
      phrase: "La boulangerie est au coin de la rue.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "boulangerie", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "au", cat: "déterminant" },
        { mot: "coin", cat: "nom" },
        { mot: "de", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "rue", cat: "nom" }
      ]
    },

    {
      phrase: "L'épicerie est ouverte tous les jours.",
      tokens: [
        { mot: "L'", cat: "déterminant" },
        { mot: "épicerie", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "ouverte", cat: "adjectif" },
        { mot: "tous", cat: "adjectif" },
        { mot: "les", cat: "déterminant" },
        { mot: "jours", cat: "nom" }
      ]
    },

    {
      phrase: "Il y a aussi une pharmacie et un café.",
      tokens: [
        { mot: "Il", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "a", cat: "verbe" },
        { mot: "aussi", cat: "adverbe" },
        { mot: "une", cat: "déterminant" },
        { mot: "pharmacie", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "un", cat: "déterminant" },
        { mot: "café", cat: "nom" }
      ]
    },

    {
      phrase: "Le café est souvent un lieu de rencontre pour les habitants.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "café", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "un", cat: "déterminant" },
        { mot: "lieu de rencontre", cat: "nom" },
        { mot: "pour", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "habitants", cat: "nom" }
      ]
    },

    {
      phrase: "Les voisins se saluent parfois dans la rue.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "voisins", cat: "nom" },
        { mot: "se", cat: "pronom" },
        { mot: "saluent", cat: "verbe" },
        { mot: "parfois", cat: "adverbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "rue", cat: "nom" }
      ]
    },

    {
      phrase: "Les enfants jouent souvent dans le square.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "enfants", cat: "nom" },
        { mot: "jouent", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "le", cat: "déterminant" },
        { mot: "square", cat: "nom" }
      ]
    },

    {
      phrase: "Le square est entouré d'arbres et de bancs.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "square", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "entouré", cat: "verbe" },
        { mot: "d'", cat: "préposition" },
        { mot: "arbres", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "de", cat: "préposition" },
        { mot: "bancs", cat: "nom" }
      ]
    },

    {
      phrase: "Une fontaine se trouve au centre du square.",
      tokens: [
        { mot: "Une", cat: "déterminant" },
        { mot: "fontaine", cat: "nom" },
        { mot: "se", cat: "pronom" },
        { mot: "trouve", cat: "verbe" },
        { mot: "au", cat: "déterminant" },
        { mot: "centre", cat: "nom" },
        { mot: "du", cat: "déterminant" },
        { mot: "square", cat: "nom" }
      ]
    },

    {
      phrase: "Quand il fait beau, les personnes âgées s'assoient sur les bancs.",
      tokens: [
        { mot: "Quand", cat: "conjonction" },
        { mot: "il", cat: "pronom" },
        { mot: "fait", cat: "verbe" },
        { mot: "beau", cat: "adjectif" },
        { mot: "les", cat: "déterminant" },
        { mot: "personnes âgées", cat: "nom" },
        { mot: "s'", cat: "pronom" },
        { mot: "assoient", cat: "verbe" },
        { mot: "sur", cat: "préposition" },
        { mot: "les", cat: "déterminant" },
        { mot: "bancs", cat: "nom" }
      ]
    },

    {
      phrase: "Le marché a lieu deux fois par semaine.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "marché", cat: "nom" },
        { mot: "a lieu", cat: "verbe" },
        { mot: "deux", cat: "déterminant" },
        { mot: "fois", cat: "nom" },
        { mot: "par", cat: "préposition" },
        { mot: "semaine", cat: "nom" }
      ]
    },

    {
      phrase: "On y trouve des fruits, des légumes et des fleurs.",
      tokens: [
        { mot: "On", cat: "pronom" },
        { mot: "y", cat: "pivot" },
        { mot: "trouve", cat: "verbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "fruits", cat: "nom" },
        { mot: "des", cat: "déterminant" },
        { mot: "légumes", cat: "nom" },
        { mot: "et", cat: "conjonction" },
        { mot: "des", cat: "déterminant" },
        { mot: "fleurs", cat: "nom" }
      ]
    },

    {
      phrase: "Les commerçants connaissent bien leurs clients.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "commerçants", cat: "nom" },
        { mot: "connaissent", cat: "verbe" },
        { mot: "bien", cat: "adverbe" },
        { mot: "leurs", cat: "déterminant" },
        { mot: "clients", cat: "nom" }
      ]
    },

    {
      phrase: "Quand il pleut, les rues se vident rapidement.",
      tokens: [
        { mot: "Quand", cat: "conjonction" },
        { mot: "il", cat: "pronom" },
        { mot: "pleut", cat: "verbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "rues", cat: "nom" },
        { mot: "se", cat: "pronom" },
        { mot: "vident", cat: "verbe" },
        { mot: "rapidement", cat: "adverbe" }
      ]
    },

    {
      phrase: "Certaines rues sont piétonnes et interdites aux voitures.",
      tokens: [
        { mot: "Certaines", cat: "déterminant" },
        { mot: "rues", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "piétonnes", cat: "adjectif" },
        { mot: "et", cat: "conjonction" },
        { mot: "interdites", cat: "adjectif" },
        { mot: "aux", cat: "déterminant" },
        { mot: "voitures", cat: "nom" }
      ]
    },

    {
      phrase: "Le soir, les terrasses des cafés sont souvent très animées.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "soir", cat: "nom" },
        { mot: "les", cat: "déterminant" },
        { mot: "terrasses", cat: "nom" },
        { mot: "des", cat: "déterminant" },
        { mot: "cafés", cat: "nom" },
        { mot: "sont", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "très", cat: "adverbe" },
        { mot: "animées", cat: "adjectif" }
      ]
    },

    {
      phrase: "Le quartier est desservi par plusieurs lignes de bus.",
      tokens: [
        { mot: "Le", cat: "déterminant" },
        { mot: "quartier", cat: "nom" },
        { mot: "est", cat: "verbe" },
        { mot: "desservi", cat: "verbe" },
        { mot: "par", cat: "préposition" },
        { mot: "plusieurs", cat: "déterminant" },
        { mot: "lignes de bus", cat: "nom" }
      ]
    },

    {
      phrase: "La mairie se trouve à quelques minutes à pied.",
      tokens: [
        { mot: "La", cat: "déterminant" },
        { mot: "mairie", cat: "nom" },
        { mot: "se", cat: "pronom" },
        { mot: "trouve", cat: "verbe" },
        { mot: "à", cat: "préposition" },
        { mot: "quelques", cat: "déterminant" },
        { mot: "minutes", cat: "nom" },
        { mot: "à pied", cat: "adverbe" }
      ]
    },

    {
      phrase: "Parfois, des musiciens jouent dans la rue.",
      tokens: [
        { mot: "Parfois", cat: "adverbe" },
        { mot: "des", cat: "déterminant" },
        { mot: "musiciens", cat: "nom" },
        { mot: "jouent", cat: "verbe" },
        { mot: "dans", cat: "préposition" },
        { mot: "la", cat: "déterminant" },
        { mot: "rue", cat: "nom" }
      ]
    },

    {
      phrase: "Les immeubles anciens côtoient souvent les constructions modernes.",
      tokens: [
        { mot: "Les", cat: "déterminant" },
        { mot: "immeubles", cat: "nom" },
        { mot: "anciens", cat: "adjectif" },
        { mot: "côtoient", cat: "verbe" },
        { mot: "souvent", cat: "adverbe" },
        { mot: "les", cat: "déterminant" },
        { mot: "constructions", cat: "nom" },
        { mot: "modernes", cat: "adjectif" }
      ]
    }
  ]
};
