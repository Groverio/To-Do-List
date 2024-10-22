const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', function () {
    // Toggle dark mode on the body, navbar, section, and footer
    document.body.classList.toggle('dark-mode');
    document.querySelector('nav').classList.toggle('dark-mode');
    document.querySelector('section').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');

    // Change the button text based on the mode
    if (document.body.classList.contains('dark-mode')) {
        themeBtn.textContent = 'Light Mode';
    } else {
        themeBtn.textContent = 'Dark Mode';
    }
});

