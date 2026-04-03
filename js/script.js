(() => {
  
  const root = document.documentElement; // <html> element for theme attribute

  const themeToggle = document.getElementById("themeToggle"); // Theme toggle button
  const fontToggle = document.getElementById("fontToggle");   // Font size toggle button

  const menuToggle = document.getElementById("menuToggle");   // Hamburger menu button
  const closeMenu = document.getElementById("closeMenu");     // Close button inside mobile menu
  const menu = document.getElementById("menu");               // Mobile menu panel
  const backdrop = document.getElementById("backdrop");       // Dark overlay behind menu

  // Get the system's preferred color scheme (light or dark)
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Apply the given theme (light or dark)
  function applyTheme(theme) {
    // Set data-theme attribute on <html> element (used by CSS)
    root.setAttribute("data-theme", theme);
    
    // Save preference to localStorage for persistence across sessions
    localStorage.setItem("theme", theme);

    // Update toggle button emoji: sun for dark mode, moon for light mode
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  // Initialize theme on page load (use saved preference or system default)
  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme || getSystemTheme());

  // Toggle theme when button is clicked
  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || getSystemTheme();
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // Apply font size to root element
  function applyFont(sizePx) {
    root.style.fontSize = sizePx; // Set font size on <html>
    localStorage.setItem("fontSize", sizePx); // Save to localStorage

    // Update button text: A- for large (to make smaller), A+ for small (to make larger)
    if (fontToggle) fontToggle.textContent = sizePx === "18px" ? "A-" : "A+";
  }

  // Initialize font size on page load
  const savedFont = localStorage.getItem("fontSize");
  applyFont(savedFont || "16px"); // Default to 16px if no saved preference

  // Toggle font size when button is clicked
  fontToggle?.addEventListener("click", () => {
    const current = localStorage.getItem("fontSize") || "16px";
    applyFont(current === "16px" ? "18px" : "16px");
  });
 
  // Check if viewport is mobile size
  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;

  // Open the mobile menu
  function openMenu() {
    // Only open if elements exist and viewport is mobile
    if (!menu || !backdrop || !isMobile()) return;

    // Show menu and backdrop
    menu.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    
    // Update ARIA attribute for accessibility
    menuToggle?.setAttribute("aria-expanded", "true");
    
    // Prevent body scroll while menu is open
    document.body.classList.add("menu-open");
  }

  // Close the mobile menu
  function closeMenuFn() {
    if (!menu || !backdrop) return;

    // Hide menu and backdrop
    menu.classList.add("hidden");
    backdrop.classList.add("hidden");
    
    // Update ARIA attribute
    menuToggle?.setAttribute("aria-expanded", "false");
    
    // Re-enable body scroll
    document.body.classList.remove("menu-open");
  }

  // Initialize menu as closed on page load
  closeMenuFn();

  // Toggle menu when hamburger button is clicked
  menuToggle?.addEventListener("click", () => {
    if (!menu) return;
    menu.classList.contains("hidden") ? openMenu() : closeMenuFn();
  });

  // Close menu when X button is clicked
  closeMenu?.addEventListener("click", closeMenuFn);
  
  // Close menu when backdrop (dark overlay) is clicked
  backdrop?.addEventListener("click", closeMenuFn);

  // Close menu when any navigation link inside it is clicked
  menu?.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenuFn();
  });

  // Close menu when ESC key is pressed (accessibility)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenuFn();
  });

  // Auto-close menu when window is resized to desktop width
  window.addEventListener("resize", () => {
    if (!isMobile()) closeMenuFn();
  });

  // List of CSS selectors for elements to animate on scroll
  const SELECTORS = [
    "#home",              // Hero section
    "#home .profile-pic", // Profile picture
    "#home .hero-title",  // Hero title
    "#about",             // About section
    "#projects",          // Projects section
    ".project",           // Individual project cards
    "#skills",            // Skills section
    "#contact",           // Contact section
    "footer"              // Footer
  ];

  // Collect all unique DOM elements matching the selectors
  const targets = [];
  SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!targets.includes(el)) targets.push(el); // Avoid duplicates
    });
  });

  // Add 'reveal' class to all target elements (CSS hides them initially)
  targets.forEach(el => el.classList.add("reveal"));

  // Check if user prefers reduced motion (accessibility)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  // If reduced motion is preferred OR browser doesn't support IntersectionObserver
  if (prefersReduced || !("IntersectionObserver" in window)) {
    // Show all elements immediately without animation
    targets.forEach(el => el.classList.add("show"));
  } else {
    // Create IntersectionObserver to detect when elements enter viewport
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        // When element is visible in viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("show"); // Trigger CSS animation
          obs.unobserve(entry.target);        // Stop observing (animate once only)
        }
      });
    }, { 
      threshold: 0.12,                    // Trigger when 12% of element is visible
      rootMargin: "0px 0px -8% 0px"       // Start animation slightly before element enters viewport
    });

    // Start observing all target elements
    targets.forEach(el => io.observe(el));
  }
})();

