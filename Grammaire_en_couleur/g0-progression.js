// g0-progression.js — Paliers pédagogiques
// Généré automatiquement — ne pas modifier à la main

const ORDRE_CATEGORIES = [
  "nom", "verbe", "déterminant", "pronom",
  "préposition", "adjectif", "adverbe", "conjonction", "pivot"
];

// Messages de fin de palier — ton chaleureux, spécifique, sans condescendance
const MESSAGES_FIN_PALIER = {
  3: {
    bilan: "Tu viens de placer des noms, des verbes et des déterminants. Plus tard tu verras les verbes et les déterminants plus en détail — mais pour le moment tu t'en sors très bien !",
    invite: "Prêt pour un autre niveau ?"
  },
  4: {
    bilan: "Tu as ajouté les pronoms à ta palette. Ce sont eux qui remplacent les noms — tu commences à voir comment la langue évite les répétitions.",
    invite: "On continue ?"
  },
  5: {
    bilan: "Les prépositions sont partout : elles relient, situent, orientent. Tu les as trouvées. Il y en a encore beaucoup à explorer, mais tu as le bon réflexe.",
    invite: "Prêt pour la suite ?"
  },
  6: {
    bilan: "Les adjectifs donnent de la couleur aux noms. Tu les as bien repérés — et tu verras qu'ils s'accordent, mais ça c'est pour plus tard.",
    invite: "On continue ?"
  },
  7: {
    bilan: "Les adverbes modifient tout — les verbes, les adjectifs, d'autres adverbes. Tu as bien vu où ils se glissaient dans la phrase.",
    invite: "Prêt pour un nouveau niveau ?"
  },
  8: {
    bilan: "Les conjonctions assemblent, relient, opposent. Elles sont discrètes mais essentielles — et tu les as trouvées.",
    invite: "On continue ?"
  },
  9: {
    bilan: "Les pronoms adverbiaux y et en sont parmi les mots les plus fréquents du français — et parmi les plus difficiles à saisir. Tu t'en es bien sorti.",
    invite: "Tu as exploré tout le tableau. Bravo."
  },
};

