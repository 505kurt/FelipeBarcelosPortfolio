function toggleGlow(el) {
    document.querySelectorAll('.header-buttons').forEach(item => {
      item.classList.remove('active');
    });

    el.classList.add('active');

}

const toggleBtn = document.querySelector('.dark-mode-toggler');
const sunIcon = document.querySelector('.icon-sun');
const moonIcon = document.querySelector('.icon-moon');

function showIcon(icon) {
  icon.style.opacity = '1';
  icon.style.visibility = 'visible';
  icon.style.transition = 'opacity 0.3s ease';
}

function hideIcon(icon) {
  icon.style.opacity = '0';
  icon.style.visibility = 'hidden';
  icon.style.transition = 'opacity 0.3s ease';
}

function enableDarkMode() {
  document.body.classList.remove('dark-mode-inactive');
  hideIcon(sunIcon);
  showIcon(moonIcon);
  localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
  document.body.classList.add('dark-mode-inactive');
  hideIcon(moonIcon);
  showIcon(sunIcon);
  localStorage.setItem('darkMode', 'disabled');
}

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function initializeTheme() {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'enabled') {
    enableDarkMode();
  } else if (savedMode === 'disabled') {
    disableDarkMode();
  } else {
    if (systemPrefersDark()) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }
}

toggleBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode-inactive')) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

initializeTheme();