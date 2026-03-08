// m3-alignement.js — Module 3 : Alignement LCS des tokens
// Dépendances : m1-nettoyage.js (normaliser), m4-classes.js (classerErreur)

// ── Normalisation pour le LCS (sans ponctuation) ──────────────────────────
function normaliserLCS(t) {
  return normaliser(t).replace(/[.,;:!?«»"'()\-]/g, '').trim();
}

// ── LCS sur tokens normalisés ─────────────────────────────────────────────
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

function lcsAligner(tokSaisie, tokOriginal) {
  // Normaliser sans ponctuation pour le LCS — "quartier." matche "quartier"
  const ns = tokSaisie.map(normaliserLCS);
  const no = tokOriginal.map(normaliserLCS);
  const dp = lcsLongueur(ns, no);
  const paires = [];
  let i = tokSaisie.length, j = tokOriginal.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ns[i-1] === no[j-1] && ns[i-1] !== '') {
      paires.unshift({ type: 'match', s: tokSaisie[i-1], o: tokOriginal[j-1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      paires.unshift({ type: 'original', o: tokOriginal[j-1] });
      j--;
    } else {
      paires.unshift({ type: 'saisie', s: tokSaisie[i-1] });
      i--;
    }
  }
  return paires;
}

// ── Fusion des élisions manquantes ────────────────────────────────────────
// Détecte : saisie[préfixe] + saisie[suite] + original[préfixe'suite]
// → fusionne en une erreur apostrophe_manquante

function fusionnerElisionsAlignement(paires) {
  const result = [];
  let i = 0;
  while (i < paires.length) {
    const p = paires[i];

    if (p.type === 'original' && normaliser(p.o).includes("'")) {
      const parts   = normaliser(p.o).split("'");
      const prefixe = parts[0];
      const suite   = parts.slice(1).join("'");
      const avant1  = result[result.length - 1];
      const avant2  = result[result.length - 2];
      const suivant = paires[i + 1];

      // Cas A : result[-2]=saisie[prefixe] + result[-1]=saisie[suite] + original
      if (avant2 && avant2.type === 'saisie' && normaliserLCS(avant2.s) === prefixe &&
          avant1 && avant1.type === 'saisie' && normaliserLCS(avant1.s) === suite) {
        result.pop(); result.pop();
        result.push({ type: 'erreur', s: avant2.s + ' ' + avant1.s, o: p.o,
          erreurType: 'apostrophe_manquante', erreurDetail: 'apostrophe manquante' });
        i++; continue;
      }

      // Cas B : result[-1]=saisie[prefixe] + original + suivant=saisie[suite] ou match[suite]
      if (avant1 && avant1.type === 'saisie' && normaliserLCS(avant1.s) === prefixe &&
          suivant && (suivant.type === 'saisie' || suivant.type === 'match') &&
          normaliserLCS(suivant.s) === suite) {
        result.pop();
        result.push({ type: 'erreur', s: avant1.s + ' ' + suivant.s, o: p.o,
          erreurType: 'apostrophe_manquante', erreurDetail: 'apostrophe manquante' });
        i += 2; continue;
      }
    }

    result.push(p);
    i++;
  }
  return result;
}

// ── Fusion des tokens proches (Levenshtein) ──────────────────────────────
// Après le LCS, les tokens erronés non identiques restent en paires saisie+original
// On les aligne si leur distance Levenshtein est suffisamment faible

function levenshteinLocal(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

function fusionnerProches(paires) {
  const result = [];
  let i = 0;
  while (i < paires.length) {
    const p = paires[i];
    const suivant = paires[i+1];

    const testerProximite = (tokS, tokO) => {
      const ns = supprimeAccents(normaliserLCS(tokS));
      const no = supprimeAccents(normaliserLCS(tokO));
      if (!ns || !no) return false;
      const dist = levenshteinLocal(ns, no);
      return dist / Math.max(ns.length, no.length) <= 0.5;
    };

    if (p.type === 'saisie' && suivant && suivant.type === 'original') {
      if (testerProximite(p.s, suivant.o)) {
        result.push({ type: 'proche', s: p.s, o: suivant.o });
        i += 2; continue;
      }
    }
    if (p.type === 'original' && suivant && suivant.type === 'saisie') {
      if (testerProximite(suivant.s, p.o)) {
        result.push({ type: 'proche', s: suivant.s, o: p.o });
        i += 2; continue;
      }
    }
    result.push(p); i++;
  }
  return result;
}

// ── Extraction des erreurs depuis les paires alignées ─────────────────────

function extraireErreursAlignes(tokSaisie, tokOriginal) {
  const paires  = lcsAligner(tokSaisie, tokOriginal);
  const pairesE = fusionnerElisionsAlignement(paires);
  const pairesF = fusionnerProches(pairesE);
  const erreurs = [];
  let idx = 0;

  pairesF.forEach(p => {
    if (p.type === 'match') {
      // Même token dans les deux — vérifier quand même accent/ponctuation
      if (normaliser(p.s) !== normaliser(p.o)) {
        erreurs.push({ index: idx, attendu: p.o, saisi: p.s, ...classerErreur(p.o, p.s) });
      }
      idx++;
      return;
    }

    if (p.type === 'proche') {
      // Tokens proches mais différents — classifier normalement
      erreurs.push({ index: idx, attendu: p.o, saisi: p.s, ...classerErreur(p.o, p.s) });
      idx++;
      return;
    }

    if (p.type === 'erreur') {
      // Erreur d'apostrophe fusionnée
      erreurs.push({
        index: idx,
        attendu: p.o,
        saisi: p.s,
        type: p.erreurType || 'apostrophe_manquante',
        detail: p.erreurDetail || 'apostrophe manquante'
      });
      idx++;
      return;
    }

    if (p.type === 'original') {
      // Token attendu absent de la saisie
      erreurs.push({ index: idx, attendu: p.o, saisi: '', ...classerErreur(p.o, '') });
      idx++;
      return;
    }

    if (p.type === 'saisie') {
      // Token en trop dans la saisie (ne devrait pas arriver si compte de mots vérifié avant)
      erreurs.push({ index: idx, attendu: '', saisi: p.s, type: 'en_trop', detail: `"${p.s}" en trop` });
      return;
    }
  });

  return erreurs;
}
