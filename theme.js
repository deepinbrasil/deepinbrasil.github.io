// A definição inicial do tema já rodou inline no <head> (para não ter flash).
// Este arquivo só cuida de reavaliar o horário periodicamente, para quem
// deixa a aba aberta atravessar o amanhecer/anoitecer sem recarregar a página.
(function () {
  function computeTheme() {
    var hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }
  setInterval(function () {
    var next = computeTheme();
    if (document.documentElement.getAttribute('data-theme') !== next) {
      document.documentElement.setAttribute('data-theme', next);
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    }
  }, 60000);
})();