const PALIERS = [
  {
    num: 3,
    catNouvelle: "déterminant",
    catsActives: ["nom","verbe","déterminant","pivot-dp"],
    phrases: [
      { theme: "Maison", phraseIndex: 8, nbCats: 3, nbTokens: 6 },
      { theme: "Habitation", phraseIndex: 20, nbCats: 3, nbTokens: 6 },
    ]
  },
  {
    num: 4,
    catNouvelle: "pronom",
    catsActives: ["nom","verbe","déterminant","pivot-dp","pronom"],
    phrases: [
      { theme: "Maison", phraseIndex: 0, nbCats: 4, nbTokens: 4 },
      { theme: "Maison", phraseIndex: 3, nbCats: 4, nbTokens: 5 },
      { theme: "Chambre", phraseIndex: 28, nbCats: 4, nbTokens: 6 },
      { theme: "Habitation", phraseIndex: 0, nbCats: 4, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 13, nbCats: 4, nbTokens: 8 },
      { theme: "Habitation", phraseIndex: 6, nbCats: 4, nbTokens: 12 },
      { theme: "Habitation", phraseIndex: 7, nbCats: 4, nbTokens: 12 },
    ]
  },
  {
    num: 5,
    catNouvelle: "préposition",
    catsActives: ["nom","verbe","déterminant","pivot-dp","pronom","préposition"],
    phrases: [
      { theme: "Maison", phraseIndex: 19, nbCats: 4, nbTokens: 5 },
      { theme: "Maison", phraseIndex: 17, nbCats: 4, nbTokens: 6 },
      { theme: "Salon", phraseIndex: 12, nbCats: 4, nbTokens: 6 },
      { theme: "Chambre", phraseIndex: 2, nbCats: 4, nbTokens: 7 },
      { theme: "Salon", phraseIndex: 3, nbCats: 4, nbTokens: 7 },
      { theme: "Quartier", phraseIndex: 15, nbCats: 4, nbTokens: 7 },
      { theme: "Quartier", phraseIndex: 21, nbCats: 4, nbTokens: 7 },
      { theme: "Chambre", phraseIndex: 12, nbCats: 4, nbTokens: 8 },
      { theme: "Habitation", phraseIndex: 24, nbCats: 4, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 6, nbCats: 4, nbTokens: 8 },
      { theme: "Chambre", phraseIndex: 5, nbCats: 4, nbTokens: 9 },
      { theme: "Chambre", phraseIndex: 14, nbCats: 4, nbTokens: 10 },
      { theme: "Habitation", phraseIndex: 19, nbCats: 4, nbTokens: 10 },
      { theme: "Maison", phraseIndex: 10, nbCats: 5, nbTokens: 5 },
      { theme: "Quartier", phraseIndex: 0, nbCats: 5, nbTokens: 5 },
      { theme: "Maison", phraseIndex: 2, nbCats: 5, nbTokens: 7 },
      { theme: "Maison", phraseIndex: 9, nbCats: 5, nbTokens: 7 },
      { theme: "Chambre", phraseIndex: 4, nbCats: 5, nbTokens: 7 },
      { theme: "Salon", phraseIndex: 5, nbCats: 5, nbTokens: 7 },
      { theme: "Chambre", phraseIndex: 30, nbCats: 5, nbTokens: 8 },
      { theme: "Chambre", phraseIndex: 13, nbCats: 5, nbTokens: 9 },
      { theme: "Chambre", phraseIndex: 9, nbCats: 5, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 6, nbCats: 5, nbTokens: 11 },
      { theme: "Chambre", phraseIndex: 7, nbCats: 5, nbTokens: 11 },
    ]
  },
  {
    num: 6,
    catNouvelle: "adjectif",
    catsActives: ["nom","verbe","déterminant","pivot-dp","pronom","préposition","adjectif"],
    phrases: [
      { theme: "Quartier", phraseIndex: 1, nbCats: 4, nbTokens: 4 },
      { theme: "Chambre", phraseIndex: 0, nbCats: 4, nbTokens: 6 },
      { theme: "Chambre", phraseIndex: 19, nbCats: 4, nbTokens: 6 },
      { theme: "Chambre", phraseIndex: 33, nbCats: 4, nbTokens: 6 },
      { theme: "Habitation", phraseIndex: 22, nbCats: 4, nbTokens: 6 },
      { theme: "Chambre", phraseIndex: 22, nbCats: 4, nbTokens: 7 },
      { theme: "Salon", phraseIndex: 10, nbCats: 4, nbTokens: 7 },
      { theme: "Quartier", phraseIndex: 7, nbCats: 4, nbTokens: 7 },
      { theme: "Chambre", phraseIndex: 21, nbCats: 5, nbTokens: 7 },
      { theme: "Chambre", phraseIndex: 23, nbCats: 5, nbTokens: 9 },
      { theme: "Salon", phraseIndex: 0, nbCats: 5, nbTokens: 9 },
      { theme: "Salon", phraseIndex: 11, nbCats: 5, nbTokens: 9 },
      { theme: "Salon", phraseIndex: 9, nbCats: 5, nbTokens: 11 },
      { theme: "Maison", phraseIndex: 21, nbCats: 5, nbTokens: 12 },
      { theme: "Maison", phraseIndex: 1, nbCats: 6, nbTokens: 8 },
      { theme: "Salon", phraseIndex: 6, nbCats: 6, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 32, nbCats: 6, nbTokens: 12 },
      { theme: "Habitation", phraseIndex: 18, nbCats: 6, nbTokens: 13 },
    ]
  },
  {
    num: 7,
    catNouvelle: "adverbe",
    catsActives: ["nom","verbe","déterminant","pivot-dp","pronom","préposition","adjectif","adverbe"],
    phrases: [
      { theme: "Chambre", phraseIndex: 27, nbCats: 4, nbTokens: 6 },
      { theme: "Quartier", phraseIndex: 17, nbCats: 4, nbTokens: 6 },
      { theme: "Chambre", phraseIndex: 11, nbCats: 4, nbTokens: 7 },
      { theme: "Habitation", phraseIndex: 14, nbCats: 5, nbTokens: 6 },
      { theme: "Chambre", phraseIndex: 8, nbCats: 5, nbTokens: 7 },
      { theme: "Quartier", phraseIndex: 11, nbCats: 5, nbTokens: 7 },
      { theme: "Quartier", phraseIndex: 23, nbCats: 5, nbTokens: 7 },
      { theme: "Salon", phraseIndex: 8, nbCats: 5, nbTokens: 8 },
      { theme: "Habitation", phraseIndex: 2, nbCats: 5, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 24, nbCats: 5, nbTokens: 8 },
      { theme: "Maison", phraseIndex: 7, nbCats: 5, nbTokens: 9 },
      { theme: "Salon", phraseIndex: 7, nbCats: 5, nbTokens: 9 },
      { theme: "Habitation", phraseIndex: 13, nbCats: 5, nbTokens: 9 },
      { theme: "Quartier", phraseIndex: 9, nbCats: 5, nbTokens: 9 },
      { theme: "Quartier", phraseIndex: 20, nbCats: 5, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 18, nbCats: 6, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 10, nbCats: 6, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 22, nbCats: 6, nbTokens: 8 },
      { theme: "Chambre", phraseIndex: 25, nbCats: 6, nbTokens: 9 },
      { theme: "Maison", phraseIndex: 6, nbCats: 6, nbTokens: 10 },
      { theme: "Habitation", phraseIndex: 9, nbCats: 6, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 29, nbCats: 7, nbTokens: 10 },
    ]
  },
  {
    num: 8,
    catNouvelle: "conjonction",
    catsActives: ["nom","verbe","déterminant","pivot-dp","pronom","préposition","adjectif","adverbe","conjonction"],
    phrases: [
      { theme: "Quartier", phraseIndex: 3, nbCats: 5, nbTokens: 6 },
      { theme: "Quartier", phraseIndex: 19, nbCats: 5, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 12, nbCats: 5, nbTokens: 9 },
      { theme: "Chambre", phraseIndex: 15, nbCats: 6, nbTokens: 8 },
      { theme: "Salon", phraseIndex: 1, nbCats: 6, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 18, nbCats: 6, nbTokens: 8 },
      { theme: "Habitation", phraseIndex: 21, nbCats: 6, nbTokens: 9 },
      { theme: "Maison", phraseIndex: 18, nbCats: 6, nbTokens: 10 },
      { theme: "Habitation", phraseIndex: 11, nbCats: 6, nbTokens: 10 },
      { theme: "Habitation", phraseIndex: 12, nbCats: 6, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 26, nbCats: 6, nbTokens: 11 },
      { theme: "Chambre", phraseIndex: 31, nbCats: 6, nbTokens: 12 },
      { theme: "Habitation", phraseIndex: 16, nbCats: 6, nbTokens: 13 },
      { theme: "Maison", phraseIndex: 12, nbCats: 6, nbTokens: 14 },
      { theme: "Habitation", phraseIndex: 23, nbCats: 6, nbTokens: 15 },
      { theme: "Habitation", phraseIndex: 3, nbCats: 6, nbTokens: 16 },
      { theme: "Maison", phraseIndex: 20, nbCats: 6, nbTokens: 22 },
      { theme: "Habitation", phraseIndex: 4, nbCats: 6, nbTokens: 27 },
      { theme: "Quartier", phraseIndex: 14, nbCats: 7, nbTokens: 11 },
      { theme: "Habitation", phraseIndex: 15, nbCats: 7, nbTokens: 12 },
      { theme: "Habitation", phraseIndex: 1, nbCats: 7, nbTokens: 18 },
      { theme: "Habitation", phraseIndex: 17, nbCats: 8, nbTokens: 15 },
      { theme: "Habitation", phraseIndex: 10, nbCats: 8, nbTokens: 17 },
    ]
  },
  {
    num: 9,
    catNouvelle: "pivot",
    catsActives: ["nom","verbe","déterminant","pivot-dp","pronom","préposition","adjectif","adverbe","conjonction","pivot"],
    phrases: [
      { theme: "Quartier", phraseIndex: 2, nbCats: 6, nbTokens: 6 },
      { theme: "Maison", phraseIndex: 4, nbCats: 6, nbTokens: 7 },
      { theme: "Maison", phraseIndex: 11, nbCats: 6, nbTokens: 7 },
      { theme: "Chambre", phraseIndex: 3, nbCats: 6, nbTokens: 8 },
      { theme: "Chambre", phraseIndex: 16, nbCats: 6, nbTokens: 8 },
      { theme: "Chambre", phraseIndex: 20, nbCats: 6, nbTokens: 8 },
      { theme: "Salon", phraseIndex: 13, nbCats: 6, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 4, nbCats: 6, nbTokens: 8 },
      { theme: "Quartier", phraseIndex: 5, nbCats: 6, nbTokens: 8 },
      { theme: "Maison", phraseIndex: 15, nbCats: 6, nbTokens: 10 },
      { theme: "Quartier", phraseIndex: 16, nbCats: 6, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 34, nbCats: 7, nbTokens: 8 },
      { theme: "Maison", phraseIndex: 5, nbCats: 7, nbTokens: 9 },
      { theme: "Quartier", phraseIndex: 8, nbCats: 7, nbTokens: 9 },
      { theme: "Habitation", phraseIndex: 5, nbCats: 7, nbTokens: 10 },
      { theme: "Chambre", phraseIndex: 10, nbCats: 7, nbTokens: 11 },
      { theme: "Chambre", phraseIndex: 17, nbCats: 7, nbTokens: 12 },
      { theme: "Chambre", phraseIndex: 24, nbCats: 7, nbTokens: 12 },
      { theme: "Maison", phraseIndex: 14, nbCats: 7, nbTokens: 13 },
      { theme: "Maison", phraseIndex: 16, nbCats: 7, nbTokens: 13 },
      { theme: "Chambre", phraseIndex: 1, nbCats: 7, nbTokens: 13 },
      { theme: "Maison", phraseIndex: 13, nbCats: 7, nbTokens: 16 },
      { theme: "Salon", phraseIndex: 2, nbCats: 8, nbTokens: 12 },
      { theme: "Salon", phraseIndex: 4, nbCats: 8, nbTokens: 12 },
      { theme: "Habitation", phraseIndex: 8, nbCats: 8, nbTokens: 15 },
    ]
  },
];
