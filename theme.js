(function () {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.colorScheme = newTheme;

    try {
      localStorage.setItem('deepinbrasil-theme', newTheme);
    } catch (e) {
      // Ignora erros de armazenamento caso o navegador bloqueie
    }
  });
})();