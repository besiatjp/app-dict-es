// m3-alignement.js — Module 3 : Alignement LCS des tokens
// Dépendances : m1-nettoyage.js (normaliser, supprimeAccents), m2-tokens.js (tokeniser)
// Utilisé quand le compte de mots est correct mais le découpage peut différer

// ── LCS sur tokens normalisés ─────────────────────────────────────────────
// Retourne la longueur de la sous-séquence commune la plus longue

function lcsLongueur(as, bs) {
  const m = as.length, n = bs.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = as[i-1] === bs[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp;
}

// Remonte le tableau LCS pour produire les paires d'alignement
// Chaque paire : { type: 'match'|'saisie'|'original', s?, o?, si?, oi? }
// si/oi = index dans le tableau original pour retrouver le token brut

function lcsAligner(tokSaisie, tokOriginal) {
  const ns = tokSaisie.map(t => normaliser(t));
  const no = tokOriginal.map(t => normaliser(t));
  const dp = lcsLongueur(ns, no);
  const paires = [];
  let i = tokSaisie.length, j = tokOriginal.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ns[i-1] === no[j-1]) {
      paires.unshift({ type: 'match', s: tokSaisie[i-1], o: tokOriginal[j-1], si: i-1, oi: j-1 });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      paires.unshift({ type: 'original', o: tokOriginal[j-1], oi: j-1 });
      j--;
    } else {
      paires.unshift({ type: 'saisie', s: tokSaisie[i-1], si: i-1 });
      i--;
    }
  }
  return paires;
}

// ── Fusion des élisions manquantes ────────────────────────────────────────
// Détecte les patterns : token 'saisie' court (élision) + token 'match' suivant
// dont la concaténation correspond à un token 'original' manquant

const PREFIXES_ELISION = new Set(['j', 'l', 'd', 'm', 't', 's', 'n', 'c', 'qu', 'lorsqu', 'jusque', 'puisqu', 'quoiqu']);

function fusionnerElisionsAlignement(paires) {
  const result = [];
  let i = 0;
  while (i < paires.length) {
    const p = paires[i];

    // Cherche : token 'original' manquant contenant une apostrophe
    // suivi ou précédé d'un token 'saisie' qui est le préfixe sans apostrophe
    if (p.type === 'original' && p.o.includes("'")) {
      const parts = p.o.split("'");
      const prefixe = normaliser(parts[0]);

      // Cas : le préfixe est un token 'saisie' isolé juste avant
      const dernier = result[result.length - 1];
      if (dernier && dernier.type === 'saisie' && normaliser(dernier.s) === prefixe) {
        // Fusion : remplace le dernier 'saisie' par une erreur apostrophe
        result.pop();
        // Cherche le token 'match' ou 'saisie' correspondant au reste
        const suite = parts.slice(1).join("'");
        result.push({
          type: 'erreur_apostrophe',
          s: dernier.s + ' ' + (paires[i+1]?.s || suite),
          o: p.o,
          erreur: { type: 'apostrophe_manquante', detail: 'apostrophe manquante' }
        });
        // Consommer aussi le token suivant si c'est un match sur le reste
        if (paires[i+1] && paires[i+1].type === 'match' &&
            normaliser(paires[i+1].s) === normaliser(suite)) {
          i += 2; continue;
        }
        i++; continue;
      }

      // Cas : le préfixe est un token 'saisie' isolé juste après
      if (paires[i+1] && paires[i+1].type === 'saisie' && normaliser(paires[i+1].s) === prefixe) {
        const suite = parts.slice(1).join("'");
        result.push({
          type: 'erreur_apostrophe',
          s: paires[i+1].s + ' ' + (paires[i+2]?.s || suite),
          o: p.o,
          erreur: { type: 'apostrophe_manquante', detail: 'apostrophe manquante' }
        });
        i += 2; continue;
      }
    }

    result.push(p);
    i++;
  }
  return result;
}

// ── Extraction des erreurs depuis les paires alignées ─────────────────────

function extraireErreursAlignes(tokSaisie, tokOriginal) {
  const paires = lcsAligner(tokSaisie, tokOriginal);
  const pairesF = fusionnerElisionsAlignement(paires);
  const erreurs = [];
  let indexEffectif = 0;

  pairesF.forEach(p => {
    if (p.type === 'match') {
      indexEffectif++;
      return;
    }
    if (p.type === 'erreur_apostrophe') {
      erreurs.push({
        index: indexEffectif,
        attendu: p.o,
        saisi: p.s,
        ...p.erreur
      });
      indexEffectif++;
      return;
    }
    if (p.type === 'original') {
      // Mot manquant dans la saisie
      erreurs.push({
        index: indexEffectif,
        attendu: p.o,
        saisi: '',
        ...classerErreur(p.o, '')
      });
      indexEffectif++;
      return;
    }
    if (p.type === 'saisie') {
      // Mot en trop — on l'attache à l'index courant
      erreurs.push({
        index: indexEffectif,
        attendu: '',
        saisi: p.s,
        type: 'en_trop',
        detail: `"${p.s}" en trop`
      });
      return;
    }
  });

  return erreurs;
}
