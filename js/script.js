(() => {
  'use strict';

  // ── DOM refs (queried once) ──────────────────────────────────────────────
  const root            = document.documentElement;
  const themeToggle     = document.getElementById('themeToggle');
  const fontToggle      = document.getElementById('fontToggle');
  const menuToggle      = document.getElementById('menuToggle');
  const closeMenuBtn    = document.getElementById('closeMenu');
  const menu            = document.getElementById('menu');
  const backdrop        = document.getElementById('backdrop');
  const filterWrap      = document.getElementById('project-filter-wrap'); // cached here, not inside listener

  // ── Theme ────────────────────────────────────────────────────────────────
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  applyTheme(localStorage.getItem('theme') || getSystemTheme());

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── Font size ────────────────────────────────────────────────────────────
  function applyFont(px) {
    root.style.fontSize = px;
    localStorage.setItem('fontSize', px);
    if (fontToggle) fontToggle.textContent = px === '18px' ? 'A-' : 'A+';
  }

  applyFont(localStorage.getItem('fontSize') || '16px');

  fontToggle?.addEventListener('click', () => {
    applyFont(localStorage.getItem('fontSize') === '18px' ? '16px' : '18px');
  });

  // ── Mobile menu ──────────────────────────────────────────────────────────
  const isMobile = () => window.matchMedia('(max-width: 760px)').matches;

  function openMenu() {
    if (!isMobile()) return;
    menu.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    menu?.classList.add('hidden');
    backdrop?.classList.add('hidden');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  closeMenu(); // ensure closed on load

  menuToggle?.addEventListener('click', () => {
    menu.classList.contains('hidden') ? openMenu() : closeMenu();
  });
  closeMenuBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  menu?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (!isMobile()) closeMenu(); });

  // ── Scroll-reveal ────────────────────────────────────────────────────────
  const SELECTORS = [
    '#home', '#home .profile-pic', '#home .hero-title', '#home .hero-sub',
    '#home .cta-btn', '#about', '#projects', '.project', '#skills',
    '#contact', 'footer', '.github-title', '#timer',
    '#visitor-section'
  ];

  const targets = [];
  SELECTORS.forEach(sel =>
    document.querySelectorAll(sel).forEach(el => {
      if (!targets.includes(el)) targets.push(el);
    })
  );

  targets.forEach(el => el.classList.add('reveal'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('show'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('show');
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    targets.forEach(el => io.observe(el));
  }

  // ── Project filter & sort ────────────────────────────────────────────────
  const projects       = Array.from(document.querySelectorAll('.project'));
  const filterBtn      = document.getElementById('project-filter-btn');
  const filterMenu     = document.getElementById('project-filter-menu');
  const filterOptions  = Array.from(document.querySelectorAll('.custom-option'));
  const sortYearBtn    = document.getElementById('sort-year');
  const sortNameBtn    = document.getElementById('sort-name');
  const noProjectsMsg  = document.getElementById('no-projects-msg');
  const projectGrid    = document.getElementById('project-grid');

  let currentSort     = null;
  let selectedCategory = 'all';

  function filterProjects() {
    let visible = projects.filter(p =>
      selectedCategory === 'all' || p.dataset.category === selectedCategory
    );

    if (currentSort === 'year') {
      visible.sort((a, b) => Number(b.dataset.year) - Number(a.dataset.year));
    } else if (currentSort === 'name') {
      visible.sort((a, b) => (a.dataset.title || '').localeCompare(b.dataset.title || ''));
    }

    projects.forEach(p => p.style.display = 'none');
    visible.forEach(p => { p.style.display = ''; projectGrid?.appendChild(p); });
    if (noProjectsMsg) noProjectsMsg.hidden = visible.length > 0;
  }

  filterBtn?.addEventListener('click', () => {
    const open = !filterMenu.classList.contains('hidden');
    filterMenu.classList.toggle('hidden');
    filterBtn.setAttribute('aria-expanded', String(!open));
  });

  filterOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      selectedCategory = opt.dataset.value || 'all';
      filterBtn.textContent = opt.textContent.trim();
      filterOptions.forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-selected', 'false'); });
      opt.classList.add('selected');
      opt.setAttribute('aria-selected', 'true');
      filterMenu.classList.add('hidden');
      filterBtn.setAttribute('aria-expanded', 'false');
      filterProjects();
    });
  });

  // Close filter dropdown on outside click
  document.addEventListener('click', e => {
    if (filterWrap && !filterWrap.contains(e.target)) {
      filterMenu?.classList.add('hidden');
      filterBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  function toggleSort(type, activeBtn, otherBtn) {
    currentSort = currentSort === type ? null : type;
    activeBtn.classList.toggle('active', currentSort === type);
    otherBtn.classList.remove('active');
    filterProjects();
  }

  sortYearBtn?.addEventListener('click', () => toggleSort('year', sortYearBtn, sortNameBtn));
  sortNameBtn?.addEventListener('click', () => toggleSort('name', sortNameBtn, sortYearBtn));

  filterProjects(); // initial render

  // ── Contact form ─────────────────────────────────────────────────────────
  const contactForm  = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const EMAIL_RE     = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className   = `form-message show ${type}`;
  }

  contactForm?.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !subject || !message) {
      return showFeedback('Please fill in all fields before sending.', 'error');
    }
    if (!EMAIL_RE.test(email)) {
      return showFeedback('Please enter a valid email address.', 'error');
    }

    showFeedback('Sending…', 'success');

    try {
      await emailjs.send('service_tm9i09c', 'template_jho9g2r', {
        from_name: name, from_email: email, subject, message
      });
      showFeedback('Message sent successfully!', 'success');
      contactForm.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showFeedback('Failed to send. Please try again.', 'error');
    }
  });

  // ── Visit timer (sessionStorage) ─────────────────────────────────────────
  const timerEl = document.getElementById('visit-timer');
  let seconds   = Number(sessionStorage.getItem('time')) || 0;

  function fmt(s) {
    if (s < 60) return `${s} second${s !== 1 ? 's' : ''}`;
    const m = Math.floor(s / 60), r = s % 60;
    return `${m} minute${m !== 1 ? 's' : ''} and ${r} second${r !== 1 ? 's' : ''}`;
  }

  if (timerEl) {
    timerEl.textContent = fmt(seconds);
    setInterval(() => {
      sessionStorage.setItem('time', ++seconds);
      timerEl.textContent = fmt(seconds);
    }, 1000);
  }

  // ── Visitor name (localStorage) ──────────────────────────────────────────
  const nameInput   = document.getElementById('visitor-name');
  const saveBtn     = document.getElementById('save-name');
  const clearBtn    = document.getElementById('clear-name');
  const nameDisplay = document.getElementById('name-display');

  let storedName = localStorage.getItem('visitorName') || '';

  function renderName() {
    if (nameDisplay) {
      nameDisplay.textContent = storedName.trim()
        ? `Welcome, ${storedName}!`
        : 'Welcome, guest!';
    }
  }

  renderName();

  saveBtn?.addEventListener('click', () => {
    const val = nameInput?.value.trim();
    if (val) {
      storedName = val;
      localStorage.setItem('visitorName', val);
      renderName();
      if (nameInput) nameInput.value = '';
    }
  });

  clearBtn?.addEventListener('click', () => {
    storedName = '';
    localStorage.removeItem('visitorName');
    renderName();
    if (nameInput) nameInput.value = '';
  });

  // ── GitHub repos ─────────────────────────────────────────────────────────
  const reposContainer = document.getElementById('github-repos');
  const GH_USER        = 'RaneemAlshahrani';

  const LANG_COLORS = {
    JavaScript: '#f1e05a',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Python:     '#3572A5',
    Java:       '#b07219'
  };

  function relativeDate(iso) {
    const days = Math.ceil((Date.now() - new Date(iso)) / 86_400_000);
    if (days === 0)  return 'today';
    if (days === 1)  return 'yesterday';
    if (days < 7)   return `${days} days ago`;
    if (days < 30)  { const w = Math.floor(days / 7);  return `${w} week${w > 1 ? 's' : ''} ago`; }
    if (days < 365) { const mo = Math.floor(days / 30); return `${mo} month${mo > 1 ? 's' : ''} ago`; }
    const yr = Math.floor(days / 365);
    return `${yr} year${yr > 1 ? 's' : ''} ago`;
  }

  function repoCard(repo) {
    const color = LANG_COLORS[repo.language] || '#8b5cf6';
    const langHtml = repo.language
      ? `<span class="language-dot" style="background:${color}"></span>${repo.language}`
      : '';
    // Sanitise text to prevent XSS
    const safe = str => str
      ? str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      : '';

    return `<article class="repo-card">
      <div class="repo-header">
        <h3><a href="${safe(repo.html_url)}" target="_blank" rel="noopener noreferrer">${safe(repo.name)}</a></h3>
        <span class="repo-badge public">Public</span>
      </div>
      <p class="repo-description">${safe(repo.description) || 'No description available.'}</p>
      <div class="repo-meta">
        <span class="repo-language">${langHtml}</span>
        <span class="repo-updated">Updated ${relativeDate(repo.updated_at)}</span>
      </div>
    </article>`;
  }

  async function fetchRepos() {
    if (!reposContainer) return;

    try {
      const res = await fetch(
        `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=30`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const repos = data
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      reposContainer.innerHTML = repos.length
        ? repos.map(repoCard).join('')
        : '<p class="empty-message">No repositories found.</p>';

      // Ensure dynamically-injected cards are never hidden by the reveal system
      reposContainer.classList.add('show');
      reposContainer.querySelectorAll('.repo-card').forEach(c => c.classList.add('show'));
    } catch (err) {
      console.error('GitHub fetch error:', err);
      reposContainer.innerHTML = '<p class="error-message">Unable to load repositories. Please try again later.</p>';
    }
  }

  // Fetch repos when page fully loaded (avoids blocking initial render)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchRepos);
  } else {
    fetchRepos();
  }

})();