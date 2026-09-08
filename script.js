/* =========================================================
   FUSE — Freelance Unified Skills & Experts
   Site behaviour
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     Portfolio data — replace image paths any time.
     --------------------------------------------------- */
  const PORTFOLIO_ITEMS = [
    { id: 'p01', img: 'assets/portfolio/design-01.svg', title: 'Social Post Series', category: 'Graphic Design', desc: 'A set of branded social media graphics designed for consistent visual identity across platforms.' },
    { id: 'p02', img: 'assets/portfolio/design-02.svg', title: 'Promotional Flyer', category: 'Graphic Design', desc: 'A promotional flyer created for a seasonal campaign, built for print and digital use.' },
    { id: 'p03', img: 'assets/portfolio/design-03.svg', title: 'Brand Collateral Set', category: 'Graphic Design', desc: 'Supporting marketing collateral designed to match an existing brand identity.' },
    { id: 'p04', img: 'assets/portfolio/social-01.svg', title: 'Content Calendar Layout', category: 'Social Media', desc: 'A planned content calendar covering captions, timing, and visual themes for a full month.' },
    { id: 'p05', img: 'assets/portfolio/social-02.svg', title: 'Engagement Campaign', category: 'Social Media', desc: 'A coordinated posting and engagement plan built to grow an active online community.' },
    { id: 'p06', img: 'assets/portfolio/social-03.svg', title: 'Caption & Copy Set', category: 'Social Media', desc: 'A collection of on-brand captions supporting a client\u2019s weekly content rollout.' },
    { id: 'p07', img: 'assets/portfolio/video-01.svg', title: 'Short-Form Reel', category: 'Video Editing', video: true, desc: 'A short-form vertical video edited for social media, including captions and transitions.' },
    { id: 'p08', img: 'assets/portfolio/video-02.svg', title: 'Promotional Video', category: 'Video Editing', video: true, desc: 'A promotional video edited with pacing and captions suited for a product launch.' },
    { id: 'p09', img: 'assets/portfolio/video-03.svg', title: 'Property Walkthrough', category: 'Video Editing', video: true, desc: 'A property video edited for listing promotion, formatted for social sharing.' },
    { id: 'p10', img: 'assets/portfolio/deck-01.svg', title: 'Client Presentation Deck', category: 'Presentations', desc: 'A structured presentation deck designed for a client-facing business update.' },
    { id: 'p11', img: 'assets/portfolio/deck-02.svg', title: 'Sales Pitch Deck', category: 'Presentations', desc: 'A visual pitch deck built to support a sales conversation with clear hierarchy.' },
    { id: 'p12', img: 'assets/portfolio/realestate-01.svg', title: 'Listing Marketing Set', category: 'Real Estate', desc: 'A marketing graphic set created for a property listing, including social formats.' },
    { id: 'p13', img: 'assets/portfolio/realestate-02.svg', title: 'Open House Promo', category: 'Real Estate', desc: 'Promotional graphics created to announce and support an open house event.' },
    { id: 'p14', img: 'assets/portfolio/realestate-03.svg', title: 'Property Highlight Reel', category: 'Real Estate', video: true, desc: 'A short property highlight video edited for use across social platforms.' },
  ];

  const VIDEO_ITEMS = PORTFOLIO_ITEMS.filter(i => i.video);
  const DESIGN_ITEMS = PORTFOLIO_ITEMS.filter(i => i.category === 'Graphic Design').slice(0, 6).length
    ? PORTFOLIO_ITEMS.filter(i => i.category === 'Graphic Design' || i.category === 'Real Estate').slice(0, 6)
    : PORTFOLIO_ITEMS.slice(0, 6);

  /* ---------------------------------------------------
     Render portfolio grid
     --------------------------------------------------- */
  const portfolioGrid = document.getElementById('portfolioGrid');
  if (portfolioGrid) {
    portfolioGrid.innerHTML = PORTFOLIO_ITEMS.map((item, i) => `
      <figure class="portfolio-item" data-category="${item.category}" data-id="${item.id}" style="animation-delay:${(i % 6) * 0.06}s">
        <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='assets/portfolio/design-01.svg'">
        ${item.video ? '<span class="play-badge" aria-hidden="true"></span>' : ''}
        <figcaption class="portfolio-caption">
          <span>${item.category}</span>
          <strong>${item.title}</strong>
        </figcaption>
      </figure>
    `).join('');
  }

  /* ---------------------------------------------------
     Render design mini-gallery (section 06)
     --------------------------------------------------- */
  const designGallery = document.getElementById('designGallery');
  if (designGallery) {
    designGallery.innerHTML = DESIGN_ITEMS.map(item => `
      <a href="#" data-id="${item.id}" class="mini-gallery-link">
        <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='assets/portfolio/design-01.svg'">
      </a>
    `).join('');
    designGallery.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-id]');
      if (!link) return;
      e.preventDefault();
      openModalById(link.dataset.id);
    });
  }

  /* ---------------------------------------------------
     Render video grid (section 07)
     --------------------------------------------------- */
  const videoGrid = document.getElementById('videoGrid');
  if (videoGrid) {
    const items = VIDEO_ITEMS.length ? VIDEO_ITEMS : PORTFOLIO_ITEMS.slice(0, 3);
    videoGrid.innerHTML = items.map(item => `
      <div class="video-card" data-id="${item.id}">
        <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='assets/videos/video-01.svg'">
        <span class="play-badge" aria-hidden="true"></span>
      </div>
    `).join('');
    videoGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.video-card');
      if (!card) return;
      openModalById(card.dataset.id);
    });
  }

  /* ---------------------------------------------------
     Portfolio filtering
     --------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.portfolio-item').forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------------------------------------------------
     Portfolio modal / lightbox
     --------------------------------------------------- */
  const modal = document.getElementById('portfolioModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  let lastFocusedEl = null;

  function openModalById(id) {
    const item = PORTFOLIO_ITEMS.find(p => p.id === id);
    if (!item || !modal) return;
    modalImage.src = item.img;
    modalImage.alt = item.title;
    modalTitle.textContent = item.title;
    modalCategory.textContent = item.category;
    modalDescription.textContent = item.desc;
    lastFocusedEl = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  if (portfolioGrid) {
    portfolioGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.portfolio-item');
      if (!item) return;
      openModalById(item.dataset.id);
    });
  }

  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  /* ---------------------------------------------------
     Sticky navigation state
     --------------------------------------------------- */
  const nav = document.getElementById('siteNav');
  const scrollProgress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';

    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------
     Active nav link on scroll
     --------------------------------------------------- */
  const sections = Array.from(document.querySelectorAll('main .section, .hero'));
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (sec.id && scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', match);
    });
  }

  /* ---------------------------------------------------
     Mobile menu
     --------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
  }

  /* ---------------------------------------------------
     Smooth anchor scrolling with fixed-nav offset
     --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------------------------------------------
     Hero text reveal
     --------------------------------------------------- */
  const heroTitle = document.querySelector('.hero-title');
  requestAnimationFrame(() => {
    if (heroTitle) heroTitle.classList.add('is-ready');
    document.querySelectorAll('.hero .reveal-el').forEach((el, i) => {
      el.style.transitionDelay = (0.5 + i * 0.08) + 's';
      el.classList.add('is-visible');
    });
  });

  /* ---------------------------------------------------
     Scroll-triggered reveal animations
     --------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));

    // Stagger cards within grids
    const staggerGroups = document.querySelectorAll('.services-grid, .team-grid, .why-grid, .tools-grid');
    staggerGroups.forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty('--d', (i % 3) * 0.08 + 's');
      });
    });
  }

  /* ---------------------------------------------------
     Subtle premium cursor (desktop only, non-essential)
     --------------------------------------------------- */
  if (!prefersReducedMotion && window.matchMedia('(min-width: 900px)').matches && window.matchMedia('(pointer: fine)').matches) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
    let active = false;
    window.addEventListener('mousemove', (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      if (!active) { dot.classList.add('is-active'); active = true; }
    });
    document.querySelectorAll('a, button, .portfolio-item, .team-card').forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => dot.classList.remove('is-hover'));
    });
  }
});
