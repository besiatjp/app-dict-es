// g1-tableau.js — Module 1 : Tableau muet GEC

const CASES_GEC = [
  { id: 'pronom',       cat: 'pronom',       couleur: '#B07A8A',
    top:0,   left:0,   width:42,  height:32 },
  { id: 'pivot',        cat: 'pivot',        couleur: null,
    top:0,   left:42,  width:9,   height:20,  classe: 'pivot-pron-adv' },
  { id: 'adverbe',      cat: 'adverbe',      couleur: '#7A9BB5',
    top:0,   left:51,  width:49,  height:32 },
  { id: 'nom',          cat: 'nom',          couleur: '#7AAF8A',
    top:32,  left:0,   width:30,  height:50 },
  { id: 'interjection', cat: 'interjection', couleur: '#A8A8A0',
    top:32,  left:30,  width:14,  height:20 },
  { id: 'adjectif',     cat: 'adjectif',     couleur: '#9B8EC4',
    top:52,  left:30,  width:21,  height:30 },
  { id: 'verbe',        cat: 'verbe',        couleur: '#E8A868',
    top:32,  left:51,  width:49,  height:50 },

  // Bas : déterminant | pivot-dp | préposition | conjonction
  { id: 'determinant',  cat: 'déterminant',  couleur: '#D4C060',
    top:82,  left:0,   width:28,  height:18 },
  // Pivot det/prép — entre déterminant et préposition, chevauchant les deux
  { id: 'pivot-dp',     cat: 'pivot-dp',     couleur: null,
    top:82,  left:28,  width:12,  height:18,  classe: 'pivot-det-prep' },
  { id: 'preposition',  cat: 'préposition',  couleur: '#D07070',
    top:82,  left:40,  width:8,   height:18 },
  { id: 'conjonction',  cat: 'conjonction',  couleur: '#7A8896',
    top:82,  left:48,  width:52,  height:18 },
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
      const motId = e.dataTransfer.getData('text/plain');
      gererDrop(motId, c.cat);
    });

    tableau.appendChild(div);
  });
}

// Active les cases selon les catégories présentes dans les tokens de la phrase
function activerCasesPourPhrase(tokens) {
  const catsPresentes = new Set(tokens.map(t => t.cat));
  CASES_GEC.forEach(c => {
    const el = document.getElementById('case-' + c.id);
    if (!el) return;
    let active = false;
    if (c.id === 'pivot') {
      active = catsPresentes.has('pivot');
    } else if (c.id === 'pivot-dp') {
      active = catsPresentes.has('pivot-dp');
    } else {
      active = catsPresentes.has(c.cat);
    }
    el.classList.toggle('inactive', !active);
    el.style.transition = 'opacity 0.4s, filter 0.4s';
  });
}

function placerMotDansCase(mot, catCible) {
  let caseEl;
  if (catCible === 'pivot') {
    caseEl = document.getElementById('case-pivot');
  } else if (catCible === 'pivot-dp') {
    caseEl = document.getElementById('case-pivot-dp');
  } else {
    caseEl = document.querySelector(`.gec-case[data-cat="${catCible}"]`);
  }
  if (!caseEl) return;
  const span = document.createElement('span');
  span.className = 'mot-place';
  span.textContent = mot;
  caseEl.appendChild(span);
}

function pulserCase(cat) {
  let caseEl;
  if (cat === 'pivot') caseEl = document.getElementById('case-pivot');
  else if (cat === 'pivot-dp') caseEl = document.getElementById('case-pivot-dp');
  else caseEl = document.querySelector(`.gec-case[data-cat="${cat}"]`);
  if (!caseEl) return;
  caseEl.classList.remove('pulse');
  void caseEl.offsetWidth;
  caseEl.classList.add('pulse');
  setTimeout(() => caseEl.classList.remove('pulse'), 2000);
}

function viderTableau() {
  document.querySelectorAll('.mot-place').forEach(el => el.remove());
}
