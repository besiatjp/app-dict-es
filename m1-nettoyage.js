// m1-nettoyage.js — Module 1 : Nettoyage et normalisation
// Dépendances : aucune

// Formes graphiques équivalentes acceptées
const FORMES_EQUIVALENTES = {
  "w.c.": "wc",
  "w.c":  "wc",
};

// Élisions reconnues pour la fusion avant comptage
const ELISIONS = ["l", "d", "j", "m", "t", "s", "n", "c", "qu", "lorsqu", "jusque", "puisqu", "quoiqu"];

// Fusionne les élisions avec espace : "l office" → "l'office"
// Utilise (^|[ ]) au lieu de \b pour éviter de matcher en fin de mot (ex. "accrochés o" ne devient PAS "accrochés'o")
function fusionnerElisions(t) {
  const elisionsTries = [...ELISIONS].sort((a, b) => b.length - a.length);
  const re = new RegExp('(^|[ ])(' + elisionsTries.join('|') + ') ([\\wàâäéèêëîïôùûüçœæ])', 'gi');
  return t.replace(re, (_, sep, el, suite) => `${sep}${el}'${suite}`);
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
