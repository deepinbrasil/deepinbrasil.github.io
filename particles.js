/* =========================================================
   deepin Brasil — fundo de constelação
   Partículas conectadas por linhas, reagindo ao cursor.
   Simboliza a rede da comunidade. Canvas puro, sem libs.
   ========================================================= */
(function () {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  if (window.innerWidth < 640) return; // poupa bateria em telas pequenas/touch (fundo oculto por CSS)

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ctx = canvas.getContext('2d');
  var w, h, dpr;
  var particles = [];
  var mouse = { x: null, y: null, active: false };
  var rafId = null;

  var COLOR_DOT, COLOR_DOT_2, LINK_COLOR, CURSOR_COLOR, DOT_ALPHA, STATIC_ALPHA, LINK_ALPHA_MAX, CURSOR_ALPHA_MAX;

  function applyThemeColors() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      // tons mais escuros e saturados, para contraste contra fundo claro
      COLOR_DOT = '47, 116, 214';    // --accent-blue (claro)
      COLOR_DOT_2 = '15, 174, 149';  // --accent-teal (claro)
      LINK_COLOR = '47, 116, 214';
      CURSOR_COLOR = '15, 174, 149';
      DOT_ALPHA = 0.6;
      STATIC_ALPHA = 0.45;
      LINK_ALPHA_MAX = 0.14;
      CURSOR_ALPHA_MAX = 0.3;
    } else {
      COLOR_DOT = '63, 142, 240';    // --accent-blue (escuro)
      COLOR_DOT_2 = '51, 224, 196';  // --accent-teal (escuro)
      LINK_COLOR = '63, 142, 240';
      CURSOR_COLOR = '51, 224, 196';
      DOT_ALPHA = 0.55;
      STATIC_ALPHA = 0.4;
      LINK_ALPHA_MAX = 0.16;
      CURSOR_ALPHA_MAX = 0.35;
    }
  }
  applyThemeColors();
  document.addEventListener('themechange', function () {
    applyThemeColors();
    // recolore as partículas já existentes sem recriar posições
    for (var i = 0; i < particles.length; i++) {
      particles[i].c = Math.random() < 0.65 ? COLOR_DOT : COLOR_DOT_2;
    }
    if (reduceMotion) drawStaticFrame();
  });

  var LINK_DIST = 130;
  var MOUSE_DIST = 160;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    var area = w * h;
    var count = Math.round(area / 16000);
    count = Math.max(28, Math.min(count, 110));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
        c: Math.random() < 0.65 ? COLOR_DOT : COLOR_DOT_2
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // move + desenha partículas
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // leve atração/repulsão perto do cursor
      if (mouse.active) {
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST) {
          var d = Math.sqrt(d2) || 1;
          var force = (1 - d / MOUSE_DIST) * 0.04;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.c + ', ' + DOT_ALPHA + ')';
      ctx.fill();
    }

    // conexões entre partículas próximas
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        var dx2 = a.x - b.x, dy2 = a.y - b.y;
        var dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist < LINK_DIST) {
          var alpha = (1 - dist / LINK_DIST) * LINK_ALPHA_MAX;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(' + LINK_COLOR + ', ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // conexões do cursor com partículas próximas ("você entrando na rede")
    if (mouse.active) {
      for (var k = 0; k < particles.length; k++) {
        var p2 = particles[k];
        var dxm = p2.x - mouse.x, dym = p2.y - mouse.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < MOUSE_DIST) {
          var alphaM = (1 - dm / MOUSE_DIST) * CURSOR_ALPHA_MAX;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + CURSOR_COLOR + ', ' + alphaM + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + CURSOR_COLOR + ', 0.9)';
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  function drawStaticFrame() {
    // Para quem prefere menos movimento: um único desenho parado, sem loop.
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.c + ', ' + STATIC_ALPHA + ')';
      ctx.fill();
    }
  }

  function onMove(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }
  function onLeave() { mouse.active = false; }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) onMove(e.touches[0]);
  }, { passive: true });
  window.addEventListener('touchend', onLeave);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!reduceMotion && !rafId) {
      rafId = requestAnimationFrame(step);
    }
  });

  resize();

  if (reduceMotion) {
    drawStaticFrame();
  } else {
    rafId = requestAnimationFrame(step);
  }
})();
