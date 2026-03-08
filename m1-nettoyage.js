// m1-nettoyage.js — Module 1 : Nettoyage et normalisation
// Dépendances : aucune

// Formes graphiques équivalentes acceptées
const FORMES_EQUIVALENTES = {
  "w.c.": "wc",
  "w.c":  "wc",
};

// Élisions reconnues pour la fusion avant comptage
const ELISIONS = ["l", "d", "j", "m", "t", "s", "n", "c", "qu", "lorsqu", "jusque", "puisqu", "quoiqu"];

// Fusionne les élisions sans apostrophe : "l office" → "l'office"
function fusionnerElisions(t) {
  const re = new RegExp(`\\b(${ELISIONS.join('|')})\\s+([\\wàâäéèêëîïôùûüçœæ])`, 'gi');
  return t.replace(re, (_, el, suite) => `${el}'${suite}`);
}

// Nettoyage de la saisie brute
function nettoyerTexte(t) {
  return fusionnerElisions(
    t
      .trim()
      .replace(/\s*'\s*/g, "'")            // espace autour d'apostrophe : "j' ouvre" → "j'ouvre"
      .replace(/\s+([,;:!?])/g, '$1')      // espace parasite avant ponctuation
      .replace(/([,;:!?])(\w)/g, '$1 $2')  // espace manquant après ponctuation
      .replace(/\s+/g, ' ')                // doubles espaces résiduels
  );
}

// Normalisation pour comparaison exacte (variantes incluses)
function normaliser(t) {
  let r = t.trim().toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[«»""]/g, '"');
  for (const [forme, canon] of Object.entries(FORMES_EQUIVALENTES)) {
    r = r.replaceAll(forme, canon);
  }
  return r;
}

// Suppression des accents pour comparaison phonétique
function supprimeAccents(t) {
  return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
