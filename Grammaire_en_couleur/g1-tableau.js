// g1-tableau.js — Module 1 : Tableau muet GEC

const CASES_GEC = [
  // Ligne haute
  { id: 'pronom',       cat: 'pronom',       couleur: '#B07A8A',
    top:0,  left:0,  width:42, height:34 },
  { id: 'pivot',        cat: 'pivot',        couleur: null,
    top:0,  left:42, width:9,  height:22, classe: 'pivot-pron-adv' },
  { id: 'adverbe',      cat: 'adverbe',      couleur: '#7A9BB5',
    top:0,  left:51, width:49, height:34 },

  // Ligne milieu : nom | interjection (muette) | adjectif | verbe
  { id: 'nom',          cat: 'nom',          couleur: '#7AAF8A',
    top:34, left:0,  width:30, height:48 },
  { id: 'interjection', cat: 'interjection', couleur: '#A8A8A0',
    top:34, left:30, width:7,  height:22 },
  { id: 'adjectif',     cat: 'adjectif',     couleur: '#9B8EC4',
    top:56, left:30, width:21, height:26 },
  { id: 'verbe',        cat: 'verbe',        couleur: '#E8A868',
    top:34, left:51, width:49, height:48 },

  // Ligne basse : déterminant | pivot-dp | préposition | conjonction
  { id: 'determinant',  cat: 'déterminant',  couleur: '#D4C060',
    top:82, left:0,  width:26, height:18 },
  { id: 'pivot-dp',     cat: 'pivot-dp',     couleur: null,
    top:82, left:26, width:10, height:18, classe: 'pivot-det-prep' },
  { id: 'preposition',  cat: 'préposition',  couleur: '#D07070',
    top:82, left:36, width:14, height:18 },
  { id: 'conjonction',  cat: 'conjonction',  couleur: '#7A8896',
    top:82, left:50, width:50, height:18 },
];

function construireTableau() {
  const tableau = document.getElementById('tableau-gec');
  tableau.innerHTML = '';

  CASES_GEC.forEach(c => {
    const div = document.createElement('div');
    div.className = 'gec-case inactive' + (c.classe ? ' ' + c.classe : '');
    div.dataset.cat = c.cat;
    div.id = 'case-' + c.id;

    div.style.top    = c.top    + '%';
    div.style.left   = c.left   + '%';
    div.style.width  = c.width  + '%';
    div.style.height = c.height + '%';
    if (c.couleur) div.style.background = c.couleur;

    div.addEventListener('dragover', e => {
      if (div.classList.contains('inactive')) return;
      e.preventDefault();
      div.classList.add('drag-over');
    });
    div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
    div.addEventListener('drop', e => {
      if (div.classList.contains('inactive')) return;
      e.preventDefault();
      div.classList.remove('drag-over');
      gererDrop(e.dataTransfer.getData('text/plain'), c.cat);
    });

    tableau.appendChild(div);
  });
}

function activerCasesPourPhrase(tokens) {
  const cats = new Set(tokens.map(t => t.cat));
  CASES_GEC.forEach(c => {
    const el = document.getElementById('case-' + c.id);
    if (!el) return;
    // Interjection : toujours grisée (jamais dans le corpus)
    if (c.id === 'interjection') { el.classList.add('inactive'); return; }
    const active = c.id === 'pivot'    ? cats.has('pivot')
                 : c.id === 'pivot-dp' ? cats.has('pivot-dp')
                 : cats.has(c.cat);
    el.classList.toggle('inactive', !active);
    el.style.transition = 'opacity 0.4s, filter 0.4s';
  });
}

function placerMotDansCase(mot, catCible) {
  const caseEl = catCible === 'pivot'    ? document.getElementById('case-pivot')
               : catCible === 'pivot-dp' ? document.getElementById('case-pivot-dp')
               : document.querySelector(`.gec-case[data-cat="${catCible}"]`);
  if (!caseEl) return;
  const span = document.createElement('span');
  span.className = 'mot-place';
  span.textContent = mot;
  caseEl.appendChild(span);
}

function pulserCase(cat) {
  const caseEl = cat === 'pivot'    ? document.getElementById('case-pivot')
               : cat === 'pivot-dp' ? document.getElementById('case-pivot-dp')
               : document.querySelector(`.gec-case[data-cat="${cat}"]`);
  if (!caseEl) return;
  caseEl.classList.remove('pulse');
  void caseEl.offsetWidth;
  caseEl.classList.add('pulse');
  setTimeout(() => caseEl.classList.remove('pulse'), 2000);
}

function viderTableau() {
  document.querySelectorAll('.mot-place').forEach(el => el.remove());
}
