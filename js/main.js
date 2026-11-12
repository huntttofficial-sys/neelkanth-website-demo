/* Neelkanth Rice & Oil Depo — page behaviour. No dependencies. */
(function () {
  'use strict';

  var CFG = window.NEELKANTH || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  /* ---------- Intro (once per browser session) ---------- */
  var intro = $('#intro');
  var introSeen = root.classList.contains('intro-seen');
  var introDelay = introSeen || reduceMotion ? 0 : 1750;
  try { sessionStorage.setItem('nk-intro', '1'); } catch (e) {}
  if (intro) {
    if (introSeen || reduceMotion) intro.remove();
    else setTimeout(function () { intro.remove(); }, introDelay + 900);
  }

  /* ---------- Header ---------- */
  var header = $('.site-header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  var toggle = $('.nav-toggle');
  var nav = $('#primary-nav');
  var navTimer;
  var setNav = function (open, instant) {
    clearTimeout(navTimer);
    nav.classList.toggle('is-animating', !instant);
    navTimer = setTimeout(function () { nav.classList.remove('is-animating'); }, 350);
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });
  // Close when tapping outside the header, and when the layout switches to desktop.
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) setNav(false);
  });
  window.matchMedia('(min-width: 921px)').addEventListener('change', function () { setNav(false, true); });

  /* ---------- Store details from config ---------- */
  var store = CFG.store || {};
  $$('[data-config]').forEach(function (el) {
    var value = store[el.getAttribute('data-config')];
    if (value) el.textContent = value;
  });
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- WhatsApp ---------- */
  var number = String(CFG.whatsappNumber || '').replace(/\D/g, '');
  var dialog = $('#wa-dialog');
  var messageFor = function (el) {
    var m = CFG.messages;
    var productId = el.getAttribute('data-wa-product');
    if (productId) {
      var p = (CFG.products || []).filter(function (x) { return x.id === productId; })[0];
      if (p) return m.product(p);
    }
    return m.general();
  };
  var wireWhatsApp = function (scope) {
    $$('[data-wa]', scope).forEach(function (el) {
      if (number) {
        el.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(messageFor(el));
        el.target = '_blank';
        el.rel = 'noopener';
      }
    });
  };
  wireWhatsApp(document);
  // Demo mode: no number configured, so show what the button will do.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-wa]');
    if (!el || number || !dialog || !dialog.showModal) return;
    e.preventDefault();
    $('#wa-message').textContent = messageFor(el);
    $('#wa-copy').textContent = 'Copy message';
    dialog.showModal();
  });
  if (dialog) {
    $('#wa-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    $('#wa-copy').addEventListener('click', function () {
      var btn = this;
      var done = function () { btn.textContent = 'Copied'; };
      if (navigator.clipboard) navigator.clipboard.writeText($('#wa-message').textContent).then(done, function () {});
    });
  }

  /* ---------- Sample products ---------- */
  var grid = $('#product-grid');
  var filters = $('#filters');
  var cats = CFG.categories || {};
  var current = 'all';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); };

  var renderProducts = function () {
    var list = (CFG.products || []).filter(function (p) { return current === 'all' || p.category === current; });
    grid.innerHTML = list.map(function (p, i) {
      var meta = [p.unit, p.price].filter(Boolean).join(' · ');
      return '<li><article class="product-card" style="animation-delay:' + i * 45 + 'ms">' +
        '<div class="product-media"><img src="assets/img/' + esc(p.image) + '" alt="" width="600" height="600" loading="lazy"><span class="tag">Sample item</span></div>' +
        '<div class="product-body"><span class="product-cat">' + esc(cats[p.category] || '') + '</span>' +
        '<h3>' + esc(p.name) + '</h3>' + (meta ? '<span class="product-meta">' + esc(meta) + '</span>' : '') +
        '<a class="btn btn-sm" href="#contact" data-wa data-wa-product="' + esc(p.id) + '" aria-label="Order ' + esc(p.name) + ' on WhatsApp"><svg class="icon" aria-hidden="true"><use href="#i-chat"/></svg><span><span class="hide-xs">Order on </span>WhatsApp</span></a>' +
        '</div></article></li>';
    }).join('');
    wireWhatsApp(grid);
  };

  var setFilter = function (key) {
    current = key;
    $$('.chip', filters).forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-key') === key)); });
    renderProducts();
  };

  if (grid && filters) {
    filters.innerHTML = [['all', 'All']].concat(Object.keys(cats).map(function (k) { return [k, cats[k]]; })).map(function (c) {
      return '<button class="chip" type="button" data-key="' + c[0] + '" aria-pressed="' + (c[0] === 'all') + '">' + esc(c[1]) + '</button>';
    }).join('');
    filters.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) setFilter(chip.getAttribute('data-key'));
    });
    $$('[data-filter]').forEach(function (a) {
      a.addEventListener('click', function () { setFilter(a.getAttribute('data-filter')); });
    });
    renderProducts();
  }

  /* ---------- Scroll reveal ---------- */
  var items = $$('[data-reveal]');
  var showAll = function () { items.forEach(function (el) { el.classList.add('is-in'); }); };
  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty('--d', n++ * 90 + 'ms');
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
    // Start once the intro has cleared, so the hero animates into view.
    setTimeout(function () { items.forEach(function (el) { io.observe(el); }); }, introDelay);
  }

  /* ---------- Current section in the nav ---------- */
  if ('IntersectionObserver' in window) {
    var links = $$('.primary-nav a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          if (l.getAttribute('href') === '#' + entry.target.id) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-45% 0px -50% 0px'});
    ['home', 'categories', 'about', 'contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();
