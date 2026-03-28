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


  /* ---- Emblem animation pause on reduced motion ---- */
  const emblemSvg = document.querySelector('.visit__emblem-svg');
  if (emblemSvg && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emblemSvg.style.animation = 'none';
  }

})();
