(function () {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  function updateThemeIcon(mode) {
    const iconSvg = btn.querySelector('svg');
    if (!iconSvg) return;

    iconSvg.setAttribute('width', '22');
    iconSvg.setAttribute('height', '22');
    iconSvg.setAttribute('viewBox', '0 0 24 24');

    if (mode === 'system') {
      // Ícone de Monitor (Modo Automático do Dispositivo)
      iconSvg.setAttribute('fill', 'none');
      iconSvg.setAttribute('stroke', 'currentColor');
      iconSvg.setAttribute('stroke-width', '2');
      iconSvg.setAttribute('stroke-linecap', 'round');
      iconSvg.setAttribute('stroke-linejoin', 'round');
      iconSvg.innerHTML = `
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      `;
      btn.setAttribute('title', 'Tema do Dispositivo');
    } else if (mode === 'light') {
      // Ícone de Sol (Modo Claro)
      iconSvg.setAttribute('fill', 'currentColor');
      iconSvg.removeAttribute('stroke');
      iconSvg.removeAttribute('stroke-width');
      iconSvg.removeAttribute('stroke-linecap');
      iconSvg.removeAttribute('stroke-linejoin');
      iconSvg.innerHTML = `
        <circle cx="12" cy="12" r="4.5"></circle>
        <rect x="11" y="1" width="2" height="3" rx="1"></rect>
        <rect x="11" y="20" width="2" height="3" rx="1"></rect>
        <rect x="1" y="11" width="3" height="2" rx="1"></rect>
        <rect x="20" y="11" width="3" height="2" rx="1"></rect>
        <rect x="4.22" y="4.22" width="2.12" height="3" rx="1" transform="rotate(-45 5.28 5.72)"></rect>
        <rect x="17.66" y="17.66" width="2.12" height="3" rx="1" transform="rotate(-45 18.72 19.16)"></rect>
        <rect x="4.22" y="17.66" width="3" height="2.12" rx="1" transform="rotate(-45 5.72 18.72)"></rect>
        <rect x="17.66" y="4.22" width="3" height="2.12" rx="1" transform="rotate(-45 19.16 5.72)"></rect>
      `;
      btn.setAttribute('title', 'Tema Claro');
    } else {
      // Ícone de Lua (Modo Escuro)
      iconSvg.setAttribute('fill', 'currentColor');
      iconSvg.removeAttribute('stroke');
      iconSvg.removeAttribute('stroke-width');
      iconSvg.removeAttribute('stroke-linecap');
      iconSvg.removeAttribute('stroke-linejoin');
      iconSvg.innerHTML = `
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path>
      `;
      btn.setAttribute('title', 'Tema Escuro');
    }
  }

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getResolvedTheme(mode) {
    if (mode === 'system') {
      return darkModeQuery.matches ? 'dark' : 'light';
    }
    return mode;
  }

  function applyThemeMode(mode) {
    const resolved = getResolvedTheme(mode);
    
    if (resolved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    document.documentElement.style.colorScheme = resolved;
    updateThemeIcon(mode);
  }

  // 1. Recupera o modo salvo ou assume 'system' por padrão
  let currentMode = 'system';
  try {
    const saved = localStorage.getItem('deepinbrasil-theme-mode');
    if (saved === 'system' || saved === 'light' || saved === 'dark') {
      currentMode = saved;
    }
  } catch (e) {}

  applyThemeMode(currentMode);

  // 2. Se estiver no modo system, atualiza sozinho se o dispositivo mudar de tema
  darkModeQuery.addEventListener('change', () => {
    if (currentMode === 'system') {
      applyThemeMode('system');
    }
  });

  // 3. Ao clicar, cicla entre os 3 estados: system -> light -> dark -> system
  btn.addEventListener('click', function () {
    if (currentMode === 'system') {
      currentMode = 'light';
    } else if (currentMode === 'light') {
      currentMode = 'dark';
    } else {
      currentMode = 'system';
    }

    applyThemeMode(currentMode);

    try {
      localStorage.setItem('deepinbrasil-theme-mode', currentMode);
    } catch (e) {}
  });
})();