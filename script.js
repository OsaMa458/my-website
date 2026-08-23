document.getElementById('year').textContent = new Date().getFullYear();

/* ---- Mobile nav toggle ---- */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Audit checklist "scan" animation, on view ---- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const auditItems = document.querySelectorAll('#audit-list li');
const progressFill = document.getElementById('progress-fill');
const panelScore = document.getElementById('panel-score');
const scanStatus = document.getElementById('scan-status');
const totalItems = auditItems.length;

function runAudit() {
  if (prefersReducedMotion) {
    auditItems.forEach(li => li.classList.add('is-checked'));
    progressFill.style.width = '100%';
    panelScore.textContent = '100% complete';
    scanStatus.textContent = 'complete';
    scanStatus.classList.add('is-done');
    return;
  }

  auditItems.forEach((li, index) => {
    const delay = parseInt(li.dataset.delay, 10);
    setTimeout(() => {
      li.classList.add('is-checked');
      const percent = Math.round(((index + 1) / totalItems) * 100);
      progressFill.style.width = percent + '%';
      panelScore.textContent = percent + '% complete';
      if (index === totalItems - 1) {
        scanStatus.textContent = 'complete';
        scanStatus.classList.add('is-done');
      }
    }, delay);
  });
}

let hasRun = false;
const panel = document.querySelector('.hero-panel');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasRun) {
      hasRun = true;
      runAudit();
      observer.disconnect();
    }
  });
}, { threshold: 0.4 });

if (panel) observer.observe(panel);
