// g2-phrase.js — Module 2 : Affichage et gestion des mots de la phrase

// Construit les tokens draggables à partir des tokens annotés
function afficherMots(tokens) {
  const zone = document.getElementById('mots-phrase');
  zone.innerHTML = '';

  tokens.forEach((token, i) => {
    const div = document.createElement('div');
    div.className = 'mot-token';
    div.textContent = token.mot;
    div.dataset.index = i;
    div.dataset.cat   = token.cat;
    div.draggable     = true;

    div.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', String(i));
      div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
    });

    zone.appendChild(div);
  });
}

// Marque un mot comme placé (le retire visuellement de la zone)
function marquerMotPlace(index) {
  const el = document.querySelector(`.mot-token[data-index="${index}"]`);
  if (el) el.classList.add('place');
}

// Remet un mot à sa place (après erreur)
function remettreMotEnPlace(index) {
  const el = document.querySelector(`.mot-token[data-index="${index}"]`);
  if (el) {
    el.classList.remove('place');
    // Petit effet visuel : flash discret
    el.style.transition = 'background 0.3s';
    el.style.background = '#FEF3C7';
    setTimeout(() => { el.style.background = ''; }, 400);
  }
}

// Vérifie si tous les mots sont placés
function tousLesMotsPlaces(tokens) {
  return tokens.every((_, i) => {
    const el = document.querySelector(`.mot-token[data-index="${i}"]`);
    return el && el.classList.contains('place');
  });
}

// Animation : chaque mot vole depuis sa case du tableau jusqu'à sa position dans la rangée
function remettreMotsEnOrdre(tokens, callback) {
  const DELAI_ENTRE = 180;   // ms entre chaque mot
  const DUREE_VOL   = 520;   // ms de chaque animation de vol

  // 1. Collecter les positions cibles (dans la zone du bas) AVANT de toucher quoi que ce soit
  const elements = tokens.map((_, i) =>
    document.querySelector(`.mot-token[data-index="${i}"]`)
  );

  // Rendre les tokens invisibles dans leur zone (ils sont "place" donc déjà cachés)
  // On va créer des clones volants pour l'animation

  // 2. Pour chaque mot, trouver le mot-place correspondant dans le tableau
  //    et récupérer sa position absolue
  const motsDansTableau = document.querySelectorAll('.mot-place');
  // Construire un map mot → position dans le tableau (premier trouvé)
  const positionsTableau = {};
  motsDansTableau.forEach(el => {
    const texte = el.textContent;
    if (!positionsTableau[texte]) {
      positionsTableau[texte] = el.getBoundingClientRect();
    }
  });

  // 3. Récupérer les positions cibles dans la zone du bas
  //    Les éléments sont "place" (display:none), on les rend visibles un instant pour mesurer
  elements.forEach(el => {
    if (el) {
      el.style.visibility = 'hidden';
      el.classList.remove('place');
    }
  });

  // Forcer un reflow pour avoir les positions
  document.body.offsetHeight;

  const positionsCibles = elements.map(el =>
    el ? el.getBoundingClientRect() : null
  );

  // Re-cacher les éléments originaux — ils resteront cachés pendant le vol
  elements.forEach(el => {
    if (el) {
      el.style.visibility = 'hidden';
    }
  });

  // 4. Vider le tableau (les mots-place disparaissent)
  viderTableau();

  // 5. Animer chaque mot en séquence
  tokens.forEach((token, i) => {
    const el     = elements[i];
    const cible  = positionsCibles[i];
    const depart = positionsTableau[token.mot];
    if (!el || !cible) return;

    setTimeout(() => {
      // Créer un clone volant
      const clone = document.createElement('div');
      clone.className = 'mot-token mot-volant';
      clone.textContent = token.mot;
      clone.style.cssText = `
        position: fixed;
        left: ${depart ? depart.left : cible.left + 60}px;
        top:  ${depart ? depart.top  : cible.top  - 60}px;
        width: ${cible.width}px;
        margin: 0;
        z-index: 999;
        pointer-events: none;
        border-color: ${couleurCat(token.cat)};
        transition: left ${DUREE_VOL}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    top  ${DUREE_VOL}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    opacity 0.2s;
        opacity: 1;
      `;
      document.body.appendChild(clone);

      // Déclencher le vol vers la cible après un frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clone.style.left = cible.left + 'px';
          clone.style.top  = cible.top  + 'px';
        });
      });

      // À l'arrivée : afficher l'élément original, supprimer le clone
      setTimeout(() => {
        clone.remove();
        el.style.visibility = '';
        el.style.borderColor = couleurCat(token.cat);
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.25s';
        requestAnimationFrame(() => { el.style.opacity = '1'; });
      }, DUREE_VOL);

    }, i * DELAI_ENTRE);
  });

  // 6. Callback après la fin de toutes les animations
  const duree = tokens.length * DELAI_ENTRE + DUREE_VOL + 300;
  setTimeout(() => { if (callback) callback(); }, duree);
}

// Couleur de bordure selon catégorie (palette GEC douce)
function couleurCat(cat) {
  const map = {
    'nom':          '#7AAF8A',
    'verbe':        '#E8A868',
    'déterminant':  '#D4C060',
    'pronom':       '#B07A8A',
    'adjectif':     '#9B8EC4',
    'préposition':  '#D07070',
    'adverbe':      '#7A9BB5',
    'conjonction':  '#7A8896',
    'interjection': '#A8A8A0',
    'pivot':        '#937898',
  };
  return map[cat] || '#E2E8F0';
}

// Réinitialise tous les mots (déplace)
function reinitialiserMots() {
  document.querySelectorAll('.mot-token').forEach(el => {
    el.classList.remove('place');
    el.style.background = '';
  });
}
