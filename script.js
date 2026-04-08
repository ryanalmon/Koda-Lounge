/* ============================================================
   KODA LOUNGE — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- Nav scroll effect ---- */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on init


  /* ---- Mobile menu ---- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  function openMobileMenu() {
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-label', 'Close menu');
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  document.querySelectorAll('.mobile-menu__link').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });


  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 78;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ---- Scroll reveal ---- */
  const revealTargets = document.querySelectorAll('.reveal, .about__container, .cocktails__header, .quote__container, .experience__content, .visit__content, .about__visual');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger children if they have the reveal class
          if (!entry.target.classList.contains('reveal')) {
            const children = entry.target.querySelectorAll('.reveal');
            children.forEach(function (child, index) {
              setTimeout(function () {
                child.classList.add('revealed');
              }, index * 120);
            });
          } else {
            entry.target.classList.add('revealed');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealTargets.forEach(function (el) {
      el.classList.add('revealed');
      el.querySelectorAll('.reveal').forEach(function (child) {
        child.classList.add('revealed');
      });
    });
  }


  /* ---- Pillar stagger on scroll ---- */
  const pillarsContainer = document.querySelector('.pillars__container');
  if (pillarsContainer && 'IntersectionObserver' in window) {
    const pillarsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.pillar').forEach(function (pillar, index) {
            pillar.style.transitionDelay = (index * 0.15) + 's';
            pillar.classList.add('revealed');
          });
          pillarsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    pillarsContainer.querySelectorAll('.pillar').forEach(function (p) {
      p.classList.add('reveal');
    });

    pillarsObserver.observe(pillarsContainer);
  }


  /* ---- Quote reveal ---- */
  const quoteContainer = document.querySelector('.quote__container');
  if (quoteContainer) {
    quoteContainer.classList.add('reveal');
    if ('IntersectionObserver' in window) {
      const quoteObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            quoteObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      quoteObserver.observe(quoteContainer);
    } else {
      quoteContainer.classList.add('revealed');
    }
  }


  /* ---- Cocktail Finder ---- */
  (function () {
    var answers = {};

    var menu = {
      'old-fashioned':  { num: 'I',   name: 'Old Fashioned',   spirits: ['whiskey'], tastes: ['bitter', 'spirit'], desc: 'Bourbon or rye, demerara sugar, Angostura bitters, expressed orange peel — the gold standard of American cocktail craft.' },
      'gin-martini':    { num: 'II',  name: 'Gin Martini',     spirits: ['gin'],     tastes: ['bitter', 'spirit'], desc: 'London dry gin, dry vermouth, stirred to silken perfection over diamond ice, garnished with a brined olive or lemon twist.' },
      'espresso-martini':{ num: 'III', name: 'Espresso Martini', spirits: ['vodka'],  tastes: ['sweet'],            desc: 'Vodka, freshly pulled single-origin espresso, Kahlúa, a touch of simple syrup — the night\'s most elegant second wind.' },
      'cosmopolitan':   { num: 'IV',  name: 'Cosmopolitan',    spirits: ['vodka'],   tastes: ['sour', 'sweet'],    desc: 'Citrus vodka, Cointreau, cranberry, fresh lime — luminous, elegant, and perfectly balanced between tart and sweet.' },
      'margarita':      { num: 'V',   name: 'Margarita',       spirits: ['tequila'], tastes: ['sour'],             desc: 'Tequila blanco, Cointreau, freshly squeezed lime, hand-salted rim — the perfect balance of spirit, citrus, and salt.' }
    };

    var spiritLines = { whiskey: 'You appreciate depth, tradition, and the passage of time.', gin: 'Your palate leans towards botanical complexity and finesse.', vodka: 'You value versatility, clarity, and quiet refinement.', tequila: 'You embrace boldness, vibrancy, and a sense of adventure.' };
    var tasteLines  = { sweet: 'A smooth, rounded finish suits your mood perfectly.', sour: 'The bright acidity will enliven the evening.', bitter: 'The complexity matches your discerning taste.', spirit: 'Nothing should mask the quality of what\'s in the glass.' };

    function recommend(spirit, taste) {
      var scores = {};
      Object.keys(menu).forEach(function (k) {
        var c = menu[k];
        scores[k] = (c.spirits.indexOf(spirit) !== -1 ? 3 : 0) + (c.tastes.indexOf(taste) !== -1 ? 2 : 0);
      });
      return menu[Object.keys(scores).reduce(function (a, b) { return scores[a] >= scores[b] ? a : b; })];
    }

    function goToStep(n) {
      document.querySelectorAll('.finder__step').forEach(function (s) { s.classList.remove('active'); });
      var next = document.querySelector('.finder__step[data-step="' + n + '"]');
      if (!next) return;
      next.classList.remove('active');
      void next.offsetWidth; // force reflow for animation replay
      next.classList.add('active');
    }

    function showResult() {
      var rec = recommend(answers.spirit, answers.taste);
      document.getElementById('resultNum').textContent  = rec.num;
      document.getElementById('resultName').textContent = rec.name;
      document.getElementById('resultDesc').textContent = rec.desc;
      document.getElementById('resultWhy').textContent  = (spiritLines[answers.spirit] || '') + ' ' + (tasteLines[answers.taste] || '');
      goToStep(4);
    }

    document.querySelectorAll('.finder__opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var step = parseInt(opt.closest('.finder__step').getAttribute('data-step'));
        if (step === 1) answers.spirit  = opt.getAttribute('data-value');
        if (step === 2) answers.taste   = opt.getAttribute('data-value');
        if (step === 3) { answers.occasion = opt.getAttribute('data-value'); showResult(); return; }
        goToStep(step + 1);
      });
    });

    var restartBtn = document.getElementById('finderRestart');
    if (restartBtn) {
      restartBtn.addEventListener('click', function () { answers = {}; goToStep(1); });
    }
  }());


  /* ---- Emblem animation pause on reduced motion ---- */
  const emblemSvg = document.querySelector('.visit__emblem-svg');
  if (emblemSvg && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emblemSvg.style.animation = 'none';
  }

})();
