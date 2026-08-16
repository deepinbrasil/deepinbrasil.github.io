// Controle de tema: automático (segue o horário), claro ou escuro —
// escolha do visitante, salva no navegador (localStorage).
//
// A definição inicial (que evita flash do tema errado) roda inline no
// <head>, antes deste arquivo carregar. Aqui cuidamos de: reagir ao clique
// nos botões de troca, salvar a preferência, e reavaliar periodicamente
// quando a preferência é "automático".
(function () {
  var KEY = 'deepinbrasil-theme';

  function getPreference() {
    try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; }
  }
  function setPreference(pref) {
    try { localStorage.setItem(KEY, pref); } catch (e) { /* localStorage indisponível, tudo bem */ }
  }
  function computeAutoTheme() {
    var hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }
  function resolveTheme(pref) {
    return pref === 'auto' ? computeAutoTheme() : pref;
  }
  function applyTheme(pref) {
    var resolved = resolveTheme(pref);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-pref', pref);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: resolved, pref: pref } }));
  }
  function updateToggleUI(pref) {
    document.querySelectorAll('.theme-toggle button').forEach(function (btn) {
      var isActive = btn.dataset.pref === pref;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    var pref = getPreference();
    updateToggleUI(pref);

    document.querySelectorAll('.theme-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newPref = btn.dataset.pref;
        setPreference(newPref);
        applyTheme(newPref);
        updateToggleUI(newPref);
      });
    });

    // Reavalia a cada minuto — só importa quando a preferência é "automático",
    // para quem deixa a aba aberta atravessar o amanhecer/anoitecer.
    setInterval(function () {
      var currentPref = getPreference();
      if (currentPref === 'auto') {
        var resolved = resolveTheme(currentPref);
        if (document.documentElement.getAttribute('data-theme') !== resolved) {
          applyTheme(currentPref);
        }
      }
    }, 60000);
  });
})();
