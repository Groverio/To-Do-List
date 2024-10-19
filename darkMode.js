function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    localStorage.setItem('darkMode', 'disabled');
  }
}

function checkDarkModePreference() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkDarkModePreference();

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  } else {
    console.error('Dark mode toggle button not found');
  }
});
