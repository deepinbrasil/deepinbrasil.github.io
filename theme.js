(function () {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  // Função para atualizar o desenho do ícone dentro do botão
  function updateThemeIcon(theme) {
    const iconSvg = btn.querySelector('svg');
    if (!iconSvg) return;

    if (theme === 'dark') {
      // Exibe o SOL quando está no escuro (para sugerir mudança para o claro)
      iconSvg.innerHTML = `
        <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M8 1.5V3M8 13v1.5M3.5 8H2M14 8h-1.5M4.3 4.3L5.4 5.4M10.6 10.6l1.1 1.1M4.3 11.7l1.1-1.1M10.6 5.4l1.1-1.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      `;
    } else {
      // Exibe a LUA quando está no claro (para sugerir mudança para o escuro)
      iconSvg.innerHTML = `
        <path d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5a5.8 5.8 0 1 0 7.3 7.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      `;
    }
  }

  // Define o ícone correto logo ao carregar a página com base no tema atual
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeIcon(initialTheme);

  // Evento de clique para alternar o tema e atualizar o ícone
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

    updateThemeIcon(newTheme);
  });
})();