// ===== Projects: filter, search, sort =====
const projects = Array.from(document.querySelectorAll('.project'));
const filterBtn = document.getElementById('project-filter-btn');
const filterMenu = document.getElementById('project-filter-menu');
const filterOptions = Array.from(document.querySelectorAll('.custom-option'));
const sortYearBtn = document.getElementById('sort-year');
const sortNameBtn = document.getElementById('sort-name');
const noProjectsMsg = document.getElementById('no-projects-msg');

// Container that holds the project cards
const projectGrid = document.getElementById('project-grid');

let currentSort = null;
let selectedCategory = 'all';

function filterProjects() {
  const category = selectedCategory;

  let visible = projects.filter(p => {
    const cat = p.dataset.category || '';
    return category === 'all' || cat === category;
  });

  if (currentSort === 'year') {
    visible.sort((a, b) => Number(b.dataset.year) - Number(a.dataset.year));
  } else if (currentSort === 'name') {
    visible.sort((a, b) => (a.dataset.title || '').localeCompare(b.dataset.title || ''));
  }

  projects.forEach(p => p.style.display = 'none');

  visible.forEach(p => {
    p.style.display = '';
    projectGrid?.appendChild(p);
  });

  if (noProjectsMsg) noProjectsMsg.hidden = visible.length > 0;
}

filterBtn?.addEventListener('click', () => {
  const isOpen = !filterMenu.classList.contains('hidden');
  filterMenu.classList.toggle('hidden');
  filterBtn.setAttribute('aria-expanded', String(!isOpen));
});

filterOptions.forEach(option => {
  option.addEventListener('click', () => {
    selectedCategory = option.dataset.value || 'all';
    filterBtn.textContent = option.textContent;

    filterOptions.forEach(opt => {
      opt.classList.remove('selected');
      opt.setAttribute('aria-selected', 'false');
    });

    option.classList.add('selected');
    option.setAttribute('aria-selected', 'true');

    filterMenu.classList.add('hidden');
    filterBtn.setAttribute('aria-expanded', 'false');

    filterProjects();
  });
});

document.addEventListener('click', e => {
  const wrap = document.getElementById('project-filter-wrap');
  if (wrap && !wrap.contains(e.target)) {
    filterMenu?.classList.add('hidden');
    filterBtn?.setAttribute('aria-expanded', 'false');
  }
});

sortYearBtn?.addEventListener('click', () => {
  currentSort = currentSort === 'year' ? null : 'year';
  sortYearBtn.classList.toggle('active', currentSort === 'year');
  sortNameBtn.classList.remove('active');
  filterProjects();
});

sortNameBtn?.addEventListener('click', () => {
  currentSort = currentSort === 'name' ? null : 'name';
  sortNameBtn.classList.toggle('active', currentSort === 'name');
  sortYearBtn.classList.remove('active');
  filterProjects();
});

// ===== Contact form =====
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

function showFeedback(message, type) {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.className = `form-message show ${type}`;
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const subject = document.getElementById('subject')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  if (!name || !email || !subject || !message) {
    showFeedback('Please fill in all fields before sending.', 'error');
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    showFeedback('Please enter a valid email address.', 'error');
    return;
  }

  showFeedback('Sending message...', 'success');

  try {
    await emailjs.send("service_tm9i09c", "template_jho9g2r", {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message
    });

    showFeedback('Message sent successfully!', 'success');
    contactForm.reset();

  } catch (error) {
  console.error('Full EmailJS error:', JSON.stringify(error, null, 2));
  console.error(error);
  showFeedback('Failed to send message. Please try again.', 'error');
  }
});

filterProjects();
