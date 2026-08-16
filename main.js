// Ano dinâmico no rodapé
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Permite tocar (mobile) para abrir/fechar o submenu "Apps" no dock
document.querySelectorAll('.dock-item.has-sub').forEach(function (item) {
  item.addEventListener('click', function (e) {
    if (e.target.closest('.dock-sub')) return; // deixa o link filho navegar normalmente
    item.classList.toggle('open-sub');
    var sub = item.querySelector('.dock-sub');
    if (sub) sub.style.display = item.classList.contains('open-sub') ? 'flex' : '';
  });
});
