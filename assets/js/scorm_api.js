// ── Resize iframe Moodle (hauteur dynamique bidirectionnelle) ───────────
function resizeLMSIframe() {
  // Mesurer la hauteur réelle du contenu (getBoundingClientRect évite les accumulations de scrollHeight)
  var content = document.getElementById('activity-content') || document.body;
  var height = Math.ceil(content.getBoundingClientRect().height) + 32; // marge de sécurité

  try {
    // 1. Modifier l'iframe directement
    if (window.frameElement) {
      window.frameElement.style.setProperty('height', height + 'px', 'important');
      window.frameElement.style.setProperty('min-height', height + 'px', 'important');
      window.frameElement.setAttribute('scrolling', 'no');
      window.frameElement.style.setProperty('overflow', 'hidden', 'important');
    }
    
    // 2. Ajuster les conteneurs du lecteur SCORM de Moodle parent (Boost & Classic)
    if (window.parent && window.parent.document) {
      var pd = window.parent.document;
      ['scorm_content', 'scorm_layout', 'scorm_toc', 'scormpage'].forEach(function(id) {
        var el = pd.getElementById(id);
        if (el) { 
          el.style.setProperty('height', 'auto', 'important'); 
          el.style.setProperty('overflow', 'visible', 'important'); 
        }
      });
      var so = pd.getElementById('scorm_object');
      if (so) {
        so.style.setProperty('height', height + 'px', 'important');
        so.style.setProperty('min-height', height + 'px', 'important');
        so.style.setProperty('overflow', 'hidden', 'important');
      }
    }
    
    // 3. Envoyer postMessage pour Moodle 4+ (compatibilité native)
    window.parent.postMessage({ type: 'setHeight', height: height }, '*');
    window.parent.postMessage({ type: 'resize', height: height }, '*');
  } catch(e) {
    console.warn("[SCORM] Erreur d'ajustement de hauteur :", e);
  }
}

// Debounce pour éviter la surcharge de layout
var _resizeTimer;
function debouncedResize() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(resizeLMSIframe, 50);
}

// Observateur de redimensionnement de contenu (ResizeObserver)
if (typeof ResizeObserver !== 'undefined') {
  var _ro = new ResizeObserver(debouncedResize);
  _ro.observe(document.getElementById('activity-content') || document.body);
}

// Observateur de modification du DOM (MutationObserver pour les apparitions dynamiques)
if (typeof MutationObserver !== 'undefined') {
  var _mo = new MutationObserver(debouncedResize);
  _mo.observe(document.body, { childList: true, subtree: true });
}

// Écouter les messages venant d'autres composants si nécessaire
window.addEventListener('message', function(e) {
  var h = 0;
  if (e.data && e.data.type === 'setHeight' && e.data.height) {
    h = Math.ceil(e.data.height) + 32;
  } else if (e.data && e.data.type === 'resize' && e.data.height) {
    h = Math.ceil(e.data.height) + 32;
  }
  if (h > 0) {
    try {
      if (window.frameElement) {
        window.frameElement.style.setProperty('height', h + 'px', 'important');
        window.frameElement.style.setProperty('min-height', h + 'px', 'important');
        window.frameElement.setAttribute('scrolling', 'no');
      }
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'setHeight', height: h }, '*');
      }
    } catch(err) {}
  }
});

// Appels initiaux
window.addEventListener('load', resizeLMSIframe);
document.addEventListener('DOMContentLoaded', resizeLMSIframe);

// Exposer les alias de fonctions courants pour l'IA ou les scripts générés
window.requestResize = debouncedResize;
window.resizeIframe = debouncedResize;
