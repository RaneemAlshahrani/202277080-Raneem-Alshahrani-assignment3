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
    "#home p",   // Hero description
    "#about",             // About section
    "#projects",          // Projects section
    ".project",           // Individual project cards
    "#skills",            // Skills section
    "#contact",           // Contact section
    "footer",              // Footer
    ".github-title",       // GitHub title
    ".repos-container",       // Container for GitHub repos
    "#timer"               // Timer section
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

// fetch my repo from github api and display it after projects section
// ===== GitHub API =====
const reposContainer = document.getElementById("github-repos");
const GitHubUserName = "RaneemAlshahrani";

// ===== Load repos =====
async function fetchGitHubRepos() {
  if (!reposContainer) return;

  reposContainer.innerHTML = `<p class="loading-message">Loading repositories...</p>`;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GitHubUserName}/repos?sort=updated`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    let repos = await response.json();

    // Remove forks
    repos = repos.filter(repo => !repo.fork);

    // Sort by latest update
    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (repos.length === 0) {
      reposContainer.innerHTML = `<p class="empty-message">No repositories found.</p>`;
      return;
    }

    reposContainer.innerHTML = repos.map(repo => {
      const color = getLanguageColor(repo.language);

      return `
        <article class="repo-card">
          <div class="repo-header">
            <h3>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                ${repo.name}
              </a>
            </h3>
            <span class="repo-badge public">Public</span>
          </div>

          <p class="repo-description">
            ${repo.description || 'No description available.'}
          </p>

          <div class="repo-meta">
            <span class="repo-language">
              ${
                repo.language
                  ? `<span class="language-dot" style="background:${color}"></span>${repo.language}`
                  : ''
              }
            </span>

            <span class="repo-updated">
              Updated ${formatDate(repo.updated_at)}
            </span>
          </div>
        </article>
      `;
    }).join("");

  } catch (error) {
    console.error("GitHub API Error:", error);

    reposContainer.innerHTML = `
      <p class="error-message">
        Unable to load repositories. Please try again later.
      </p>
    `;
  }
}

// ===== Date formatter =====
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ===== Language colors =====
function getLanguageColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219"
  };

  return colors[lang] || "#8b5cf6";
}

// ===== Run after page loads =====
document.addEventListener("DOMContentLoaded", fetchGitHubRepos);

// ===== Visit Timer with sessionStorage =====
const timerElement = document.getElementById("visit-timer");

// Load saved time or start from 0
let secondsOnSite = Number(sessionStorage.getItem("time")) || 0;

// Function to update display
function updateTimerDisplay() {
  if (secondsOnSite < 60) {
    timerElement.textContent =
      `${secondsOnSite} second${secondsOnSite !== 1 ? "s" : ""}`;
  } else {
    const minutes = Math.floor(secondsOnSite / 60);
    const seconds = secondsOnSite % 60;

    timerElement.textContent =
      `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
}

// Show initial value immediately
updateTimerDisplay();

// Update every second
setInterval(() => {
  secondsOnSite++;
  sessionStorage.setItem("time", secondsOnSite);
  updateTimerDisplay();
}, 1000);

// Get elements
const visitorNameInput = document.getElementById("visitor-name");
const saveNameBtn = document.getElementById("save-name");
const clearNameBtn = document.getElementById("clear-name");
const nameDisplay = document.getElementById("name-display");

// Load saved name from localStorage
let savedName = localStorage.getItem("visitorName") || "";

// Function to update displayed welcome message
function updateNameUI() {
  if (savedName.trim() !== "") {
    nameDisplay.textContent = `Welcome, ${savedName}!`;
  } else {
    nameDisplay.textContent = "Welcome, guest!";
  }
}

// Show saved name on page load
updateNameUI();

// Save name when button is clicked
saveNameBtn.addEventListener("click", () => {
  const enteredName = visitorNameInput.value.trim();

  // Only save if input is not empty
  if (enteredName !== "") {
    savedName = enteredName;
    localStorage.setItem("visitorName", savedName);
    updateNameUI();

    // Clear input after saving
    visitorNameInput.value = "";
  }
});

// Clear saved name
clearNameBtn.addEventListener("click", () => {
  savedName = "";
  localStorage.removeItem("visitorName");
  updateNameUI();
  visitorNameInput.value = "";
});

