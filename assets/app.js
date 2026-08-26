/* ============================================================
   Clínica Veterinaria WhiteMoon — comportamiento de la página
   JS puro, sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del pie ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Sombra de la cabecera al hacer scroll ----------
     Un IntersectionObserver sobre un centinela de 1px evita
     escuchar el scroll en cada frame. */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      hdr.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ---------- Reveal al entrar en pantalla ----------
     La clase se pone en <html> desde JS: si el script no llega,
     el CSS no oculta nada y la página se lee igual. */
  var items = [].slice.call(document.querySelectorAll('[data-rv]'));
  if (!items.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  document.documentElement.classList.add('js-rv');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      // Los hermanos de un mismo grupo entran escalonados; el retraso se
      // calcula al vuelo para no tener que numerarlos en el HTML.
      var group = el.parentElement ? [].slice.call(el.parentElement.children).filter(function (n) {
        return n.hasAttribute && n.hasAttribute('data-rv');
      }) : [];
      var i = Math.max(0, group.indexOf(el));
      el.style.setProperty('--d', Math.min(i, 5) * 70 + 'ms');
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();
