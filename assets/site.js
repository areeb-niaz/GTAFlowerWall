/* ──────────────────────────────────────────────────────────
   Shared by every page: footer year and the mobile menu.
   Loaded with `defer`, so the header markup is already parsed.
────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }

  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('mobileNav');
  if (!btn || !nav) { return; }

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });
  // Tapping a link (including a same-page #anchor) closes the menu.
  nav.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) { setOpen(false); }
  });
})();
