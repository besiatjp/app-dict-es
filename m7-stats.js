// m7-stats.js — Module 7 : Statistiques
// Dépendances : data.js (DICTEES)

function chargerStats() {
  try { return JSON.parse(localStorage.getItem('dictees_stats') || '{}'); }
  catch { return {}; }
}

function sauvegarderStats(s) {
  localStorage.setItem('dictees_stats', JSON.stringify(s));
}

function getStatPhrase(theme, i) {
  const s = chargerStats();
  return s[theme]?.[i] || { reussie: false, tentatives: 0, indices: 0, erreurs: {} };
}

function enregistrerTentative(theme, index, reussie, nbInd, mots) {
  const stats = chargerStats();
  if (!stats[theme]) stats[theme] = {};
  const s = stats[theme][index] || { reussie: false, tentatives: 0, indices: 0, erreurs: {} };
  s.tentatives++; s.indices += nbInd;
  if (reussie) s.reussie = true;
  mots.forEach(m => { s.erreurs[m] = (s.erreurs[m] || 0) + 1; });
  stats[theme][index] = s;
  sauvegarderStats(stats);
}

function getStatsTheme(theme) {
  const stats = chargerStats();
  const th    = stats[theme] || {};
  const total = DICTEES[theme].length;
  const reussies   = Object.values(th).filter(s => s.reussie).length;
  const tentatives = Object.values(th).reduce((n, s) => n + s.tentatives, 0);
  const indices    = Object.values(th).reduce((n, s) => n + s.indices, 0);
  const erreurs    = {};
  Object.values(th).forEach(s =>
    Object.entries(s.erreurs||{}).forEach(([m,c]) => { erreurs[m]=(erreurs[m]||0)+c; })
  );
  const erreursFrequentes = Object.entries(erreurs).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return { total, reussies, tentatives, indices, erreursFrequentes };
}

function afficherStats() {
  const panneau = document.getElementById('panneau-stats');
  const contenu = document.getElementById('contenu-stats');
  contenu.innerHTML = '';
  Object.keys(DICTEES).forEach(theme => {
    const s   = getStatsTheme(theme);
    const pct = s.total > 0 ? Math.round(s.reussies/s.total*100) : 0;
    const moy = s.tentatives > 0 ? (s.indices/s.tentatives).toFixed(1) : '—';
    let errHtml = '';
    if (s.erreursFrequentes.length > 0) {
      errHtml = `<div class="stats-erreurs">
        <div class="stats-erreurs-titre">Mots les plus souvent ratés :</div>
        <ul>${s.erreursFrequentes.map(([m,n])=>`<li><em>${m}</em> <span class="count-erreur">${n}×</span></li>`).join('')}</ul>
      </div>`;
    }
    contenu.innerHTML += `<div class="stats-theme">
      <div class="stats-theme-titre">${theme}</div>
      <div class="stats-barre-wrap"><div class="stats-barre"><div class="stats-barre-fill" style="width:${pct}%"></div></div><span class="stats-pct">${pct}%</span></div>
      <div class="stats-chiffres">
        <span>✓ ${s.reussies}/${s.total}</span>
        <span>↺ ${s.tentatives} tentative${s.tentatives!==1?'s':''}</span>
        <span>💡 ${moy}/tentative</span>
      </div>
      ${errHtml}
    </div>`;
  });
  if (!contenu.innerHTML)
    contenu.innerHTML = '<p class="stats-vide">Aucune statistique pour le moment.</p>';
  panneau.classList.remove('cache');
}
