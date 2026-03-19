// m2-tokens.js — Module 2 : Tokenisation
// Dépendances : m1-nettoyage.js (normaliser, fusionnerElisions)

// Tokenise en mots (sans ponctuation attachée)
function tokeniser(t) {
  return t.match(/[\wàâäéèêëîïôùûüçœæÀÂÄÉÈÊËÎÏÔÙÛÜÇŒÆ''-]+/gi) || [];
}

// Tokenise en conservant la ponctuation attachée (ex. "maison," "j'")
function tokeniserBrut(t) {
  return t.match(/[\wàâäéèêëîïôùûüçœæÀÂÄÉÈÊËÎÏÔÙÛÜÇŒÆ''-]+[.,;:!?]*/gi) || [];
}

// Compte les mots réels — insensible aux élisions manquantes et variantes graphiques
function compterMotsReels(phrase) {
  let p = normaliser(phrase);
  p = fusionnerElisions(p);
  let n = 0;
  (p.match(/[\wàâäéèêëîïôùûüçœæ]+/gi) || []).forEach(m => {
    n += m.split(/['-]/).filter(Boolean).length;
  });
  return n;
}
