// ELEMENTS
const root = document.documentElement;
const themeToggle = document.querySelector('#themeToggle');
const scrollMeter = document.querySelector('#scrollMeter');
const timeline = document.querySelector('#timeline');
const timelineProgress = document.querySelector('#timelineProgress');
const moments = [...document.querySelectorAll('.moment')];
const eraLinks = [...document.querySelectorAll('.era-nav a')];

// THEME
const savedTheme = readStoredTheme();
const preferredTheme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.querySelector('strong').textContent = theme;
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  try {
    localStorage.setItem('music-history-theme', theme);
  } catch (_) {
    // STORAGE CAN BE UNAVAILABLE IN RESTRICTED BROWSER CONTEXTS
  }
}

function readStoredTheme() {
  try {
    return localStorage.getItem('music-history-theme');
  } catch (_) {
    return null;
  }
}

// SCROLL STATE
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

moments.forEach(moment => revealObserver.observe(moment));

function updateScrollState() {
  const doc = document.documentElement;
  const pageRange = doc.scrollHeight - innerHeight;
  scrollMeter.style.width = `${pageRange ? (scrollY / pageRange) * 100 : 0}%`;

  const bounds = timeline.getBoundingClientRect();
  const timelineRange = bounds.height + innerHeight * 0.35;
  const progress = Math.max(0, Math.min(1, (innerHeight * 0.4 - bounds.top) / timelineRange));
  timelineProgress.style.height = `${progress * 100}%`;

  let current = moments[0];
  moments.forEach(moment => {
    const rect = moment.getBoundingClientRect();
    if (rect.top < innerHeight * 0.57) current = moment;
  });

  moments.forEach(moment => moment.classList.toggle('active', moment === current));
  const era = current.dataset.era;
  eraLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${era}`));
}

addEventListener('scroll', updateScrollState, { passive: true });
addEventListener('resize', updateScrollState);
updateScrollState();
