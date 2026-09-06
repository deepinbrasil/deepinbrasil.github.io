(function () {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  function updateThemeIcon(theme) {
    const iconSvg = btn.querySelector('svg');
    if (!iconSvg) return;

    iconSvg.setAttribute('width', '22');
    iconSvg.setAttribute('height', '22');
    iconSvg.setAttribute('viewBox', '0 0 24 24');

    if (theme === 'dark') {
      // Sol geométrico preenchido (exibido no modo escuro para mudar pro claro)
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
    } else {
      // Lua preenchida (exibido no modo claro para mudar pro escuro)
      iconSvg.setAttribute('fill', 'currentColor');
      iconSvg.removeAttribute('stroke');
      iconSvg.removeAttribute('stroke-width');
      iconSvg.removeAttribute('stroke-linecap');
      iconSvg.removeAttribute('stroke-linejoin');
      iconSvg.innerHTML = `
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path>
      `;
    }
  }

  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeIcon(initialTheme);

  btn.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.colorScheme = newTheme;

    try {
      localStorage.setItem('deepinbrasil-theme', newTheme);
    } catch (e) {}

    updateThemeIcon(newTheme);
  });
})();